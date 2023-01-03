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
    public class WizardResultsController : ControllerBase
    {
        private readonly WizardsContext _context;

        public WizardResultsController(WizardsContext context)
        {
            _context = context;
        }

        // GET: api/WizardResults
        [HttpGet]
        public async Task<ActionResult<IEnumerable<WizardResult>>> GetWizardResults()
        {
            return await _context.WizardResults.ToListAsync();
        }

        // GET: api/WizardResults/5
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<WizardResult>>> GetWizardResult(long id)
        {
            var wizardResult =  _context.WizardResults.Where(w=>w.WizardId==id);

            if (wizardResult == null)
            {
                return NotFound();
            }

            return await wizardResult.ToListAsync();
        }

        // PUT: api/WizardResults/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutWizardResult(long id, WizardResult wizardResult)
        {
            if (id != wizardResult.WizardId)
            {
                return BadRequest();
            }

            _context.Entry(wizardResult).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!WizardResultExists(id))
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

        // POST: api/WizardResults
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<WizardResult>> PostWizardResult([FromBody] WizardResult wizardResult)
        {
            _context.WizardResults.Add(wizardResult);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (WizardResultExists(wizardResult.WizardId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetWizardResult", new { id = wizardResult.WizardId }, wizardResult);
        }

        // DELETE: api/WizardResults/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWizardResult(long id)
        {
            var wizardResult = await _context.WizardResults.FindAsync(id);
            if (wizardResult == null)
            {
                return NotFound();
            }

            _context.WizardResults.Remove(wizardResult);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool WizardResultExists(long id)
        {
            return _context.WizardResults.Any(e => e.WizardId == id);
        }
    }
}
