using System.Text.Json.Serialization;

namespace WizardsBackEnd
{
    public partial class Wizard
    {

        public long Id { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string Content { get; set; } = null!;
        public long OwnerId { get; set; } 
        public bool Answered { get; set; }
        public bool Show { get; set; }

    }
}
