namespace CBAMONLINE.Models.Exam
{
    public class Question
    {
        public string content { get; set; }
        public string description { get; set; }
        public string id { get; set; }
        public string link { get; set; }
        public string type { get; set; }
        public int screen { get; set; }
        public List<Answer> answers { get; set; }

    }
}
