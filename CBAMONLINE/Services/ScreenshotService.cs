using CBAMONLINE.Models;
using CBAMONLINE.Models.Contest;
using CBAMONLINE.Models.News;
using CBAMONLINE.Models.System;
using CBAMONLINE.Models.System.Location;
using CBAMONLINE.Services.IServices;
using PuppeteerSharp;

namespace CBAMONLINE.Services
{
    public class ScreenshotService : IScreenshotService
    {
        public async Task<byte[]> ScreenshotUrlAsync(string url)
        {
            // First download the browser (this will only happen once)
            await DownloadBrowserAsync();

            // Start a new instance of Google Chrome in headless mode
            var browser = await Puppeteer.LaunchAsync(new LaunchOptions()
            {
                Headless = true,
                DefaultViewport = new ViewPortOptions()
                {
                    Width = 1920,
                    Height = 1080
                }
            });

            // Create a new tab/page in the browser and navigate to the URL
            var page = await browser.NewPageAsync();
            await page.GoToAsync(url);

            // Screenshot the page and return the byte stream
            var bytes = await page.ScreenshotDataAsync();

            await browser.CloseAsync();

            return bytes;
        }

        private async Task DownloadBrowserAsync()
        {
            using var browserFetcher = new BrowserFetcher();
            await browserFetcher.DownloadAsync(BrowserFetcher.DefaultChromiumRevision);
        }
    }
}
