using CBAMONLINE.Models;
using CBAMONLINE.Models.Contest;
using CBAMONLINE.Models.Library;
using CBAMONLINE.Models.News;
using CBAMONLINE.Services.IServices;

namespace CBAMONLINE.Services
{
    public class LibraryService : ILibraryService
    {
        private readonly IGraphQLFactory _client;
        public LibraryService(IGraphQLFactory client)
        {
            _client = client;
        }
    
        public async Task<QueryResponse<List<LibraryListResponse>>> GetLibraryList(int take)
        {
            var query = "query ($take: Int!) { queryResponse:libraryList(take : $take) {name, libraries {created,name,size,slug,type} }}";
            var response = await _client.ExecuteGQlQuery<QueryResponse<List<LibraryListResponse>>>(query, variables: new { take = take });
            return response;
        }
    }
}
