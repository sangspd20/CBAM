namespace CBAMONLINE.Models.Auth.ChangePassword
{
    public class ChangePasswordRequest
    {
        public string userName {  get; set; }
        public string oldPassword {  get; set; }
        public string newpassword {  get; set; }

    }
}
