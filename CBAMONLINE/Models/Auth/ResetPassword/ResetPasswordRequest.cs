using System.ComponentModel.DataAnnotations;

namespace CBAMONLINE.Models.Auth.ResetPassword
{
    public class ResetPasswordRequest
    {


        [Required(ErrorMessage = "Vui lòng nhập mật khẩu mới!")]
        public string newpassword { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập xác nhận mật khẩu mới!")]
        [Compare("newpassword", ErrorMessage = "Mật khẩu mới không trùng khớp!")]
        public string newpasswordConfirm { get; set; }
        public string? code { get; set; }

    }
}
