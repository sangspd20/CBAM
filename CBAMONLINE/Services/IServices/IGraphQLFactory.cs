namespace CBAMONLINE.Services.IServices
{
    public interface IGraphQLFactory
    {
        Task<T> ExecuteGQlQuery<T>(string reqQuery, bool credentials = false, object? variables = null, string accessToken = "");
        Task<T> ExecuteGQlMutation<T>(string reqQuery, bool credentials = false, object? variables = null);
    }
}
