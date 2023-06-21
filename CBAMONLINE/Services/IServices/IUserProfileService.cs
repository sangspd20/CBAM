using CBAMONLINE.Models;
using CBAMONLINE.Models.Auth.ChangePassword;
using CBAMONLINE.Models.Auth.Login;
using CBAMONLINE.Models.Auth.SignUp;
using CBAMONLINE.Models.UserProfile;

namespace CBAMONLINE.Services.IServices
{
    public interface IUserProfileService
    {
        Task<QueryResponse<UserProfile>> GetUserProfile(string accessToken = "");
        Task<MutationResponse<BaseResponse>> UpdateProfile(UserProfile request);

        Task UpdateUserProfileCookie ();
    }
}
