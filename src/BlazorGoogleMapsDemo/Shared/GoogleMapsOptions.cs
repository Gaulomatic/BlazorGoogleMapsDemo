using System;

namespace Logixware.Web.Blazor.Components
{
	public class GoogleMapsOptions
	{
		public String LogoUrl { get; set; }
		public String MarkerImageUrl { get; set; }
		public Int32 Zoom { get; set; } = 16;
		public Boolean Draggable { get; set; } = true;
		public Boolean PanControl { get; set; } = true;
		public Boolean ZoomControl { get; set; } = true;
		public Boolean MapTypeControl { get; set; } = true;
		public Boolean ScaleControl { get; set; } = true;
		public Boolean StreetViewControl { get; set; } = true;
		public Boolean OverviewMapControl { get; set; } = true;
		public Boolean Scrollwheel { get; set; } = false;
	}
}
