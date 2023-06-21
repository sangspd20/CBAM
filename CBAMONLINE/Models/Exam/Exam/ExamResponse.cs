using System.Collections.Generic;

namespace CBAMONLINE.Models.Exam.Exam
{
    public class ExamResponse
    {
        public string id { get; set; }
        public string avatar { get; set; }
        public bool finished { get; set; }
        public List<QuizGroup> quizGroup { get; set; }
        public List<Subject> subjects { get; set; }
    }
}
