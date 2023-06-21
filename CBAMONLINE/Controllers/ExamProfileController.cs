using CBAMONLINE.Infrastructure.Security;
using CBAMONLINE.Services.IServices;
using Microsoft.AspNetCore.Mvc;
using CBAMONLINE.Models.Exam.ExamProfile;
using System.Net;
using CookieManager;
using CBAMONLINE.Infrastructure.Constants;
using CBAMONLINE.Models;
using CBAMONLINE.Models.UserProfile;
using CBAMONLINE.Models.Contest;
using CBAMONLINE.Models.Auth.Login;

namespace CBAMONLINE.Controllers
{
    public class ExamProfileController : Controller
    {
        private readonly IExamProfileService _examProfileService;
        private readonly IUserProfileService _userProfileService;
        private readonly CustomIDataProtection _protector;
        private readonly IWebHostEnvironment _hostEnvironment;
        private readonly ICookieManager _cookieManager;
        private readonly IConfiguration _configuration;
        private readonly IContestService _contestService;

        public ExamProfileController(
            IExamProfileService examProfileService,
            CustomIDataProtection protector,
            IWebHostEnvironment hostEnvironment,
              ICookieManager cookieManager,
               IConfiguration configuration,
               IContestService contestService,
               IUserProfileService userProfileService

            )
        {
            _examProfileService = examProfileService;
            _protector = protector;
            _hostEnvironment = hostEnvironment;
            _cookieManager = cookieManager;
            _configuration = configuration;
            _contestService = contestService;
            _userProfileService = userProfileService;
        }


        [HttpGet]
        public async Task<IActionResult> GetExamProfile([FromQuery] string id)
        {
            try
            {
                var idDecode = _protector.Decode(id);
                var result = await _examProfileService.GetExamProfile(idDecode);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }


        [HttpPost]
        public async Task<IActionResult> UpdateExamProfile([FromBody] ExamProfile request)
        {

            try
            {
                if (!string.IsNullOrEmpty(request.examId))
                    request.examId = _protector.Decode(request.examId);

                var result = await _examProfileService.UpdateExamProfile(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet]
        public async Task<IActionResult> ExamRegister([FromQuery] string id, string mode, string slug)
        {
            ViewBag.ContestId = id;
            ContestDetailRequest request = new ContestDetailRequest()
            {
                mode = mode,
                slug = slug
            };

            var contestRegisterDetail = await _contestService.GetContestRegisterDetail(request);
            if (contestRegisterDetail != null && contestRegisterDetail.queryResponse != null)
            {
                contestRegisterDetail.queryResponse.id = _protector.Encode(contestRegisterDetail.queryResponse.id);
            }
            return View(contestRegisterDetail.queryResponse);
        }

        [HttpGet]
        public async Task<IActionResult> ExamReady([FromQuery] string id, string mode, string slug)
        {
            try
            {
                var isMustCapturePhoto = _configuration["SystemSettings:IsMustCapturePhoto"];
                ViewBag.ContestId = id;
                ViewBag.IsMustCapturePhoto = isMustCapturePhoto;

                ContestDetailRequest request = new ContestDetailRequest()
                {
                    mode = mode,
                    slug = slug
                };

                var contestDetail = await _contestService.GetContestDetail(request);
                if (contestDetail != null && contestDetail.queryResponse != null)
                {
                    contestDetail.queryResponse.id = _protector.Encode(contestDetail.queryResponse.id);
                }
                return View(contestDetail.queryResponse);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        public async Task<IActionResult> RegisterExam([FromBody] RegisterExamRequest request)
        {
            try
            {
                if (!string.IsNullOrEmpty(request.contestId))
                    request.contestId = _protector.Decode(request.contestId);

                var result = await _examProfileService.RegisterExam(request);
                if (result != null && result.mutationResponse != null)
                {
                    var statusCode = result.mutationResponse.statusCode;
                    // fail
                    if (statusCode == (int)HttpStatusCode.Forbidden)
                    {
                        TempData["error"] = "Quý khách không đủ tiền trong tài khoản! Vui lòng nạp thêm!";
                    }

                    // success
                    if (statusCode == (int)HttpStatusCode.OK)
                    {
                        await _userProfileService.UpdateUserProfileCookie();
                    }
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Capture([FromQuery] string id)
        {
            try
            {
                var files = HttpContext.Request.Form.Files;
                if (files != null)
                {
                    if (!string.IsNullOrEmpty(id))
                        id = _protector.Decode(id);

                    foreach (var file in files)
                    {
                        if (file.Length > 0)
                        {
                            MyCookie<UserProfile> userCookieObj = _cookieManager.Get<MyCookie<UserProfile>>(CookieConstants.USER_COOKIE);
                            string userId = "";
                            if (userCookieObj != null)
                            {
                                userId = userCookieObj.Value.id;
                            }

                            // every contest create folder
                            string pathPhoto = Path.Combine(_hostEnvironment.WebRootPath, Constants.ExamReadyPhotosRootPath, id);
                            if (!Directory.Exists(pathPhoto))
                            {
                                Directory.CreateDirectory(pathPhoto);
                            }

                            // file name with contestId and userId            
                            string uniqueFileName = userId + "-" + file.FileName;

                            // check if exited avatar and delete
                            string exitingFile = Path.Combine(pathPhoto, uniqueFileName);
                            var existed = System.IO.File.Exists(exitingFile);
                            if (existed)
                                System.IO.File.Delete(exitingFile);

                            using (FileStream stream = new FileStream(Path.Combine(pathPhoto, uniqueFileName), FileMode.Create))
                            {
                                file.CopyTo(stream);
                            }

                            UpdateExamAvatarRequest request = new UpdateExamAvatarRequest();
                            // update exam avatar
                            request.avatar = Constants.ExamReadyPhotosPath + id + "/" + uniqueFileName;
                            request.id = id;

                            var result = await _examProfileService.UpdateExamAvatar(request);
                            return Ok(result);

                        }
                    }
                    return Json(true);
                }
                else
                {
                    return Json(false);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
    }
}
