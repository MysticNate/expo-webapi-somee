namespace WebApplication1.Models
{
    public class User
    {
        public int Id { get; set; }
        public string email { get; set; }
        public string password { get; set; }
        public bool isAdmin { get; set; }
    }
}
