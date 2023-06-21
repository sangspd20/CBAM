using Microsoft.AspNetCore.DataProtection;

namespace CBAMONLINE.Infrastructure.Security
{
    public class CustomIDataProtection
    {
        private readonly IDataProtector protector;
        public CustomIDataProtection(IDataProtectionProvider dataProtectionProvider)
        {
            protector = dataProtectionProvider.CreateProtector("CustomIDataProtectionKey");
        }
        public string Encode(string data)
        {
            return protector.Protect(data);
        }
        public string Decode(string data)
        {
            return protector.Unprotect(data);
        }
    }
}
