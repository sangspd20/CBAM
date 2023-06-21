using CBAMONLINE.Models;
using CBAMONLINE.Models.Notification.Notification;
using CBAMONLINE.Models.Notification.NotificationPaging;
using CBAMONLINE.Models.UserProfile;

namespace CBAMONLINE.Services.IServices
{
    public interface INotificationService
    {
        Task<QueryResponse<NotificationPagingResponse>> GetNotificationPaging(NotificationPagingRequest request);
        Task<MutationResponse<BaseResponse>> UpdateIsReadNotification(string id);
        Task<MutationResponse<BaseResponse>> UpdateIsReadAllNotification();
        Task<MutationResponse<BaseResponse>> DeleteNotification(string id);
        Task<QueryResponse<List< NotificationResponse>>> GetNotification();

    }
}
