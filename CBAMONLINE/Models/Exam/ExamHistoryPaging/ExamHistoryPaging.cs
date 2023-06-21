namespace CBAMONLINE.Models.Exam.ExamHistoryPaging
{
    public class ExamHistoryPaging
    {
        public string id { get; set; }
        public string name { get; set; }
        public List<ExamHistoryPagingContest> children { get; set; }

    }
}
