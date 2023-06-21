namespace CBAMONLINE.Models.Contest.ContestScoresDetailPaging
{
    public class ContestScoreByPerson
    {
        public decimal score { get; set; }
        public string subjectId { get; set; }
        public string subjectName { get; set; }
        public int total { get; set; }
        public int onTime { get; set; }
    }
}
