using System.ComponentModel.DataAnnotations;

namespace CBAMONLINE.Models.Auth.SignUp
{
    public class SignUpRequest
    {
        [Required(ErrorMessage = "Vui lòng nhập email!")]
        [EmailAddress(ErrorMessage = "Vui lòng đúng định dạng email!")]
        public string email { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập tên!")]
        public string firstName { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập giới tính!")]
        public string gender { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập họ!")]
        public string lastName { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập password!")]
        public string password { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập tài khoản!")]
        public string userName { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập số điện thoại!")]
        [Phone]
        public string phone { get; set; }
    }


}
