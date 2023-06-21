using System.ComponentModel.DataAnnotations;

namespace CBAMONLINE.Models.Auth.ForgotPassword
{
    public class ForgotPasswordRequest
    {
        [Required(ErrorMessage = "Vui lòng nhập email!")]
        [EmailAddress(ErrorMessage = "Vui lòng đúng định dạng email!")]
        public string email { get; set; }

    }
}
