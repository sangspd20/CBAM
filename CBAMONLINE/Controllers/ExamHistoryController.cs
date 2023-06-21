using AutoMapper;
using CBAMONLINE.Infrastructure.Constants;
using CBAMONLINE.Infrastructure.Security;
using CBAMONLINE.Models.Paging;
using CBAMONLINE.Models.UserProfile;
using CBAMONLINE.Services.IServices;
using CookieManager;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace CBAMONLINE.Controllers
{
    public class ExamHistoryController : Controller
    {
        private readonly IExamHistoryService _examHistoryService;
        private readonly IMapper _mapper;
        private readonly ICookieManager _cookieManager;
        private readonly IWebHostEnvironment _hostEnvironment;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly CustomIDataProtection _protector;

        public ExamHistoryController(
            IExamHistoryService examHistoryService,
            IMapper mapper,
            ICookieManager cookieManager,
            IWebHostEnvironment hostEnvironment,
            IHttpContextAccessor httpContextAccessor,
             CustomIDataProtection protector
            )
        {
            _examHistoryService = examHistoryService;
            _mapper = mapper;
            _cookieManager = cookieManager;
            _hostEnvironment = hostEnvironment;
            _httpContextAccessor = httpContextAccessor;
            _protector = protector;
        }


        [HttpPost]
        public async Task<IActionResult> GetExamHistoryPaging([FromBody]BasePaging paging)
        {
            try
            {
                var result = await _examHistoryService.GetExamHistoryPaging(paging);
                if(result != null && result.queryResponse != null)
                {
                    // encode id to protected
                    foreach(var item in result.queryResponse.items)
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
    }
}
