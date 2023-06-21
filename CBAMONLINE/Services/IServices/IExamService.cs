using CBAMONLINE.Models;
using CBAMONLINE.Models.Exam.Exam;
using CBAMONLINE.Models.Exam.Exam.Result;

namespace CBAMONLINE.Services.IServices
{
    public interface IExamService
    {
        Task<QueryResponse<ExamResponse>> GetExam(ExamRequest request);
        Task<MutationResponse<BaseResponse>> SaveAnswer(SaveAnswerRequest request);
        Task<MutationResponse<BaseResponse>> UpdateEndTimeSubject(UpdateEndTimeRequest request);
        Task<MutationResponse<List<ExamResultResponse>>> GetFinalResult(ExamResultRequest request);

    }
}
