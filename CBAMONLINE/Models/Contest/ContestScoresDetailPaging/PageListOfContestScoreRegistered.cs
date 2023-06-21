using CBAMONLINE.Models.Paging;

namespace CBAMONLINE.Models.Contest.ContestScoresDetailPaging
{
    public class PageListOfContestScoreRegistered
    {
        public MetaData metaData { get; set; }
        public List<ContestScoreRegistered> items { get; set; }

    }
}
