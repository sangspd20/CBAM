using CBAMONLINE.Models;
using CBAMONLINE.Models.Auth.ChangePassword;
using CBAMONLINE.Models.Auth.ForgotPassword;
using CBAMONLINE.Models.Auth.Login;
using CBAMONLINE.Models.Auth.ResetPassword;
using CBAMONLINE.Models.Auth.SignUp;

namespace CBAMONLINE.Services.IServices
{
    public interface IAuthService
    {
        Task<MutationResponse<LoginResponse>> Login(LoginRequest request);
        Task<MutationResponse<BaseResponse>> SignUp(SignUpRequest request);
        Task<MutationResponse<BaseResponse>> ChangePassword(ChangePasswordRequest request);
        Task<MutationResponse<BaseResponse>> ForgotPassword(ForgotPasswordRequest request);
        Task<MutationResponse<BaseResponse>> ResetPassword(ResetPasswordRequestApi request);
    }
}
