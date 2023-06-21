namespace CBAMONLINE.Models.Exam.ExamHistoryPaging
{
    public class ExamHistoryPagingContest
    {
        public string name { get; set; }
        public int order { get; set; }
        public int total { get; set; }
        public string start { get; set; }
        public string timeEnd { get; set; }

        public List<ExamHistoryPagingScore> scores { get; set; }
    }
}
