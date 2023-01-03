using System;
using System.Collections.Generic;

namespace WizardsBackEnd
{
    public partial class UserDetail
    {

        public long Id { get; set; }
        public string Name { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Role { get; set; } = null!;
    }
}
