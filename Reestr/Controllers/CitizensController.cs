using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Reestr.Models;

namespace Reestr.Controllers
{
    [Route("api/citizens")]
    [ApiController]
    public class CitizensController : ControllerBase
    {
        private CitizenContext _context;

        public CitizensController(CitizenContext context)
        {
            _context = context;
        }

        [HttpGet("Search")]
        public async Task<IActionResult> GetCitizens(string firstName, string patronymic, string lastName, string startDate, string endDate)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var d1 = "";
            var d2 = "";
            var list = new List<Citizen>();
            try
            {
              
                d1 = (startDate != null ? startDate : "01/01/0001");
                d2 = (endDate != null ? endDate : DateTime.Now.Date.ToString());
               
                firstName = (firstName != null ? "'" + char.ToUpper(firstName[0]) + firstName.ToLower().Substring(1) + "'" : "firstname");
                lastName = (lastName != null ? "'" + char.ToUpper(lastName[0]) + lastName.ToLower().Substring(1) + "'" : "lastname");
                patronymic = (patronymic != null ? "'" + char.ToUpper(patronymic[0]) + patronymic.ToLower().Substring(1) + "'" : "patronymic");
                list = await _context.Citizens
                          .FromSql($"Select * from citizens where (firstname = {firstName} and lastName = {lastName} and patronymic = {patronymic} and (dateofbirth between '{d1}' and '{d2}'))", firstName, lastName, patronymic, d1, d2)
                          .ToListAsync();
            }
            catch (Exception)
            {
                return BadRequest();
            }
            return new JsonResult(list);
        }

        [HttpPost("Add")]
        public async Task<IActionResult> Add(Citizen citizen)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
           
            if ((citizen.FirstName.Any(c => !char.IsLetter(c))) || (citizen.LastName.Any(c => !char.IsLetter(c))) || (citizen.Patronymic.Any(c => !char.IsLetter(c))))
                return BadRequest();
            try
            {
                citizen.LastName = char.ToUpper(citizen.LastName[0]) + citizen.LastName.ToLower().Substring(1);
                citizen.FirstName = char.ToUpper(citizen.FirstName[0]) + citizen.FirstName.ToLower().Substring(1);
                citizen.Patronymic = char.ToUpper(citizen.Patronymic[0]) + citizen.Patronymic.ToLower().Substring(1);
                _context.Citizens.Add(citizen);
                await _context.SaveChangesAsync();
            }
            catch (Exception)
            {
                return BadRequest();
            }
            return Ok();
        }



        [HttpPut("Update")]
        public async Task<IActionResult> Update(Citizen citizen)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if ((citizen.FirstName.Any(c => !char.IsLetter(c))) || (citizen.LastName.Any(c => !char.IsLetter(c))) || (citizen.Patronymic.Any(c => !char.IsLetter(c))))
                return BadRequest();
            try
            {
                citizen.LastName = char.ToUpper(citizen.LastName[0]) + citizen.LastName.ToLower().Substring(1);
                citizen.FirstName = char.ToUpper(citizen.FirstName[0]) + citizen.FirstName.ToLower().Substring(1);
                citizen.Patronymic = char.ToUpper(citizen.Patronymic[0]) + citizen.Patronymic.ToLower().Substring(1);
                _context.Entry(citizen).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
            catch (Exception)
            {
                return BadRequest();
            }
            System.Diagnostics.Debug.WriteLine("PUT");
            return Ok();
        }


        [HttpDelete("Delete")]
        public async Task<IActionResult> Delete(Citizen citizen)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                _context.Citizens.Remove(citizen);
                await _context.SaveChangesAsync();
            }
            catch (Exception)
            {
                return BadRequest();
            }

            return Ok(citizen);
        }

    }
}
