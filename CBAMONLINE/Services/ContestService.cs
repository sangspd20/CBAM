using CBAMONLINE.Infrastructure.Constants;
using CBAMONLINE.Models;
using CBAMONLINE.Models.Auth.Login;
using CBAMONLINE.Models.Contest;
using CBAMONLINE.Models.Contest.ContestScoresDetailPaging;
using CBAMONLINE.Models.Paging;
using CBAMONLINE.Models.UserProfile;
using CBAMONLINE.Services.IServices;
using CookieManager;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Reflection;

namespace CBAMONLINE.Services
{
    public class ContestService : IContestService
    {
        private readonly IGraphQLFactory _client;
        private readonly ICookieManager _cookieManager;
        public ContestService(IGraphQLFactory client, ICookieManager cookieManager)
        {
            _client = client;
            _cookieManager = cookieManager;
        }

        public async Task<QueryResponse<ContestItem>> GetContestDetail(ContestDetailRequest request)
        {
            var query = "query ($condition: ContestViewCondition!) { queryResponse:contestDetail(condition : $condition) {finished,avatar,image,content,quizNo,totalTime,id,name,description,timeStart,isRegisted,children{name,childId,camera,timeEnd,timeStart}}}";
            var response = await _client.ExecuteGQlQuery<QueryResponse<ContestItem>>(query, credentials: true, variables: new { condition = request });
            return response;
        }

        public async Task<QueryResponse<ContestItem>> GetContestRegisterDetail(ContestDetailRequest request)
        {
            var query = "query ($condition: ContestViewCondition!) { queryResponse:contestRegisterDetail(condition : $condition) {image,content,quizNo,totalTime,id,name,description,timeStart,children{name,childId,camera,timeEnd,timeStart}}}";
            var response = await _client.ExecuteGQlQuery<QueryResponse<ContestItem>>(query, credentials: true, variables: new { condition = request });
            return response;
        }

        public async Task<QueryResponse<List<ContestItem>>> GetContestList(string mode)
        {
            var query = "query ($mode: String!) { queryResponse:contestList(mode : $mode) {finished,image,content,quizNo,slug,totalTime,id,name,mode,description,isRegisted,timeStart,endRegister,registered,children{name,childId,camera,timeEnd,timeStart}}}";
            MyCookie<LoginResponse> authCookieObj = _cookieManager.Get<MyCookie<LoginResponse>>(CookieConstants.AUTH_COOKIE);
            var credentials = authCookieObj != null ? true : false;
            var response = await _client.ExecuteGQlQuery<QueryResponse<List<ContestItem>>>(query, credentials: credentials, variables: new { mode = mode });
            return response;
        }

        public async Task<QueryResponse<ContestWithPagingResponse>> GetContestWithPaging(BasePaging request)
        {
            var query = "query ($skip: Int!,$take: Int!) { queryResponse:contestWithPaging(skip : $skip, take : $take) {items{ name,slug,timeStart,children{name,subjects{name}}},metaData{currentPage,totalPages,pageSize, totalCount, totalRecord,startOrder,endOrder}}}";
            var response = await _client.ExecuteGQlQuery<QueryResponse<ContestWithPagingResponse>>(query, credentials: true, variables: new { skip = request.skip,take= request.take });
            return response;
        }

        public async Task<QueryResponse<ContestScoresDetailPagingResponse>> GetContestScoresDetailPaging(ContestScoresDetailPagingRequest request)
        {
            var query = "query ($skip: Int!,$take: Int!,$slug: String!,$name: String!,$roundId: String!) { queryResponse:contestScoresDetail(skip : $skip, take : $take,name : $name, slug : $slug,roundId:$roundId) { name,children{name,id,start},registered{items{fullName,total,mark,scores{subjectId,total,score,onTime,subJectName}},metaData{ currentPage,totalPages,pageSize, totalCount, totalRecord,startOrder,endOrder}}}}";
            var response = await _client.ExecuteGQlQuery<QueryResponse<ContestScoresDetailPagingResponse>>(query, credentials: true, variables: new { skip = request.skip, take = request.take, slug = request.slug, name = request.name, roundId = request.roundId });
            return response;
        }
    }
}