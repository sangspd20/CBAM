using AutoMapper;
using CBAMONLINE.Infrastructure.Constants;
using CBAMONLINE.Models;
using CBAMONLINE.Models.Auth.ChangePassword;
using CBAMONLINE.Models.Auth.Login;
using CBAMONLINE.Models.Auth.SignUp;
using CBAMONLINE.Models.Contest;
using CBAMONLINE.Models.Contest.ContestScoresDetailPaging;
using CBAMONLINE.Models.Paging;
using CBAMONLINE.Models.UserProfile;
using CBAMONLINE.Services;
using CBAMONLINE.Services.IServices;
using CookieManager;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Reflection;

namespace CBAMONLINE.Controllers
{
    public class ContestController : Controller
    {
        private readonly IContestService _contestService;

        public ContestController(
             IContestService contestService
            )
        {
            _contestService = contestService;
        }

        [HttpGet]
        public IActionResult ScoreBoard()
        {
           return View();
        }

        [HttpGet]
        public IActionResult ScoreBoardDetail([FromQuery] string slug)
        {
            ViewBag.Slug = slug;
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetContestList()
        {
            try
            {
                // get all
                string mode = "";
                var result = await _contestService.GetContestList(mode);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpPost]
        public async Task<IActionResult> GetContestDetail( ContestDetailRequest request)
        {
            try
            {
                var result = await _contestService.GetContestDetail(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpPost]
        public async Task<IActionResult> GetContestWithPaging([FromBody] BasePaging request)
        {
            try
            {
                var result = await _contestService.GetContestWithPaging(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpPost]
        public async Task<IActionResult> GetContestScoresDetailPaging([FromBody] ContestScoresDetailPagingRequest request)
        {
            try
            {
                var result = await _contestService.GetContestScoresDetailPaging(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

    }
}
