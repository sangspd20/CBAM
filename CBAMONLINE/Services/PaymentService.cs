using CBAMONLINE.Models;
using CBAMONLINE.Models.Auth.ChangePassword;
using CBAMONLINE.Models.Auth.Login;
using CBAMONLINE.Models.Auth.SignUp;
using CBAMONLINE.Models.Payment;
using CBAMONLINE.Models.UserProfile;
using CBAMONLINE.Services.IServices;
using Newtonsoft.Json;
using System.Reflection;

namespace CBAMONLINE.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IGraphQLFactory _client;
        public PaymentService(IGraphQLFactory client)
        {
            _client = client;
        }

        public async Task<MutationResponse<BaseResponse>> CreatePayment(CreatePaymentRequest request)
        {
            var query = @"mutation ($input: PersonPaymentPayloadInput!){ 
							mutationResponse:createPayment(input: $input) {message,statusCode}}";
            var response = await _client.ExecuteGQlMutation<MutationResponse<BaseResponse>>(query, credentials: true, variables: new { input = request });
            return response;
        }

        public async Task<MutationResponse<BaseResponse>> UpdatePayment(UpdatePaymentRequest request)
        {
            var query = @"mutation ($input: PersonpaymentPostBackPayloadInput!){ 
							mutationResponse:updatePayment(input: $input) {message,statusCode}}";
            var response = await _client.ExecuteGQlMutation<MutationResponse<BaseResponse>>(query, credentials: true, variables: new { input = request });
            return response;
        }
    }
}
