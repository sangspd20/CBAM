namespace CBAMONLINE.Models.Paging
{
    public class PagedList<T> : PagedListBase
    {
        public List<T> Items { set; get; }

        public PagedList(List<T> items, long count = 0, int pageNumber = 0, int pageSize = 0, long totalRecord = 0, int skip = 0)
        {
            MetaData = new MetaData
            {
                StartOrder = skip + 1,
                EndOrder = skip + count,
                TotalPages = (int)Math.Ceiling(totalRecord / (double)pageSize),
                CurrentPage = pageNumber,
                TotalRecord = totalRecord,
                TotalCount = count,
                PageSize = pageSize
            };
            Items = items;
        }
    }
}
