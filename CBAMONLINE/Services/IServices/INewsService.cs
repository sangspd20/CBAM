using CBAMONLINE.Models;
using CBAMONLINE.Models.News;

namespace CBAMONLINE.Services.IServices
{
    public interface INewsService
    {
        Task<QueryResponse<List<NewsItem>>> GetNewsList(int take);
    }
}
