using CBAMONLINE.Models.Contest;
using CBAMONLINE.Models.Library;
using CBAMONLINE.Models.News;
using CBAMONLINE.Models.System;

namespace CBAMONLINE.Models.ViewModel
{
    public class HomeViewModel
    {
        public SystemCounter SystemCounter { get; set; }
        public List<NewsItem> News { get; set; }
        public List<LibraryListResponse> Libs { get; set; }
        public List<ContestItem> Contests { get; set; }

    }
}
