using AutoMapper;
using CBAMONLINE.Infrastructure.Constants;
using CBAMONLINE.Models;
using CBAMONLINE.Models.Auth.ChangePassword;
using CBAMONLINE.Models.Auth.ForgotPassword;
using CBAMONLINE.Models.Auth.Login;
using CBAMONLINE.Models.Auth.ResetPassword;
using CBAMONLINE.Models.Auth.SignUp;
using CBAMONLINE.Models.UserProfile;
using CBAMONLINE.Services;
using CBAMONLINE.Services.IServices;
using CookieManager;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;
using System.Net;
using System.Reflection;
using System.Xml.Linq;

namespace CBAMONLINE.Controllers
{
    public class AuthController : Controller
    {
        private readonly IAuthService _authService;
        private readonly IUserProfileService _userProfileService;
        private readonly IMapper _mapper;
        private readonly ICookieManager _cookieManager;


        public AuthController(
            IAuthService authService,
            IMapper mapper,
            ICookieManager cookieManager,
            IUserProfileService userProfileService
            )
        {
            _authService = authService;
            _mapper = mapper;
            _cookieManager = cookieManager;
            _userProfileService = userProfileService;
        }

        [AllowAnonymous]
        public IActionResult Logout()
        {
            _cookieManager.Remove(CookieConstants.AUTH_COOKIE);
            _cookieManager.Remove(CookieConstants.USER_COOKIE);
            return RedirectToAction("Login", "Auth");
        }

        [AllowAnonymous]
        [HttpGet]
        public ActionResult Login()
        {
            return View();
        }


        // Get the myCookie object

        [AllowAnonymous]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var result = await _authService.Login(request);
                    if (result.mutationResponse != null && result.mutationResponse.statusCode == (int)HttpStatusCode.OK)
                    {
                        // save token to cookie
                        MyCookie<LoginResponse> authCookie = new MyCookie<LoginResponse>()
                        {
                            Id = Guid.NewGuid().ToString(),
                            Value = result.mutationResponse,
                            Date = DateTime.Now,
                            Expires = DateTime.Now.AddMilliseconds(result.mutationResponse.expiresIn)
                        };

                        var cookieOptions = new CookieOptions()
                        {
                            IsEssential = true,
                            Expires = DateTime.Now.AddMilliseconds(result.mutationResponse.expiresIn),
                            HttpOnly = true
                        };

                        _cookieManager.Set(CookieConstants.AUTH_COOKIE, authCookie, cookieOptions);

                        // get profile and save to cookie
                        var userProfileResult = await _userProfileService.GetUserProfile(result.mutationResponse.accessToken);

                        if (userProfileResult.queryResponse != null)
                        {
                            // expires same with auth cookie
                            MyCookie<UserProfile> userCookie = new MyCookie<UserProfile>()
                            {
                                Id = Guid.NewGuid().ToString(),
                                Value = userProfileResult.queryResponse,
                                Date = DateTime.Now,
                                Expires = DateTime.Now.AddMilliseconds(result.mutationResponse.expiresIn)
                            };

                            _cookieManager.Set(CookieConstants.USER_COOKIE, userCookie, new CookieOptions() { HttpOnly = true, Expires = DateTime.Now.AddMilliseconds(result.mutationResponse.expiresIn), IsEssential = true });
                        }

                        return RedirectToAction("Index", "Home");
                    }
                    else
                    {
                        TempData["error"] = "Thông tin đăng nhập không đúng!";
                        return RedirectToAction("Login");
                    }
                }
                return BadRequest(ModelState);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public ActionResult SignUp()
        {
            return View();
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> SignUp(SignUpRequestViewModel request)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var result = await _authService.SignUp(_mapper.Map<SignUpRequest>(request));
                    return Ok(result);
                }

                return BadRequest(ModelState);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public ActionResult ForgotPassword()
        {
            return View();
        }

        [AllowAnonymous]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordRequest request)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var result = await _authService.ForgotPassword(request);
                    if (result.mutationResponse != null && result.mutationResponse.statusCode == (int)HttpStatusCode.OK)
                    {
                        TempData["success"] = "Vui lòng kiểm tra mail để reset mật khẩu!";
                    }
                    else
                    {
                        if (result.mutationResponse != null && result.mutationResponse.statusCode == (int)HttpStatusCode.LoopDetected)
                        {
                            TempData["error"] = "Bạn đã gửi yêu cầu trước đó. Vui lòng kiểm tra email";
                        }
                        else
                            TempData["error"] = result.mutationResponse.message;
                    }
                    return RedirectToAction("ForgotPassword");

                }

                return BadRequest(ModelState);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [AllowAnonymous]
        [HttpGet]
        public ActionResult ResetPassword()
        {
            return View();
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> ResetPassword(ResetPasswordRequest request)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    ResetPasswordRequestApi resetPasswordRequestApi = new ResetPasswordRequestApi()
                    {
                        password = request.newpassword,
                        code = request.code
                    };
                    var result = await _authService.ResetPassword(resetPasswordRequestApi);
                    return Ok(result);

                }
                return BadRequest(ModelState);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {

            try
            {
                MyCookie<UserProfile> userCookieObj = _cookieManager.Get<MyCookie<UserProfile>>(CookieConstants.USER_COOKIE);
                if (userCookieObj != null)
                    request.userName = userCookieObj.Value.userName;

                var result = await _authService.ChangePassword(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
