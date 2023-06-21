namespace CBAMONLINE.Services.IServices
{
    public interface IScreenshotService
    {
        Task<byte[]> ScreenshotUrlAsync(string url);
    }
}
