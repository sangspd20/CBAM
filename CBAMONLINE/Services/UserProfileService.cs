using CBAMONLINE.Infrastructure.Constants;
using CBAMONLINE.Models;
using CBAMONLINE.Models.Auth.Login;
using CBAMONLINE.Models.UserProfile;
using CBAMONLINE.Services.IServices;
using CookieManager;

namespace CBAMONLINE.Services
{
    public class UserProfileService : IUserProfileService
    {
        private readonly IGraphQLFactory _client;
        private readonly ICookieManager _cookieManager;
        public UserProfileService(IGraphQLFactory client, ICookieManager cookieManager)
        {
            _client = client;
            _cookieManager = cookieManager;
        }

        public async Task<QueryResponse<UserProfile>> GetUserProfile(string accessToken = "")
        {
            var query = "query { queryResponse:personById() {address,avatar, dob, email, gender,id,phone,price,status,userName, lastName,firstName}}";
            var response = await _client.ExecuteGQlQuery<QueryResponse<UserProfile>>(query, credentials: true, accessToken: accessToken);
            return response;
        }

        public async Task<MutationResponse<BaseResponse>> UpdateProfile(UserProfile request)
        {
            var query = @"mutation ($input: PersonProfileInput!){ 
							mutationResponse:updateProfile(input: $input) {message,statusCode}}";
            var response = await _client.ExecuteGQlMutation<MutationResponse<BaseResponse>>(query, credentials: true, variables: new { input = request });
            return response;
        }

        public async Task UpdateUserProfileCookie()
        {
            // reset user cookie after update
            var userProfileResult = await GetUserProfile();

            if (userProfileResult.queryResponse != null)
            {
                MyCookie<LoginResponse> authCookieObj = _cookieManager.Get<MyCookie<LoginResponse>>(CookieConstants.AUTH_COOKIE);

                // expires same with auth cookie
                MyCookie<UserProfile> userCookie = new MyCookie<UserProfile>()
                {
                    Id = Guid.NewGuid().ToString(),
                    Value = userProfileResult.queryResponse,
                    Date = DateTime.Now,
                    Expires = authCookieObj.Expires
                };

                _cookieManager.Set(CookieConstants.USER_COOKIE, userCookie, new CookieOptions() { HttpOnly = true, Expires = authCookieObj.Expires });
            }
        }
    }
}
