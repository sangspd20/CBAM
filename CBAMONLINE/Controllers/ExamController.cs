using CBAMONLINE.Infrastructure.Security;
using CBAMONLINE.Services.IServices;
using Microsoft.AspNetCore.Mvc;
using CookieManager;
using CBAMONLINE.Models.Exam.Exam;
using CBAMONLINE.Models.Exam.Exam.Result;
using CBAMONLINE.Infrastructure.Constants;
using CBAMONLINE.Models.UserProfile;
using CBAMONLINE.Models;

namespace CBAMONLINE.Controllers
{
    public class ExamController : Controller
    {
        private readonly IExamService _examService;
        private readonly CustomIDataProtection _protector;
        private readonly IWebHostEnvironment _hostEnvironment;
        private readonly ICookieManager _cookieManager;
        private readonly IConfiguration _configuration;

        public ExamController(
            IExamService examService,
            CustomIDataProtection protector,
            IWebHostEnvironment hostEnvironment,
              ICookieManager cookieManager,
              IConfiguration configuration

            )
        {
            _examService = examService;
            _protector = protector;
            _hostEnvironment = hostEnvironment;
            _cookieManager = cookieManager;
            _configuration = configuration;
        }

        [HttpGet]
        public async Task<IActionResult> Index([FromQuery] string childId)
        {
            try
            {

                ExamRequest request = new ExamRequest()
                {
                    childId = !string.IsNullOrEmpty(childId) ? _protector.Decode(childId) : "",
                    subjectId = ""
                };

                var autoCaptureScreenSeconds = _configuration["SystemSettings:AutoCaptureScreenSeconds"];

                ViewBag.ContestId = request.childId;
                ViewBag.AutoCaptureScreenSeconds = autoCaptureScreenSeconds;
                var exam = await _examService.GetExam(request);
                return View(exam.queryResponse);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> SaveAnswer([FromBody] SaveAnswerRequest request)
        {
            try
            {
                var result = await _examService.SaveAnswer(request);
                return Ok(result);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> GetExam([FromBody] ExamRequest request)
        {
            try
            {
                // update screen path
                if (!string.IsNullOrEmpty(request.screenPath))
                {
                    MyCookie<UserProfile> userCookieObj = _cookieManager.Get<MyCookie<UserProfile>>(CookieConstants.USER_COOKIE);
                    string userId = "";
                    if (userCookieObj != null)
                    {
                        userId = userCookieObj.Value.id;
                    }

                    // every exam create folder
                    string pathExamPhoto = Path.Combine(_hostEnvironment.WebRootPath, Constants.ExamScreenshotRootPath, request.screenPath, userId);
                    if (!Directory.Exists(pathExamPhoto))
                    {
                        Directory.CreateDirectory(pathExamPhoto);
                    }

                    request.screenPath = Constants.ExamScreenshotPath + request.screenPath + "/" + userId;
                }
                var result = await _examService.GetExam(request);
                return Ok(result);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> UpdateEndTimeSubject([FromBody] UpdateEndTimeRequest request)
        {
            try
            {
                var result = await _examService.UpdateEndTimeSubject(request);
                return Ok(result);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet]
        public async Task<IActionResult> ExamResult([FromQuery] string childId, string id)
        {
            try
            {
                ExamResultRequest request = new ExamResultRequest()
                {
                    childId = !string.IsNullOrEmpty(childId) ? _protector.Decode(childId) : "",
                    id = id
                };

                var result = await _examService.GetFinalResult(request);
                return View(result.mutationResponse);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpPost]
        public IActionResult UploadScreenshot([FromBody] ExamScreenshot request)
        {
            try
            {
                MyCookie<UserProfile> userCookieObj = _cookieManager.Get<MyCookie<UserProfile>>(CookieConstants.USER_COOKIE);
                string userId = "";
                if (userCookieObj != null)
                {
                    userId = userCookieObj.Value.id;
                }

                string uniqueFileName = Guid.NewGuid() + "-screenshot.png";
                // every exam create folder
                string pathExamPhoto = Path.Combine(_hostEnvironment.WebRootPath, Constants.ExamScreenshotRootPath, request.examId, userId);
                if (!Directory.Exists(pathExamPhoto))
                {
                    Directory.CreateDirectory(pathExamPhoto);
                }

                using (FileStream fs = new FileStream(Path.Combine(pathExamPhoto, uniqueFileName), FileMode.Create))
                {
                    using (BinaryWriter bw = new BinaryWriter(fs))
                    {
                        byte[] data = Convert.FromBase64String(request.imageData);
                        bw.Write(data);
                        bw.Close();
                    }
                }
                return Ok(uniqueFileName);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
