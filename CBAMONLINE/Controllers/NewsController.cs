using AutoMapper;
using CBAMONLINE.Infrastructure.Constants;
using CBAMONLINE.Models;
using CBAMONLINE.Models.Auth.ChangePassword;
using CBAMONLINE.Models.Auth.Login;
using CBAMONLINE.Models.Auth.SignUp;
using CBAMONLINE.Models.UserProfile;
using CBAMONLINE.Services;
using CBAMONLINE.Services.IServices;
using CookieManager;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Reflection;

namespace CBAMONLINE.Controllers
{
    public class NewsController : Controller
    {
        private readonly INewsService _newsService;

        public NewsController(
             INewsService newsService
            )
        {
            _newsService = newsService;
        }

        [HttpGet]
        public async Task<IActionResult> GetNewsList()
        {
            try
            {
                var result = await _newsService.GetNewsList(4);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

    }
}
