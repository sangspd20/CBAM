using CBAMONLINE.Models;
using CBAMONLINE.Models.Contest;
using CBAMONLINE.Models.News;
using CBAMONLINE.Models.System;
using CBAMONLINE.Models.System.Location;
using CBAMONLINE.Services.IServices;

namespace CBAMONLINE.Services
{
    public class SystemService : ISystemService
    {
        private readonly IGraphQLFactory _client;
        public SystemService(IGraphQLFactory client)
        {
            _client = client;
        }

        public async Task<QueryResponse<SystemCounter>> GetSystemCounter()
        {
            var query = "query  { queryResponse:systemCounter() {contests, examnitations, members}}";
            var response = await _client.ExecuteGQlQuery<QueryResponse<SystemCounter>>(query);
            return response;
        }

        public async Task<QueryResponse<List< LocationResponse>>> GetLocations(LocationRequest request)
        {
            var query = "query ($condition: CitySelectInput!)  { queryResponse:citySelection(condition: $condition) {id,name}}";
            var response = await _client.ExecuteGQlQuery<QueryResponse<List<LocationResponse>>>(query, variables: new { condition = request });
            return response;
        }
    }
}
