using AutoMapper;
using CBAMONLINE.Infrastructure.Constants;
using CBAMONLINE.Models.Auth.Login;
using CBAMONLINE.Models;
using CBAMONLINE.Models.UserProfile;
using CBAMONLINE.Services.IServices;
using CookieManager;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace CBAMONLINE.Controllers
{
    public class UserProfileController : Controller
    {
        private readonly IUserProfileService _userProfileService;
        private readonly IMapper _mapper;
        private readonly ICookieManager _cookieManager;
        private readonly IWebHostEnvironment _hostEnvironment;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserProfileController(
             IUserProfileService userProfileService,
            IMapper mapper,
            ICookieManager cookieManager,
            IWebHostEnvironment hostEnvironment,
        IHttpContextAccessor httpContextAccessor
            )
        {
            _userProfileService = userProfileService;
            _mapper = mapper;
            _cookieManager = cookieManager;
            _hostEnvironment = hostEnvironment;
            _httpContextAccessor = httpContextAccessor;
        }

        //[HttpGet]
        //public async Task<IActionResult> GetUserProfile()
        //{
        //    try
        //    {
        //        var result = await _userProfileService.GetUserProfile();

        //        if (result.queryResponse != null)
        //        {
        //            MyCookie<LoginResponse> authCookieObj = _cookieManager.Get<MyCookie<LoginResponse>>(CookieConstants.AUTH_COOKIE);

        //            // expires same with auth cookie
        //            MyCookie<UserProfile> userCookie = new MyCookie<UserProfile>()
        //            {
        //                Id = Guid.NewGuid().ToString(),
        //                Value = result.queryResponse,
        //                Date = DateTime.Now,
        //                Expires = authCookieObj.Expires
        //            };

        //            _cookieManager.Set(CookieConstants.USER_COOKIE, userCookie, new CookieOptions() { HttpOnly = true, Expires = authCookieObj.Expires });
        //        }
        //        return Ok(result);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }

        //}

        [HttpPost]
        public async Task<IActionResult> UpdateProfile(IFormFile avatar, string data)
        {
            try
            {
                UserProfile userProfile = new UserProfile();
                if (!string.IsNullOrEmpty(data))
                {
                    userProfile = JsonConvert.DeserializeObject<UserProfile>(data);
                }

                if (avatar != null)
                {
                    // delete curren avatar
                    if (userProfile != null)
                    {
                        if (!string.IsNullOrEmpty(userProfile.avatar))
                        {
                            var fileName = Path.GetFileName(userProfile.avatar);
                            string exitingFile = Path.Combine(_hostEnvironment.WebRootPath, Constants.AvatarRootPath, fileName);
                            var existed = System.IO.File.Exists(exitingFile);
                            if (existed)
                                System.IO.File.Delete(exitingFile);
                        }
                    }

                    string uniqueFileName = Guid.NewGuid().ToString() + "-" + avatar.FileName;

                    string pathPhoto = Path.Combine(_hostEnvironment.WebRootPath, Constants.AvatarRootPath);
                    if (!Directory.Exists(pathPhoto))
                    {
                        Directory.CreateDirectory(pathPhoto);
                    }

                    using (FileStream stream = new FileStream(Path.Combine(pathPhoto, uniqueFileName), FileMode.Create))
                    {
                        avatar.CopyTo(stream);
                    }

                    userProfile.avatar = Constants.AvatarPath + uniqueFileName;
                }

                var result = await _userProfileService.UpdateProfile(userProfile);
                if(result != null && result.mutationResponse != null)
                {
                    // reset user cookie after update
                    var userProfileResult = await _userProfileService.GetUserProfile();

                    if (userProfileResult.queryResponse != null)
                    {
                        MyCookie<LoginResponse> authCookieObj = _cookieManager.Get<MyCookie<LoginResponse>>(CookieConstants.AUTH_COOKIE);

                        // expires same with auth cookie
                        MyCookie<UserProfile> userCookie = new MyCookie<UserProfile>()
                        {
                            Id = Guid.NewGuid().ToString(),
                            Value = userProfileResult.queryResponse,
                            Date = DateTime.Now,
                            Expires = authCookieObj.Expires
                        };

                        _cookieManager.Set(CookieConstants.USER_COOKIE, userCookie, new CookieOptions() { HttpOnly = true, Expires = authCookieObj.Expires });
                    }
                }

                return Ok(result);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        public ActionResult Index()
        {

            return View();
        }
    }
}
