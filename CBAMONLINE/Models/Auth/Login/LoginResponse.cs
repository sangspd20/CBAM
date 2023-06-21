namespace CBAMONLINE.Models.Auth.Login
{
    public class LoginResponse : BaseResponse
    {
        public string accessToken { get; set; }
        public long expiresIn { get; set; }
        public string refreshToken { get; set; }
        public string strExpires { get; set; }
        public string avatar { get; set; }
        public string email { get; set; }
        public string fullName { get; set; }

    }
}
