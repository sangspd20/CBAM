using CBAMONLINE.Models;
using CBAMONLINE.Models.Auth.ChangePassword;
using CBAMONLINE.Models.Exam.ExamHistoryPaging;
using CBAMONLINE.Models.Exam.ExamProfile;
using CBAMONLINE.Models.Notification.Notification;
using CBAMONLINE.Models.Notification.NotificationPaging;
using CBAMONLINE.Models.UserProfile;
using CBAMONLINE.Services.IServices;

namespace CBAMONLINE.Services
{
    public class NotificationService : INotificationService
    {
        private readonly IGraphQLFactory _client;
        public NotificationService(IGraphQLFactory client)
        {
            _client = client;
        }

        public async Task<QueryResponse<NotificationPagingResponse>> GetNotificationPaging(NotificationPagingRequest request)
        {
            var query = "query ($skip:Int!, $take: Int!, $type:String!, $isread: Int!) { queryResponse:personNotificationPaging(skip: $skip, take : $take,type:$type, isread: $isread) {items {created,header,isRead,message,amount,transactionId,id } , metaData{ currentPage,totalPages,pageSize,totalCount,totalRecord,startOrder,endOrder}}}";
            var response = await _client.ExecuteGQlQuery<QueryResponse<NotificationPagingResponse>>(query, variables: new { skip = request.skip, take = request.take, type = request.type, isread = request.isread, }, credentials: true);
            return response;
        }

        public async Task<MutationResponse<BaseResponse>> UpdateIsReadNotification(string id)
        {
            var query = @"mutation ($id: String!){ 
							mutationResponse:updateIsReadNotification(id: $id) {message,statusCode}}";
            var response = await _client.ExecuteGQlMutation<MutationResponse<BaseResponse>>(query, credentials: true, variables: new { id = id });
            return response;
        }

        public async Task<MutationResponse<BaseResponse>> DeleteNotification(string id)
        {
            var query = @"mutation ($id: String!){ 
							mutationResponse:deleteNotification(id: $id) {message,statusCode}}";
            var response = await _client.ExecuteGQlMutation<MutationResponse<BaseResponse>>(query, credentials: true, variables: new { id = id });
            return response;
        }

        public async Task<MutationResponse<BaseResponse>> UpdateIsReadAllNotification()
        {
            var query = @"mutation { 
							mutationResponse:updateIsReadAllNotification() {message,statusCode}}";
            var response = await _client.ExecuteGQlMutation<MutationResponse<BaseResponse>>(query, credentials: true);
            return response;
        }

        public async Task<QueryResponse<List<NotificationResponse>>> GetNotification()
        {
            var query = "query  { queryResponse:personNotification() {created,header,noteId }}";
            var response = await _client.ExecuteGQlQuery<QueryResponse<List<NotificationResponse>>>(query, credentials: true);
            return response;
        }
    }
}
