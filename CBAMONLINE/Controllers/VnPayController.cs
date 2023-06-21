using CBAMONLINE.Infrastructure.Constants;
using CBAMONLINE.Models.Auth.Login;
using CBAMONLINE.Models;
using CBAMONLINE.Models.Payment;
using CBAMONLINE.Models.UserProfile;
using CBAMONLINE.Models.VnPay;
using CBAMONLINE.Services.IServices;
using Microsoft.AspNetCore.Mvc;
using CookieManager;

namespace CBAMONLINE.Controllers
{
    public class VnPayController : Controller
    {
        private readonly IVnPayService _vnPayService;
        private readonly IPaymentService _paymentService;
        private readonly IUserProfileService _userProfileService;
        private readonly ICookieManager _cookieManager;

        public VnPayController(
             IVnPayService vnPayService,
             IPaymentService paymentService,
             IUserProfileService userProfileService,
             ICookieManager cookieManager
            )
        {
            _vnPayService = vnPayService;
            _paymentService = paymentService;
            _userProfileService = userProfileService;
            _cookieManager = cookieManager;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult CreatePaymentUrl([FromBody] PaymentInformation model)
        {
            try
            {
                var url = _vnPayService.CreatePaymentUrl(model, HttpContext);
                CreatePaymentUrlResponse result = new CreatePaymentUrlResponse() { url = url };
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        public async Task<IActionResult> PaymentCallback()
        {
            try
            {
                var response = _vnPayService.PaymentExecute(Request.Query, Request.QueryString.Value);
              
                if (response.Success)
                {
                    var idArray = response.OrderDescription.Split('-');
                    var id = response.OrderDescription.Split('-')[idArray.Length - 1];
                    UpdatePaymentRequest updatePaymentRequest = new UpdatePaymentRequest()
                    {
                        amount = decimal.Parse(response.Amount),
                        description = response.OrderDescription,
                        id = id,
                        orderId = response.OrderId,
                        paymentId = response.PaymentId,
                        paymentMethod = response.PaymentMethod,
                        responseCode = response.VnPayResponseCode,
                        status = response.Success,
                        token = response.Token,
                        transactionId = response.TransactionId,
                    };

                    var result = await _paymentService.UpdatePayment(updatePaymentRequest);
                    // reset user cookie after update
                    await _userProfileService.UpdateUserProfileCookie();

                    TempData["success"] = "Thanh toán thành công!";
                }
                else
                    TempData["error"] = "Thanh toán thất bại!";

                return RedirectToAction("Index", "UserProfile");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

    }
}
