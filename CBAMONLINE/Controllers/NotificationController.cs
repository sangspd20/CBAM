using AutoMapper;
using CBAMONLINE.Infrastructure.Constants;
using CBAMONLINE.Infrastructure.Security;
using CBAMONLINE.Models.Auth.ChangePassword;
using CBAMONLINE.Models;
using CBAMONLINE.Models.Paging;
using CBAMONLINE.Models.UserProfile;
using CBAMONLINE.Services;
using CBAMONLINE.Services.IServices;
using CookieManager;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.DotNet.Scaffolding.Shared;
using Newtonsoft.Json;
using CBAMONLINE.Models.Exam.ExamProfile;
using CBAMONLINE.Models.Notification.NotificationPaging;

namespace CBAMONLINE.Controllers
{
    public class NotificationController : Controller
    {
        private readonly INotificationService _notificationService;
        private readonly IMapper _mapper;
        private readonly ICookieManager _cookieManager;
        private readonly IWebHostEnvironment _hostEnvironment;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly CustomIDataProtection _protector;

        public NotificationController(
            INotificationService notificationService,
            IMapper mapper,
            ICookieManager cookieManager,
            IWebHostEnvironment hostEnvironment,
            IHttpContextAccessor httpContextAccessor,
            CustomIDataProtection protector
            )
        {
            _notificationService = notificationService;
            _mapper = mapper;
            _cookieManager = cookieManager;
            _hostEnvironment = hostEnvironment;
            _httpContextAccessor = httpContextAccessor;
            _protector = protector;
        }


        [HttpPost]
        public async Task<IActionResult> GetNotificationPaging([FromBody] NotificationPagingRequest request)
        {
            try
            {
                var result = await _notificationService.GetNotificationPaging(request);
                if (result != null && result.queryResponse != null)
                {
                    // encode id to protected
                    foreach (var item in result.queryResponse.items)
                    {
                        item.id = _protector.Encode(item.id);
                    }
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpGet]
        public async Task<IActionResult> GetNotification()
        {
            try
            {
                var result = await _notificationService.GetNotification();
                if (result != null && result.queryResponse != null)
                {
                    // encode id to protected
                    foreach (var item in result.queryResponse)
                    {
                        item.noteId = _protector.Encode(item.noteId);
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
        public async Task<IActionResult> UpdateIsReadNotification([FromBody] string id)
        {
            try
            {
                if (!string.IsNullOrEmpty(id))
                    id = _protector.Decode(id);

                var result = await _notificationService.UpdateIsReadNotification(id);
                return Ok(result);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> UpdateIsReadAllNotification()
        {
            try
            {
                var result = await _notificationService.UpdateIsReadAllNotification();
                return Ok(result);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> DeleteNotification([FromBody] string id)
        {
            try
            {
                if (!string.IsNullOrEmpty(id))
                    id = _protector.Decode(id);

                var result = await _notificationService.DeleteNotification(id);
                return Ok(result);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
