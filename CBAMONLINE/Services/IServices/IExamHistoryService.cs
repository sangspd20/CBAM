using CBAMONLINE.Models;
using CBAMONLINE.Models.Exam.ExamHistoryPaging;
using CBAMONLINE.Models.Paging;

namespace CBAMONLINE.Services.IServices
{
    public interface IExamHistoryService
    {
        Task<QueryResponse<ExamHistoryPagingResponse>> GetExamHistoryPaging(BasePaging paging);
    }
}
