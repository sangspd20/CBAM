using CBAMONLINE.Models;
using CBAMONLINE.Models.Library;
using CBAMONLINE.Models.News;

namespace CBAMONLINE.Services.IServices
{
    public interface ILibraryService
    {
        Task<QueryResponse<List<LibraryListResponse>>> GetLibraryList(int take);
    }
}
