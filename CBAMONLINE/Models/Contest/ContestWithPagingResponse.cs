using CBAMONLINE.Models.Paging;

namespace CBAMONLINE.Models.Contest
{
    public class ContestWithPagingResponse
    {
        public List<ContestPagingItem> items { get; set; }
        public MetaData metaData { get; set; }
    }
}
