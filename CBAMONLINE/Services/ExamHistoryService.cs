using CBAMONLINE.Models;
using CBAMONLINE.Models.Auth.ChangePassword;
using CBAMONLINE.Models.Auth.Login;
using CBAMONLINE.Models.Auth.SignUp;
using CBAMONLINE.Models.Exam.ExamHistoryPaging;
using CBAMONLINE.Models.Paging;
using CBAMONLINE.Models.UserProfile;
using CBAMONLINE.Services.IServices;
using Newtonsoft.Json;
using System.Reflection;

namespace CBAMONLINE.Services
{
    public class ExamHistoryService : IExamHistoryService
    {
        private readonly IGraphQLFactory _client;
        public ExamHistoryService(IGraphQLFactory client)
        {
            _client = client;
        }

        public async Task<QueryResponse<ExamHistoryPagingResponse>> GetExamHistoryPaging(BasePaging paging)
        {
            var query = "query ($skip:Int!, $take: Int!) { queryResponse:examHistoryPaging(skip: $skip, take : $take) {items { name,id,children{name,scores{name,mark,total},total,order,start,timeEnd} }, metaData{ currentPage,totalPages,pageSize,totalCount,totalRecord,startOrder,endOrder}}}";
            var response = await _client.ExecuteGQlQuery<QueryResponse<ExamHistoryPagingResponse>>(query, variables: new { skip = paging.skip, take = paging.take }, credentials: true);
            return response;
        }

    }
}
