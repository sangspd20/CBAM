using CBAMONLINE.Models.Paging;

namespace CBAMONLINE.Models.Contest.ContestScoresDetailPaging
{
    public class ContestScoresDetailPagingRequest :BasePaging
    {
        public string slug { get; set; }
        public string name { get; set; }
        public string roundId { get; set; }
    }
}
