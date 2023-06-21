using CBAMONLINE.Infrastructure.Constants;
using CBAMONLINE.Models.Auth.Login;
using CBAMONLINE.Models;
using Microsoft.AspNetCore.Mvc.Filters;
using CookieManager;
using Microsoft.AspNetCore.Authorization;

namespace CBAMONLINE.Infrastructure.Filters
{
 
    public class CustomActionFilter : IActionFilter
    {
        private readonly ICookieManager _cookieManager;

        public CustomActionFilter(ICookieManager cookieManager)
        {
            _cookieManager = cookieManager;
        }
        public void OnActionExecuting(ActionExecutingContext context)
        {
            bool hasAllowAnonymous = context.ActionDescriptor.EndpointMetadata
                               .Any(em => em.GetType() == typeof(AllowAnonymousAttribute));

            if (hasAllowAnonymous) return;

            // our code before action executes
            MyCookie<LoginResponse> authCookieObj = _cookieManager.Get<MyCookie<LoginResponse>>(CookieConstants.AUTH_COOKIE);
            if (authCookieObj == null)
            {
                context.HttpContext.Response.Redirect("/Auth/Login");
            }
        }
        public void OnActionExecuted(ActionExecutedContext context)
        {
            // our code after action executes
        }
    }
}
