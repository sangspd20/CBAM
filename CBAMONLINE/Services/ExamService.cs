using CBAMONLINE.Models;
using CBAMONLINE.Models.Exam.Exam;
using CBAMONLINE.Models.Exam.Exam.Result;
using CBAMONLINE.Services.IServices;

namespace CBAMONLINE.Services
{
    public class ExamService : IExamService
    {
        private readonly IGraphQLFactory _client;
        public ExamService(IGraphQLFactory client)
        {
            _client = client;
        }

        public async Task<QueryResponse<ExamResponse>> GetExam(ExamRequest request)
        {
            var query = "query ($input: ExerciseInput!) { queryResponse:startExercise(input: $input) {id,subjects{id,name,timeEnd,order,actived,time},quizGroup{id,description,link,screen, questions{id,description,screen,content,type,link,answers{ id,content,order}}}}}";
            var response = await _client.ExecuteGQlQuery<QueryResponse<ExamResponse>>(query, variables: new { input = request }, credentials: true);
            return response;
        }

        public async Task<MutationResponse<List< ExamResultResponse>>> GetFinalResult(ExamResultRequest request)
        {
            var query = @"mutation ($input: ResultFinalPayloadInput!){ 
							mutationResponse:finalResult(input: $input) {mark,name,onTime,time,totalMark}}";
            var response = await _client.ExecuteGQlMutation<MutationResponse<List<ExamResultResponse>>>(query, credentials: true, variables: new { input = request });
            return response;
        }

        public async Task<MutationResponse<BaseResponse>> SaveAnswer(SaveAnswerRequest request)
        {
            var query = @"mutation ($input: ResultInput!){ 
							mutationResponse:savingAnswerOfUser(input: $input) {message,statusCode}}";
            var response = await _client.ExecuteGQlMutation<MutationResponse<BaseResponse>>(query, credentials: true, variables: new { input = request });
            return response;
        }

        public async Task<MutationResponse<BaseResponse>> UpdateEndTimeSubject(UpdateEndTimeRequest request)
        {
            var query = @"mutation ($input: ResultTimeEndPayloadInput!){ 
							mutationResponse:updateEndTimeResult(input: $input) {message,statusCode}}";
            var response = await _client.ExecuteGQlMutation<MutationResponse<BaseResponse>>(query, credentials: true, variables: new { input = request });
            return response;
        }
    }
}
