using AutoMapper;
using CBAMONLINE.Infrastructure.Constants;
using CBAMONLINE.Models;
using CBAMONLINE.Models.Auth.ChangePassword;
using CBAMONLINE.Models.Auth.Login;
using CBAMONLINE.Models.Auth.SignUp;
using CBAMONLINE.Services.IServices;
using Microsoft.AspNetCore.Mvc;

namespace CBAMONLINE.Controllers
{
    public class LibraryController : Controller
    {
        private readonly ILibraryService _libraryService;

        public LibraryController(
            ILibraryService libraryService
            )
        {
            _libraryService = libraryService;
        }

        [HttpGet]
        public async Task<IActionResult> GetLibraryList()
        {
            try
            {
                var result = await _libraryService.GetLibraryList(6);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

    }
}
