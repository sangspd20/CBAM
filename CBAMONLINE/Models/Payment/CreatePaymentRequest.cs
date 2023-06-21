namespace CBAMONLINE.Models.Payment
{
    public class CreatePaymentRequest
    {
        public string email { get; set; }
        public string id { get; set; }
        public string name { get; set; }
        public string phone { get; set; }
        public decimal amount { get; set; }

    }
}
