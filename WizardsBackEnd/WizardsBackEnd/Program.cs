using Microsoft.EntityFrameworkCore;
using WizardsBackEnd;

var builder = WebApplication.CreateBuilder(args);

/*builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "policy",
                      builder =>
                      {
                          builder.WithOrigins("http://127.0.0.1:5500").AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin();
                         
                      });
});*/



// Add services to the container.

builder.Services.AddDbContext<WizardsContext>(opt =>
  opt.UseSqlServer(@"Data Source=(localdb)\MSSQLLocalDB;Initial Catalog=Wizards;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False"));
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseCors();
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseHttpsRedirection();


app.UseAuthorization();

app.MapControllers();

app.Run();
