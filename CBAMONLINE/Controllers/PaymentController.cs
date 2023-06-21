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
using CBAMONLINE.Models.Payment;

namespace CBAMONLINE.Controllers
{
    public class PaymentController : Controller
    {
        private readonly IPaymentService _paymentService;

        public PaymentController(
            IPaymentService paymentService
            )
        {
            _paymentService = paymentService;
        }


        [HttpPost]
        public async Task<IActionResult> CreatePayment([FromBody] CreatePaymentRequest request)
        {
            try
            {
                var result = await _paymentService.CreatePayment(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpPost]
        public async Task<IActionResult> UpdatePayment([FromBody] UpdatePaymentRequest request)
        {
            try
            {
                var result = await _paymentService.UpdatePayment(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

    }
}
