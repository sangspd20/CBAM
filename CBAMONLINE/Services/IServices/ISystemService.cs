using CBAMONLINE.Models;
using CBAMONLINE.Models.System;
using CBAMONLINE.Models.System.Location;

namespace CBAMONLINE.Services.IServices
{
    public interface ISystemService
    {
        Task<QueryResponse<SystemCounter>> GetSystemCounter();
        Task<QueryResponse<List<LocationResponse>>> GetLocations(LocationRequest request);
    }
}
