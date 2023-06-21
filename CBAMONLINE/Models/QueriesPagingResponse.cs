using CBAMONLINE.Models.Paging;

namespace CBAMONLINE.Models
{
    public class QueriesPagingResponse<T> where T : class
    {
        public PagedList<T>? queryResponse { get; set; }
    }
}
