namespace CBAMONLINE.Models.Contest
{
    public class ContestPagingItem
    {

        public DateTime created { get; set; }
        public int childCount { get; set; }
        public DateTime endRegister { get; set; }
        public string id { get; set; }
        public string name { get; set; }
        public string position { get; set; }
        public string slug { get; set; }
        public int status { get; set; }
        public DateTime timeEnd { get; set; }
        public DateTime timeStart { get; set; }
        public List<ContestPagingChildrenItem> children { get; set; }


    }
}
