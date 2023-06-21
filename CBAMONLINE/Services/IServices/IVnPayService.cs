using CBAMONLINE.Models.VnPay;

namespace CBAMONLINE.Services.IServices
{
    public interface IVnPayService
    {
        string CreatePaymentUrl(PaymentInformation model, HttpContext context);
        PaymentResponse PaymentExecute(IQueryCollection collections, string queryString);
    }
}
