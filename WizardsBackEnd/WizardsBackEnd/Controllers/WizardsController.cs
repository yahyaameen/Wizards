#nullable disable
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WizardsBackEnd;

namespace WizardsBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WizardsController : ControllerBase
    {
        private readonly WizardsContext _context;

        public WizardsController(WizardsContext context)
        {
            _context = context;
        }

        // GET: api/Wizards
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Wizard>>> GetWizards()
        {
            return await _context.Wizards.ToListAsync();
        }

        // GET: api/Wizards/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Wizard>> GetWizard(long id)
        {
            var wizard = await _context.Wizards.FindAsync(id);

            if (wizard == null)
            {
                return NotFound();
            }

            return wizard;
        }

        // PUT: api/Wizards/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutWizard(long id, Wizard wizard)
        {
            if (id != wizard.Id)
            {
                return BadRequest();
            }

            _context.Entry(wizard).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!WizardExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Wizards
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Wizard>> PostWizard([FromBody]Wizard wizard)
        {

            _context.Wizards.Add(wizard);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetWizard", new { id = wizard.Id }, wizard);
        }

        // DELETE: api/Wizards/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWizard(long id)
        {
            var wizard = await _context.Wizards.FindAsync(id);
            if (wizard == null)
            {
                return NotFound();
            }

            _context.Wizards.Remove(wizard);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool WizardExists(long id)
        {
            return _context.Wizards.Any(e => e.Id == id);
        }
    }
}
