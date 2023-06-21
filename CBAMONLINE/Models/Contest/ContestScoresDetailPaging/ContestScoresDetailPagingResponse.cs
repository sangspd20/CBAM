namespace CBAMONLINE.Models.Contest.ContestScoresDetailPaging
{
    public class ContestScoresDetailPagingResponse
    {
        public string name { get; set; }
        public List<ContestSubject> children { get; set; }
        public PageListOfContestScoreRegistered registered { get; set; }

    }
}
