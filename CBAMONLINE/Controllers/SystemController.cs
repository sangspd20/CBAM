using AutoMapper;
using CBAMONLINE.Infrastructure.Constants;
using CBAMONLINE.Models;
using CBAMONLINE.Models.Auth.ChangePassword;
using CBAMONLINE.Models.Auth.Login;
using CBAMONLINE.Models.Auth.SignUp;
using CBAMONLINE.Models.System.Location;
using CBAMONLINE.Services.IServices;
using Microsoft.AspNetCore.Mvc;

namespace CBAMONLINE.Controllers
{
    public class SystemController : Controller
    {
        private readonly ISystemService _systemService;

        public SystemController(
             ISystemService systemService
            )
        {
            _systemService = systemService;
        }

        [HttpGet]
        public async Task<IActionResult> GetSystemCounter()
        {
            try
            {
                var result = await _systemService.GetSystemCounter();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpPost]
        public async Task<IActionResult> GetLocations([FromBody] LocationRequest request)
        {
            try
            {
                var result = await _systemService.GetLocations(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

    }
}
