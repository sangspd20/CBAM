using CBAMONLINE.Models.Paging;

namespace CBAMONLINE.Models.Exam.ExamHistoryPaging
{
    public class ExamHistoryPagingResponse
    {
        public List< ExamHistoryPaging> items { get; set; }
        public MetaData metaData { get; set; }
    }
}
