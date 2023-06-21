namespace CBAMONLINE.Models.Contest.ContestScoresDetailPaging
{
    public class ContestScoreRegistered
    {
        public string fullName { get; set; }
        public string timeEnd { get; set; }
        public int mark { get; set; }
        public string total { get; set; }
        public List<ContestScoreByPerson> scores { get; set; }
    }
}
