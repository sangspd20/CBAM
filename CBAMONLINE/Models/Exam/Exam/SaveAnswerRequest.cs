namespace CBAMONLINE.Models.Exam.Exam
{
    public class SaveAnswerRequest
    {
        public List<AnswerRequest> answers { get; set; }
        public string contestId { get; set; }
        public string id { get; set; }
        public string quesId { get; set; }
        public string quizId { get; set; }
        public string subjectId { get; set; }

    }
}
