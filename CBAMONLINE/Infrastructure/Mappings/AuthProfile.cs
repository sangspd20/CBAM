using AutoMapper;
using CBAMONLINE.Models.Auth.SignUp;

namespace CBAMONLINE.Infrastructure.Mappings
{

    public class AuthProfile : Profile
    {
        public AuthProfile()
        {
            CreateMap<SignUpRequestViewModel, SignUpRequest>().ReverseMap();
        }
    }
}
