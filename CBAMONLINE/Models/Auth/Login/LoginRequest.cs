using System.ComponentModel.DataAnnotations;

namespace CBAMONLINE.Models.Auth.Login
{
    public class LoginRequest
    {
        [Required(ErrorMessage = "Vui lòng nhập tài khoản!")]
        public string account { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập password!")]
        public string password { get; set; }

        //[Required(ErrorMessage = "Please choose profile image")]
        //[Display(Name = "Profile Picture")]
        //public IFormFile ProfileImage { get; set; }
    }
}
