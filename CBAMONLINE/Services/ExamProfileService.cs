using CBAMONLINE.Models;
using CBAMONLINE.Models.Auth.ChangePassword;
using CBAMONLINE.Models.Exam.ExamHistoryPaging;
using CBAMONLINE.Models.Exam.ExamProfile;
using CBAMONLINE.Services.IServices;

namespace CBAMONLINE.Services
{
    public class ExamProfileService : IExamProfileService
    {
        private readonly IGraphQLFactory _client;
        public ExamProfileService(IGraphQLFactory client)
        {
            _client = client;
        }

        public async Task<MutationResponse<BaseResponse>> RegisterExam(RegisterExamRequest request)
        {
            var query = @"mutation ($input: ExamHistoryInput!){ 
							mutationResponse:registerContest(input: $input){message,statusCode}}";
            var response = await _client.ExecuteGQlMutation<MutationResponse<BaseResponse>>(query, credentials: true, variables: new { input = request });
            return response;
        }

        public async Task<QueryResponse<ExamProfile>> GetExamProfile(string id)
        {
            var query = "query ($id:String!) { queryResponse:examProfile(id: $id) {address,avatar,city,class,dob,firstName,lastName,phone,province,school,states}}";
            var response = await _client.ExecuteGQlQuery<QueryResponse<ExamProfile>>(query, variables: new { id = id }, credentials: true);
            return response;
        }

        public async Task<MutationResponse<BaseResponse>> UpdateExamProfile(ExamProfile request)
        {
            var query = @"mutation ($input: ExamHistoryProfileInput!){ 
							mutationResponse:updateExamProfile(input: $input){message,statusCode}}";
            var response = await _client.ExecuteGQlMutation<MutationResponse<BaseResponse>>(query, credentials: true, variables: new { input = request });
            return response;
        }

        public async Task<MutationResponse<BaseResponse>> UpdateExamAvatar(UpdateExamAvatarRequest request)
        {
            var query = @"mutation ($avatar: String!, $id: String!){ 
							mutationResponse:updateExamAvatar(avatar: $avatar, id:$id){message,statusCode}}";
            var response = await _client.ExecuteGQlMutation<MutationResponse<BaseResponse>>(query, credentials: true, variables: new { avatar = request.avatar, id = request.id });
            return response;
        }
    }
}
