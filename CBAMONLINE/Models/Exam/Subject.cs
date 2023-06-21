namespace CBAMONLINE.Models.Exam
{
    public class Subject
    {
        public string id { get;set; }
        public string name { get;set; }
        public int order { get; set; }
        public int time { get; set; }
        public string timeEnd { get; set; }
        public bool actived { get; set; }

    }
}
