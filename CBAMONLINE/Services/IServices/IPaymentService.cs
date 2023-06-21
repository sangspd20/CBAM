using CBAMONLINE.Models;
using CBAMONLINE.Models.Payment;

namespace CBAMONLINE.Services.IServices
{
    public interface IPaymentService
    {
        Task<MutationResponse<BaseResponse>> CreatePayment(CreatePaymentRequest request);
        Task<MutationResponse<BaseResponse>> UpdatePayment(UpdatePaymentRequest request);
    }
}
