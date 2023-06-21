using CBAMONLINE.Models;
using CBAMONLINE.Models.Exam.ExamProfile;

namespace CBAMONLINE.Services.IServices
{
    public interface IExamProfileService
    {
        Task<QueryResponse<ExamProfile>> GetExamProfile(string id);
        Task<MutationResponse<BaseResponse>> UpdateExamProfile(ExamProfile request);
        Task<MutationResponse<BaseResponse>> RegisterExam(RegisterExamRequest request);
        Task<MutationResponse<BaseResponse>> UpdateExamAvatar(UpdateExamAvatarRequest request);

    }
}
