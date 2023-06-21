using CBAMONLINE.Models.Paging;

namespace CBAMONLINE.Models.Notification.NotificationPaging
{
    public class NotificationPagingRequest :BasePaging
    {
        public string type { get; set; }
        public int isread { get; set; }

    }
}
