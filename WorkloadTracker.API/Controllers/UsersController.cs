using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using WorkloadTracker.API.DTOs;
using WorkloadTracker.API.Models;

namespace WorkloadTracker.API.Controllers;
//forr dropwdown of usersd
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
    [HttpPost("create")]
    public async Task<IActionResult> CreateUser([FromBody] RegisterDto dto)
    {
        var callerRole = User.FindFirst("role")?.Value
                         ?? User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

        if (callerRole != "Admin")
            return Forbid();

        var existing = await _userManager.FindByEmailAsync(dto.Email);
        if (existing != null)
            return BadRequest("A user with this email already exists.");

        var user = new AppUser
        {
            FullName = dto.FullName,
            Email    = dto.Email,
            UserName = dto.Email,
            Role     = dto.Role
        };

        var result = await _userManager.CreateAsync(user, dto.Password);

        if (!result.Succeeded)
            return BadRequest(result.Errors.Select(e => e.Description));

        return Ok(new { user.Id, user.FullName, user.Email, user.Role });
    }
    
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        var callerRole = User.FindFirst("role")?.Value
                         ?? User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

        if (callerRole != "Admin")
            return Forbid();

        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
            return NotFound("User not found.");

        var callerId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                       ?? User.FindFirst("sub")?.Value;

        if (callerId == id)
            return BadRequest("You cannot delete your own account.");

        var result = await _userManager.DeleteAsync(user);
        if (!result.Succeeded)
            return BadRequest(result.Errors.Select(e => e.Description));

        return Ok("User deleted.");
    }  
}