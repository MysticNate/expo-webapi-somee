using System.Data.SqlClient;

namespace WebApplication1.Models
{
    public class DBServices
    {
        // local server for testing + my somee server
        //static string conStr = @"Data Source=NATESPC\SQLEXPRESS;Initial Catalog=OurShop;Integrated Security=True";
        static string conStr = "workstation id=OurShop.mssql.somee.com;packet size=4096;user id=Mystic_SQLLogin_1;pwd=hmnbpto4g8;data source=OurShop.mssql.somee.com;persist security info=False;initial catalog=OurShop;TrustServerCertificate=True";

        // tried Nir's solution but had some issues so we found another way

        //private static User ExcQUser(string command)
        //{
        //    User user = null;
        //    SqlConnection con = new SqlConnection(conStr);
        //    SqlCommand comm = new SqlCommand(command, con);

        //    comm.Connection.Open();
        //    SqlDataReader reader = comm.ExecuteReader();
        //    if (reader.Read())
        //    {
        //        user = new User()
        //        {
        //            Id = (int)reader["Id"],
        //            isAdmin = (bool)reader["isAdmin"],
        //            email = (string)reader["email"],
        //            password = (string)reader["password"],
        //        };
        //    }

        //    comm.Connection.Close();

        //    return user;
        //}


        public static User Login(User checkUser)
        {
            User loggedInUser = null;
            // 'using' for SqlConnection and SqlCommand to ensure they are disposed properly
            using (SqlConnection con = new SqlConnection(conStr))
            {
                // defining the SQL query with parameters
                string query = "SELECT Id, email, password, isAdmin FROM DBUsers WHERE email = @Email AND password = @Password";
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    // add parameters and their values
                    // SqlParameter to avoid SQL injection
                    cmd.Parameters.AddWithValue("@Email", checkUser.email);
                    cmd.Parameters.AddWithValue("@Password", checkUser.password); 

                    try
                    {
                        con.Open();
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            if (reader.Read()) 
                            {
                                loggedInUser = new User()
                                {
                                    Id = reader.GetInt32(reader.GetOrdinal("Id")),
                                    email = reader.GetString(reader.GetOrdinal("email")),
                                    password = reader.GetString(reader.GetOrdinal("password")), // You are fetching the password
                                    isAdmin = reader.GetBoolean(reader.GetOrdinal("isAdmin"))
                                };
                            }
                        }
                    }
                    catch (SqlException ex)
                    {
                        Console.WriteLine("SQL Error in Login: " + ex.Message);
                        return null;
                    }
                    // no need for con.Close() if using 'using' block for SqlDataReader and SqlConnection
                }
            }
            return loggedInUser;
        }

        public static bool Register(User newUser)
        {
            using (SqlConnection con = new SqlConnection(conStr))
            {
                try
                {
                    con.Open();

                    string checkQuery = "SELECT COUNT(*) FROM DBUsers WHERE email = @Email";
                    int count = 0;
                    using (SqlCommand checkCmd = new SqlCommand(checkQuery, con))
                    {
                        checkCmd.Parameters.AddWithValue("@Email", newUser.email);
                        // ExecuteScalar returns the first column of the first row
                        object result = checkCmd.ExecuteScalar();
                        if (result != null && result != DBNull.Value)
                        {
                            count = Convert.ToInt32(result);
                        }
                    }

                    if (count > 0)
                    {
                        return false;
                    }

                    // inserting new user
                    string insertQuery = "INSERT INTO DBUsers (email, password, isAdmin) VALUES (@Email, @Password, @IsAdmin)";
                    using (SqlCommand cmd = new SqlCommand(insertQuery, con))
                    {
                        cmd.Parameters.AddWithValue("@Email", newUser.email);
                        cmd.Parameters.AddWithValue("@Password", newUser.password);
                        cmd.Parameters.AddWithValue("@IsAdmin", newUser.isAdmin);

                        int rowsAffected = cmd.ExecuteNonQuery();
                        return rowsAffected > 0;
                    }
                }
                catch (SqlException ex)
                {
                    Console.WriteLine("SQL Error in Register: " + ex.Message);
                    return false;
                }
            }
        }

        public static List<User> GetAllUsers()
        {
            List<User> list = new List<User>();
            using SqlConnection con = new SqlConnection(conStr);
            SqlCommand cmd = new SqlCommand("SELECT * FROM DBUsers", con);

            con.Open();
            SqlDataReader reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                list.Add(new User()
                {
                    Id = (int)reader["Id"],
                    email = (string)reader["email"],
                    password = (string)reader["password"],
                    isAdmin = (bool)reader["isAdmin"]
                });
            }

            return list;
        }

        public static bool UpdateUser(int id, User updatedUser)
        {
            using (SqlConnection con = new SqlConnection(conStr))
            {
                string query = "UPDATE DBUsers SET email = @Email, password = @Password, isAdmin = @IsAdmin WHERE Id = @Id";
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@Email", updatedUser.email);
                    cmd.Parameters.AddWithValue("@Password", updatedUser.password); 
                    cmd.Parameters.AddWithValue("@IsAdmin", updatedUser.isAdmin);
                    cmd.Parameters.AddWithValue("@Id", id); 

                    try
                    {
                        con.Open();
                        int rowsAffected = cmd.ExecuteNonQuery();
                        return rowsAffected > 0;
                    }
                    catch (SqlException ex)
                    {
                        Console.WriteLine("SQL Error in UpdateUser: " + ex.Message);
                        return false;
                    }
                }
            }
        }

        public static bool DeleteUser(int id)
        {
            using (SqlConnection con = new SqlConnection(conStr))
            {
                string query = "DELETE FROM DBUsers WHERE Id = @Id";
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@Id", id);

                    try
                    {
                        con.Open();
                        int rowsAffected = cmd.ExecuteNonQuery();
                        return rowsAffected > 0;
                    }
                    catch (SqlException ex)
                    {
                        Console.WriteLine("SQL Error in DeleteUser: " + ex.Message);
                        return false;
                    }
                }
            }
        }

        public static User GetUserById(int id)
        {
            User user = null;
            using (SqlConnection con = new SqlConnection(conStr))
            {
                string query = "SELECT Id, email, password, isAdmin FROM DBUsers WHERE Id = @Id";
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@Id", id);
                    try
                    {
                        con.Open();
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                user = new User()
                                {
                                    Id = reader.GetInt32(reader.GetOrdinal("Id")),
                                    email = reader.GetString(reader.GetOrdinal("email")),
                                    password = reader.GetString(reader.GetOrdinal("password")),
                                    isAdmin = reader.GetBoolean(reader.GetOrdinal("isAdmin"))
                                };
                            }
                        }
                    }
                    catch (SqlException ex)
                    {
                        Console.WriteLine("SQL Error in GetUserById: " + ex.Message);
                        return null;
                    }
                }
            }
            return user;
        }


    }
}
