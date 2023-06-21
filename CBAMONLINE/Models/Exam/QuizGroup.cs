namespace CBAMONLINE.Models.Exam
{
    public class QuizGroup
    {
        public string description { get; set; }
        public string id { get; set; }
        public string link { get; set; }
        public int screen { get; set; }
        public List<Question> questions { get; set; }
    }
}
