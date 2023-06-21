using System.Globalization;
using System.Net.Sockets;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using CBAMONLINE.Models.VnPay;
using CBAMONLINE.Services;

namespace CBAMONLINE.Infrastructure.Payment.VnPay
{
    public class VnPayLibrary
    {
        private readonly SortedList<string, string> _requestData = new SortedList<string, string>(new VnPayCompare());
        private readonly SortedList<string, string> _responseData = new SortedList<string, string>(new VnPayCompare());

        public PaymentResponse GetFullResponseData(IQueryCollection collection, string hashSecret, string queryString)
        {
            var vnPay = new VnPayLibrary();

            foreach (var (key, value) in collection)
            {
                if (!string.IsNullOrEmpty(key) && key.StartsWith("vnp_"))
                {
                    vnPay.AddResponseData(key, value);
                }
            }

            long orderId = Convert.ToInt64(vnPay.GetResponseData("vnp_TxnRef"));
            long vnpTranId = Convert.ToInt64(vnPay.GetResponseData("vnp_TransactionNo"));
            string vnpResponseCode = vnPay.GetResponseData("vnp_ResponseCode");
            string vnpTransactionStatus = vnPay.GetResponseData("vnp_TransactionStatus");
            long amount = Convert.ToInt64(vnPay.GetResponseData("vnp_Amount")) / 100;
            var vnpSecureHash =
                collection.FirstOrDefault(k => k.Key == "vnp_SecureHash").Value; //hash của dữ liệu trả về
            var terminalId =
               collection.FirstOrDefault(k => k.Key == "vnp_TmnCode").Value;
            var bankCode =
               collection.FirstOrDefault(k => k.Key == "vnp_BankCode").Value;
            var orderInfo = vnPay.GetResponseData("vnp_OrderInfo");

            var checkSignature =
                vnPay.ValidateSignature(vnpSecureHash, hashSecret); //check Signature

            var message = "";
            var logMessage = "";
            if (!checkSignature)
            {
                return new PaymentResponse()
                {
                    Success = false,
                    Message = "Có lỗi xảy ra trong quá trình xử lý. Invalid signature!",
                    LogMessage = string.Format("Invalid signature!, queryString={0}", queryString)
                };
            }
            else
            {
                if (vnpResponseCode == "00" && vnpTransactionStatus == "00")
                {
                    //Thanh toan thanh cong
                    message = "Giao dịch được thực hiện thành công. Cảm ơn quý khách đã sử dụng dịch vụ";
                    logMessage = string.Format("Thanh toan thanh cong, OrderId={0}, VNPAY TranId={1}", orderId, vnpTranId);
                }
                else
                {
                    //Thanh toan khong thanh cong. Ma loi: vnp_ResponseCode
                    return new PaymentResponse()
                    {
                        Success = false,
                        Message = "Có lỗi xảy ra trong quá trình xử lý.Mã lỗi: " + vnpResponseCode,
                        LogMessage = string.Format("Thanh toan loi, OrderId={0}, VNPAY TranId={1},ResponseCode={2}", orderId, vnpTranId, vnpResponseCode)
                    };
                }
            }

            return new PaymentResponse()
            {
                Success = true,
                PaymentMethod = "VnPay",
                OrderDescription = orderInfo,
                OrderId = orderId.ToString(),
                PaymentId = vnpTranId.ToString(),
                TransactionId = vnpTranId.ToString(),
                Token = vnpSecureHash,
                VnPayResponseCode = vnpResponseCode,
                Amount = amount.ToString(),
                TerminalId = terminalId,
                BankCode = bankCode,
                Message = message,
                LogMessage = logMessage,

            };
        }
        public string GetIpAddress(HttpContext context)
        {
            var ipAddress = string.Empty;
            try
            {
                var remoteIpAddress = context.Connection.RemoteIpAddress;

                if (remoteIpAddress != null)
                {
                    if (remoteIpAddress.AddressFamily == AddressFamily.InterNetworkV6)
                    {
                        remoteIpAddress = Dns.GetHostEntry(remoteIpAddress).AddressList
                            .FirstOrDefault(x => x.AddressFamily == AddressFamily.InterNetwork);
                    }

                    if (remoteIpAddress != null) ipAddress = remoteIpAddress.ToString();

                    return ipAddress;
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }

            return "127.0.0.1";
        }
        public void AddRequestData(string key, string value)
        {
            if (!string.IsNullOrEmpty(value))
            {
                _requestData.Add(key, value);
            }
        }

        public void AddResponseData(string key, string value)
        {
            if (!string.IsNullOrEmpty(value))
            {
                _responseData.Add(key, value);
            }
        }

        public string GetResponseData(string key)
        {
            return _responseData.TryGetValue(key, out var retValue) ? retValue : string.Empty;
        }

        public string CreateRequestUrl(string baseUrl, string vnpHashSecret)
        {
            var data = new StringBuilder();

            foreach (var (key, value) in _requestData.Where(kv => !string.IsNullOrEmpty(kv.Value)))
            {
                data.Append(WebUtility.UrlEncode(key) + "=" + WebUtility.UrlEncode(value) + "&");
            }

            var querystring = data.ToString();

            baseUrl += "?" + querystring;
            var signData = querystring;
            if (signData.Length > 0)
            {
                signData = signData.Remove(data.Length - 1, 1);
            }

            var vnpSecureHash = HmacSha512(vnpHashSecret, signData);
            baseUrl += "vnp_SecureHash=" + vnpSecureHash;

            return baseUrl;
        }

        public bool ValidateSignature(string inputHash, string secretKey)
        {
            var rspRaw = GetResponseData();
            var myChecksum = HmacSha512(secretKey, rspRaw);
            return myChecksum.Equals(inputHash, StringComparison.InvariantCultureIgnoreCase);
        }

        private string HmacSha512(string key, string inputData)
        {
            var hash = new StringBuilder();
            var keyBytes = Encoding.UTF8.GetBytes(key);
            var inputBytes = Encoding.UTF8.GetBytes(inputData);
            using (var hmac = new HMACSHA512(keyBytes))
            {
                var hashValue = hmac.ComputeHash(inputBytes);
                foreach (var theByte in hashValue)
                {
                    hash.Append(theByte.ToString("x2"));
                }
            }

            return hash.ToString();
        }

        private string GetResponseData()
        {
            var data = new StringBuilder();
            if (_responseData.ContainsKey("vnp_SecureHashType"))
            {
                _responseData.Remove("vnp_SecureHashType");
            }

            if (_responseData.ContainsKey("vnp_SecureHash"))
            {
                _responseData.Remove("vnp_SecureHash");
            }

            foreach (var (key, value) in _responseData.Where(kv => !string.IsNullOrEmpty(kv.Value)))
            {
                data.Append(WebUtility.UrlEncode(key) + "=" + WebUtility.UrlEncode(value) + "&");
            }

            //remove last '&'
            if (data.Length > 0)
            {
                data.Remove(data.Length - 1, 1);
            }

            return data.ToString();
        }
    }

    public class VnPayCompare : IComparer<string>
    {
        public int Compare(string x, string y)
        {
            if (x == y) return 0;
            if (x == null) return -1;
            if (y == null) return 1;
            var vnpCompare = CompareInfo.GetCompareInfo("en-US");
            return vnpCompare.Compare(x, y, CompareOptions.Ordinal);
        }
    }
}
