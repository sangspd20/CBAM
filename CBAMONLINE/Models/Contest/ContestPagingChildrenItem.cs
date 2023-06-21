namespace CBAMONLINE.Models.Contest
{
    public class ContestPagingChildrenItem
    {
        public string childId { get; set; }
        public string name { get; set; }
        public List<ContestSubject> subjects { get; set; }

    }
}
