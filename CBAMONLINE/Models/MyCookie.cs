namespace CBAMONLINE.Models
{

    public class MyCookie<T>
    {
        public string Id { get; set; }

        public DateTime Date { get; set; }
        public DateTime Expires { get; set; }

        public T Value { get; set; }
    }
}
