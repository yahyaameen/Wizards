using System;
using System.Collections.Generic;

namespace WizardsBackEnd
{
    public partial class WizardResult
    {
        public long WizardId { get; set; }
        public long UserId { get; set; }
        public string UserAnswer { get; set; } = null!;

    }
}
