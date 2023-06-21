using CBAMONLINE.Models;
using CBAMONLINE.Models.Contest;
using CBAMONLINE.Models.Contest.ContestScoresDetailPaging;
using CBAMONLINE.Models.Paging;

namespace CBAMONLINE.Services.IServices
{


    public interface IContestService
    {
        Task<QueryResponse<List<ContestItem>>> GetContestList(string mode);
        Task<QueryResponse<ContestItem>> GetContestDetail(ContestDetailRequest request);
        Task<QueryResponse<ContestItem>> GetContestRegisterDetail(ContestDetailRequest request);
        Task<QueryResponse<ContestWithPagingResponse>> GetContestWithPaging(BasePaging request);
        Task<QueryResponse<ContestScoresDetailPagingResponse>> GetContestScoresDetailPaging(ContestScoresDetailPagingRequest request);


    }
}
