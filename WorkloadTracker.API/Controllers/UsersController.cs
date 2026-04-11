using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using WorkloadTracker.API.Models;

namespace WorkloadTracker.API.Controllers;
//forr dropwdow of usersd
[ApiController]
[Route("api/users")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;

    public UsersController(UserManager<AppUser> userManager)
    {
        _userManager = userManager;
    }

    [HttpGet]
    public IActionResult GetUsers()
    {
        var users = _userManager.Users
            .Select(u => new { u.Id, u.FullName, u.Email, u.Role })
            .ToList();

        return Ok(users);
    }
}