using CBAMONLINE.Services.IServices;
using GraphQL.Client.Http;
using GraphQL.Client.Serializer.Newtonsoft;
using GraphQL;
using System.Net.Http.Headers;
using CBAMONLINE.Infrastructure.Constants;
using CBAMONLINE.Models.Auth.Login;
using CBAMONLINE.Models;
using CookieManager;

namespace CBAMONLINE.Services
{
    public class GraphQLFactory : IGraphQLFactory
    {
        private readonly IConfiguration _config;
        private readonly GraphQLHttpClient graphQLClient;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ILogger<GraphQLFactory> _logger;
        private readonly ICookieManager _cookieManager;
        public GraphQLFactory(IConfiguration config, IHttpContextAccessor httpContextAccessor, ILogger<GraphQLFactory> logger, ICookieManager cookieManager)
        {
            _config = config;
            _httpContextAccessor = httpContextAccessor;
            _logger = logger;
            _cookieManager = cookieManager;
            graphQLClient = new GraphQLHttpClient(new GraphQLHttpClientOptions()
            {
                EndPoint = new Uri(_config["APIConnection:baseuri"]!)

            }, new NewtonsoftJsonSerializer());
        }
        public async Task<T> ExecuteGQlQuery<T>(string reqQuery, bool credentials = false, object? variables = null, string accessToken = "")
        {
            try
            {
                if (!string.IsNullOrEmpty(accessToken))
                {
                    graphQLClient.HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                }
                else
                {
                    if (credentials)
                    {
                        MyCookie<LoginResponse> authCookieObj = _cookieManager.Get<MyCookie<LoginResponse>>(CookieConstants.AUTH_COOKIE);
                        if (authCookieObj != null)
                        {
                            //var token = await _httpContextAccessor.HttpContext!.GetTokenAsync("jwt");
                            var token = authCookieObj.Value.accessToken;
                            graphQLClient.HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                        }

                    }
                }

                var gQLRequest = new GraphQLRequest
                {
                    Query = reqQuery
                };
                if (variables != null)
                {
                    gQLRequest.Variables = variables;

                }

                var response = await graphQLClient.SendQueryAsync<T>(gQLRequest);
                if (response.Errors != null)
                {
                    _logger.LogError(response.Errors[0].Message);
                }
                return response.Data;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                throw;
            }
        }
        public async Task<T> ExecuteGQlMutation<T>(string reqQuery, bool credentials = false, object? variables = null)
        {
            try
            {
                if (credentials)
                {
                    MyCookie<LoginResponse> authCookieObj = _cookieManager.Get<MyCookie<LoginResponse>>(CookieConstants.AUTH_COOKIE);
                    if (authCookieObj != null)
                    {
                        var token = authCookieObj.Value.accessToken;
                        graphQLClient.HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                    }
                }

                var gQLRequest = new GraphQLRequest
                {
                    Query = reqQuery,
                };
                if (variables != null)
                {
                    gQLRequest.Variables = variables;

                }
                var response = await graphQLClient.SendMutationAsync<T>(gQLRequest);
                if (response.Errors != null)
                {
                    _logger.LogError(response.Errors[0].Message);
                }
                return response.Data;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                throw;
            }
        }
    }
}
