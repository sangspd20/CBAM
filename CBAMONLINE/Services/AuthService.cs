using CBAMONLINE.Models;
using CBAMONLINE.Models.Auth.ChangePassword;
using CBAMONLINE.Models.Auth.ForgotPassword;
using CBAMONLINE.Models.Auth.Login;
using CBAMONLINE.Models.Auth.ResetPassword;
using CBAMONLINE.Models.Auth.SignUp;
using CBAMONLINE.Services.IServices;
using Newtonsoft.Json;
using System.Reflection;

namespace CBAMONLINE.Services
{
    public class AuthService : IAuthService
    {
        private readonly IGraphQLFactory _client;
        public AuthService(IGraphQLFactory client)
        {
            _client = client;
        }

        public async Task<MutationResponse<BaseResponse>> ChangePassword(ChangePasswordRequest request)
        {
            var query = @"mutation ($input: PersonChangePasswordInput!){ 
							mutationResponse:changePassword(input: $input){message,statusCode}}";
            var response = await _client.ExecuteGQlMutation<MutationResponse<BaseResponse>>(query, credentials: true, variables: new { input = request });
            return response;
        }

        public async Task<MutationResponse<BaseResponse>> ForgotPassword(ForgotPasswordRequest request)
        {
            var query = @"mutation ($input: PersonActiveInput!){ 
							mutationResponse:forgotpassword(input: $input){message,statusCode}}";
            var response = await _client.ExecuteGQlMutation<MutationResponse<BaseResponse>>(query, variables: new { input = request });
            return response;
        }

        public async Task<MutationResponse<LoginResponse>> Login(LoginRequest request)
        {
            var query = @"mutation ($input: PersonLoginInput!){ 
							mutationResponse:login(input: $input) {accessToken,expiresIn,strExpires,statusCode,fullName,avatar,email}}";
            var response = await _client.ExecuteGQlMutation<MutationResponse<LoginResponse>>(query, variables: new { input = request });
            return response;
        }

        public async Task<MutationResponse<BaseResponse>> ResetPassword(ResetPasswordRequestApi request)
        {

            var query = @"mutation ($input: PersonResetPasswordInput!){ 
							mutationResponse:resetPassword(input: $input) {message,statusCode}}";
            var response = await _client.ExecuteGQlMutation<MutationResponse<BaseResponse>>(query, variables: new { input = request });
            return response;
        }

        public async Task<MutationResponse<BaseResponse>> SignUp(SignUpRequest request)
        {
            var query = @"mutation ($input: PersonSignUpInput!){ 
							mutationResponse:signUpMember(input: $input) {message,statusCode}}";
            var response = await _client.ExecuteGQlMutation<MutationResponse<BaseResponse>>(query, variables: new { input = request });
            return response;
        }
    }
}
