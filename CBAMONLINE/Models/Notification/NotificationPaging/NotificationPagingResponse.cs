using CBAMONLINE.Models.Paging;

namespace CBAMONLINE.Models.Notification.NotificationPaging
{
    public class NotificationPagingResponse
    {
        public List<NotificationPaging> items { get; set; }
        public MetaData metaData { get; set; }
    }
}
