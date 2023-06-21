namespace CBAMONLINE.Models
{
    public class QueryResponse<T> where T : class
    {
        public T? queryResponse { get; set; }
    }
}
