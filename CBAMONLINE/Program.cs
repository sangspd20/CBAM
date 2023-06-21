using CBAMONLINE.Infrastructure.Constants;
using CBAMONLINE.Infrastructure.Filters;
using CBAMONLINE.Infrastructure.Mappings;
using CBAMONLINE.Infrastructure.Security;
using CBAMONLINE.Services;
using CBAMONLINE.Services.IServices;
using Microsoft.AspNetCore.CookiePolicy;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews(options =>
{
    options.Filters.Add<CustomActionFilter>();

}).AddRazorRuntimeCompilation()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions
                    .PropertyNamingPolicy = null;
                });

builder.Services.AddDataProtection();

builder.Services.AddScoped<IGraphQLFactory, GraphQLFactory>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserProfileService, UserProfileService>();
builder.Services.AddScoped<IContestService, ContestService>();
builder.Services.AddScoped<INewsService, NewsService>();
builder.Services.AddScoped<ISystemService, SystemService>();
builder.Services.AddScoped<ILibraryService, LibraryService>();
builder.Services.AddScoped<IExamHistoryService, ExamHistoryService>();
builder.Services.AddScoped<IExamProfileService, ExamProfileService>();
builder.Services.AddScoped<IExamService, ExamService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<IVnPayService, VnPayService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();

builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
builder.Services.AddSingleton<CustomIDataProtection>();

//builder.Services.Configure<CookiePolicyOptions>(options =>
//{
//    // This lambda determines whether user consent for non-essential cookies is needed for a given request.
//    options.CheckConsentNeeded = context => true;
//    options.MinimumSameSitePolicy = SameSiteMode.None;
//});

//builder.Services.Configure<CookiePolicyOptions>(options =>
//{

//    // prevent access from javascript 
//    options.HttpOnly = HttpOnlyPolicy.Always;

//    // If the URI that provides the cookie is HTTPS, 
//    // cookie will be sent ONLY for HTTPS requests 
//    // (refer mozilla docs for details) 
//    options.Secure = CookieSecurePolicy.SameAsRequest;

//    // refer "SameSite cookies" on mozilla website 
//    options.MinimumSameSitePolicy = SameSiteMode.None;

//});

builder.Services.AddDistributedMemoryCache();

builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(100);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

builder.Services.AddCookieManager();

// Mappings
builder.Services.AddAutoMapper(typeof(AuthProfile));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();
app.UseSession();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
