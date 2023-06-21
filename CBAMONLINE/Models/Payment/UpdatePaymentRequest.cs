namespace CBAMONLINE.Models.Payment
{
    public class UpdatePaymentRequest
    {
        public string description { get; set; }
        public string id { get; set; }
        public string orderId { get; set; }
        public string paymentId { get; set; }
        public string paymentMethod { get; set; }
        public string responseCode { get; set; }
        public string token { get; set; }
        public string transactionId { get; set; }
        public decimal amount { get; set; }
        public bool status { get; set; }
    }
}
