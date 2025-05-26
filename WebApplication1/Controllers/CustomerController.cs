using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok("working correctly!");
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult Post([FromBody] User checkUser)
        {
            try
            {
                if (checkUser == null)
                    return BadRequest();

                User loggedInUser = DBServices.Login(checkUser);

                if (loggedInUser != null)
                {
                    return Ok(loggedInUser);
                }
                else
                {
                    return NoContent();
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] User newUser)
        {
            try
            {
                if (newUser == null || string.IsNullOrWhiteSpace(newUser.email) || string.IsNullOrWhiteSpace(newUser.password))
                {
                    return BadRequest(new { message = "User data, email, and password are required." });
                }

                bool registrationSuccessful = DBServices.Register(newUser);

                if (registrationSuccessful)
                {
                    
                    User registeredUser = DBServices.Login(new User { email = newUser.email, password = newUser.password });

                    if (registeredUser != null)
                    {
                        registeredUser.password = null;
                        return StatusCode(StatusCodes.Status201Created, registeredUser);
                    }
                    else
                    {
                        return StatusCode(StatusCodes.Status201Created, new { message = "User created, but could'nt retrieve details. Please try logging in." });
                    }
                }
                else
                {
                    return BadRequest(new { message = "Email already exists. Please use a different email or login." });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error during registration: {ex.ToString()}");

                // For generic/unexpected exceptions, return a 500 Internal Server Error.
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An unexpected error occurred on the server.", details = ex.Message });
            }
        }

        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(User))]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult Login([FromBody] User loginUser)
        {
            try
            {
                if (loginUser == null || string.IsNullOrEmpty(loginUser.email) || string.IsNullOrEmpty(loginUser.password))
                {
                    return BadRequest("Missing email or password.");
                }

                User existingUser = DBServices.Login(loginUser);

                if (existingUser == null)
                {
                    return NoContent(); // Login failed
                }

                return Ok(existingUser); // Login successful
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred during login.");
            }
        }



        [HttpGet("all")]
        public IActionResult GetAllUsers()
        {
            try
            {
                List<User> users = DBServices.GetAllUsers();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public IActionResult UpdateUser(int id, [FromBody] User updatedUser)
        {
            try
            {
                bool result = DBServices.UpdateUser(id, updatedUser);
                if (result)
                    return Ok("User updated");
                else
                    return NotFound("User not found");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteUser(int id)
        {
            try
            {
                bool result = DBServices.DeleteUser(id);
                if (result)
                    return Ok("User deleted");
                else
                    return NotFound("User not found");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(User))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult GetUser(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest("Invalid user ID.");
                }

                User user = DBServices.GetUserById(id);

                if (user == null)
                {
                    return NotFound("User not found.");
                }
                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while retrieving user data.");
            }
        }


    }
}
