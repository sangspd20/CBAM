namespace CBAMONLINE.Models
{
    public class QueriesResponse<T> where T : class
    {
        public List<T>? queryResponse { get; set; }
    }
}
