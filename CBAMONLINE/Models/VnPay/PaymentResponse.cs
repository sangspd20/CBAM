namespace CBAMONLINE.Models.VnPay
{
    public class PaymentResponse
    {
        public string OrderDescription { get; set; }
        public string TransactionId { get; set; }
        public string OrderId { get; set; }
        public string PaymentMethod { get; set; }
        public string PaymentId { get; set; }
        public bool Success { get; set; }
        public string Token { get; set; }
        public string VnPayResponseCode { get; set; }
        public string Amount { get; set; }
        public string TerminalId { get; set; }
        public string BankCode { get; set; }
        public string Message { get; set; }
        public string LogMessage { get; set; }
        public string Id { get; set; }

    }
}
