using CBAMONLINE.Infrastructure.Constants;
using CBAMONLINE.Infrastructure.Security;
using CBAMONLINE.Models;
using CBAMONLINE.Models.Auth.Login;
using CBAMONLINE.Models.Auth.SignUp;
using CBAMONLINE.Models.Contest;
using CBAMONLINE.Models.ViewModel;
using CBAMONLINE.Services.IServices;
using CookieManager;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace CBAMONLINE.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IAuthService _authService;
        private readonly ISystemService _systemService;
        private readonly INewsService _newsService;
        private readonly ILibraryService _libraryService;
        private readonly IContestService _contestService;
        private readonly ICookieManager _cookieManager;
        private readonly IWebHostEnvironment _hostEnvironment;
        private readonly CustomIDataProtection _protector;
        private readonly IConfiguration _configuration;


        public HomeController(ILogger<HomeController> logger,
            IAuthService authService,
            ICookieManager cookieManager,
            IWebHostEnvironment hostEnvironment,
            ISystemService systemService,
            INewsService newsService,
            IContestService contestService,
            ILibraryService libraryService,
            CustomIDataProtection protector,
             IConfiguration configuration
            )
        {
            _logger = logger;
            _authService = authService;
            _cookieManager = cookieManager;
            _hostEnvironment = hostEnvironment;
            _systemService = systemService;
            _newsService = newsService;
            _contestService = contestService;
            _libraryService = libraryService;
            _protector = protector;
            _configuration = configuration;
        }

        [AllowAnonymous]
        public async Task<IActionResult> Index()
        {
            try
            {
                var isShowAdsModal = _configuration["SystemSettings:IsShowAdsModal"];
                ViewBag.IsShowAdsModal = isShowAdsModal;
                HomeViewModel vm = new HomeViewModel();
                var systemCounter = await _systemService.GetSystemCounter();
                var news = await _newsService.GetNewsList(4);
                var libs = await _libraryService.GetLibraryList(6);
                var contests = await _contestService.GetContestList("");

                vm.SystemCounter = systemCounter.queryResponse;
                vm.News = news.queryResponse;
                vm.Libs = libs.queryResponse;
                
                List<ContestItem> fakeData = new List<ContestItem>();
                ContestItem data1 = new ContestItem()
                {
                    id = "6433bb657bad2fbcb9c6373f234",
                    description = "Sang",
                    endRegister = new DateTime(2023, 5, 2, 17, 30, 0),
                    timeStart = new DateTime(2023, 5, 5, 17, 30, 0),
                    mode = "exam",
                    isRegisted = false,
                    name = "Bài thi đánh giá năng lực Môn Toán - 2023",
                    registered = 2,
                    image = "test.png"
                };

                ContestItem data2 = new ContestItem()
                {
                    id = "6433bb657bad2fbcb9c6373f324",
                    description = "Sang",
                    endRegister = new DateTime(2023, 4,30 , 16, 42, 0),
                    timeStart = new DateTime(2023, 5, 14, 11, 04, 0),
                    mode = "exam",
                    isRegisted = false,
                    name = "Bài thi đánh giá năng lực Môn Toán - 2023",
                    registered = 2,
                    image = "test.png"
                };

                ContestItem data3 = new ContestItem()
                {
                    id = "6433bb657bad2fbcb9c6373f4",
                    description = "Sang",
                    endRegister = new DateTime(2023, 5, 2, 17, 30, 0),
                    timeStart = new DateTime(2023, 5, 5, 17, 30, 0),
                    mode = "test",
                    isRegisted = false,
                    name = "Bài thi đánh giá năng lực Môn Toán - 2023",
                    registered = 2,
                    image = "test.png"
                };
                ContestItem data8 = new ContestItem()
                {
                    id = "8",
                    description = "Sang",
                    endRegister = new DateTime(2023, 5, 2, 17, 30, 0),
                    timeStart = new DateTime(2023, 5, 5, 17, 30, 0),
                    mode = "test",
                    isRegisted = false,
                    name = "Bài thi đánh giá năng lực Môn Toán - 2023",
                    registered = 2,
                    image = "test.png"
                };
                ContestItem data4 = new ContestItem()
                {
                    id = "4",
                    description = "Sang",
                    endRegister = new DateTime(2023, 5, 2, 17, 30, 0),
                    timeStart = new DateTime(2023, 5, 5, 17, 30, 0),
                    mode = "test",
                    isRegisted = false,
                    name = "Bài thi đánh giá năng lực Môn Toán - 2023",
                    registered = 2,
                    image = "test.png"
                };
                ContestItem data5 = new ContestItem()
                {
                    id = "5",
                    description = "Sang",
                    endRegister = new DateTime(2023, 5, 2, 17, 30, 0),
                    timeStart = new DateTime(2023, 5, 5, 17, 30, 0),
                    mode = "test",
                    isRegisted = false,
                    name = "Bài thi đánh giá năng lực Môn Toán - 2023",
                    registered = 2,
                    image = "test.png"
                };
                ContestItem data6 = new ContestItem()
                {
                    id = "6",
                    description = "Sang",
                    endRegister = new DateTime(2023, 5, 2, 17, 30, 0),
                    timeStart = new DateTime(2023, 5, 5, 17, 30, 0),
                    mode = "test",
                    isRegisted = false,
                    name = "Bài thi đánh giá năng lực Môn Toán - 2023",
                    registered = 2,
                    image = "test.png"
                };
                ContestItem data7 = new ContestItem()
                {
                    id = "7",
                    description = "Sang",
                    endRegister = new DateTime(2023, 5, 2, 17, 30, 0),
                    timeStart = new DateTime(2023, 5, 5, 17, 30, 0),
                    mode = "test",
                    isRegisted = false,
                    name = "Bài thi đánh giá năng lực Môn Toán - 2023",
                    registered = 2,
                    image = "test.png"
                };


                fakeData.Add(data1);
                fakeData.Add(data2);
                fakeData.Add(data3);
                fakeData.Add(data4);
                fakeData.Add(data5);
                fakeData.Add(data6);
                fakeData.Add(data7);
                fakeData.Add(data8);

                vm.Contests = contests.queryResponse;
                // protect id
                if (vm.Contests != null && vm.Contests.Count > 0)
                {
                    // encode id to protected
                    foreach (var item in vm.Contests)
                    {
                        item.id = _protector.Encode(item.id);
                    }
                }
                //vm.Contests = fakeData;
                return View(vm);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return View();
            }
        }

        [AllowAnonymous]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
       
    }
}