namespace CBAMONLINE.Models.Contest
{
    public class ContestItem
    {
        public string? description { get; set; }
        public string? content { get; set; }
        public DateTime endRegister { get; set; }
        public string id { get; set; }
        public string avatar { get; set; }
        public string? image { get; set; }
        public bool isRegisted { get; set; }
        public string name { get; set; }
        public int registered { get; set; }
        public int quizNo { get; set; }
        public int totalTime { get; set; }
        public string mode { get; set; }
        public string slug { get; set; }
        public bool finished { get; set; }

        public DateTime timeStart { get; set; }


        public List<ContestChildren> children { get; set; }
    }
}
