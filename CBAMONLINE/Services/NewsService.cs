using CBAMONLINE.Models;
using CBAMONLINE.Models.Contest;
using CBAMONLINE.Models.News;
using CBAMONLINE.Services.IServices;

namespace CBAMONLINE.Services
{
    public class NewsService :INewsService
    {
        private readonly IGraphQLFactory _client;
        public NewsService(IGraphQLFactory client)
        {
            _client = client;
        }
    
        public async Task<QueryResponse<List< NewsItem>>> GetNewsList(int take)
        {
            var query = "query ($take: Int!) { queryResponse:newsList(take : $take) {created, description, id, image, slug, thumb, title}}";
            var response = await _client.ExecuteGQlQuery<QueryResponse<List<NewsItem>>>(query, variables: new { take = take });
            return response;
        }
    }
}
