
using System.ComponentModel.DataAnnotations;

namespace CBAMONLINE.Models.Auth.SignUp
{
    public class SignUpRequestViewModel
    {
        [Required(ErrorMessage = "Vui lòng nhập email!")]
        [EmailAddress(ErrorMessage = "Vui lòng đúng định dạng email!")]
        public string email {  get; set; }
        [Required(ErrorMessage = "Vui lòng nhập tên!")]
        public string firstName {  get; set; }
        [Required(ErrorMessage = "Vui lòng nhập giới tính!")]
        public string gender {  get; set; }
        [Required(ErrorMessage = "Vui lòng nhập họ!")]
        public string lastName {  get; set; }
        [Required(ErrorMessage = "Vui lòng nhập password!")]
        public string password {  get; set; }

        [Required(ErrorMessage = "Vui lòng nhập password!")]
        [Compare("password", ErrorMessage = "Vui lòng nhập password giống nhau!")]
        public string confirmPassword { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập tài khoản!")]
        public string userName {  get; set; }

        [Required(ErrorMessage = "Vui lòng nhập số điện thoại!")]
        [MaxLength(10, ErrorMessage="Vui lòng không nhập quá 10 ký tự!")]
        [Phone]
        public string phone {  get; set; }

    }
}
