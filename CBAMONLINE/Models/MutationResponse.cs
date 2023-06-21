namespace CBAMONLINE.Models
{
    public class MutationResponse<T>:BaseResponse
    {
        public T mutationResponse { get; set; }

    }
}
