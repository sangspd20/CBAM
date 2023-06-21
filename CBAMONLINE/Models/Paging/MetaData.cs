namespace CBAMONLINE.Models.Paging
{
    public class MetaData
    {
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int PageSize { get; set; }
        public long TotalCount { get; set; }
        public long TotalRecord { get; set; }
        public long StartOrder { get; set; }
        public long EndOrder { get; set; }
    }
}
