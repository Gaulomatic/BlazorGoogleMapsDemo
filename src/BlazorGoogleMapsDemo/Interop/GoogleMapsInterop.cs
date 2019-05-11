using System;
using System.Threading.Tasks;

using Microsoft.JSInterop;
using Microsoft.AspNetCore.Components;

namespace Logixware.Web.Blazor.Components.Interop
{
	public class GoogleMapsInterop
	{
		private readonly IJSRuntime _JsRuntime;

		public GoogleMapsInterop(IJSRuntime jsRuntime)
		{
			this._JsRuntime = jsRuntime ?? throw new ArgumentNullException(nameof(jsRuntime));
		}

		public Task<Boolean> SetLocationAsync(GoogleMapsLocation location)
			=> this._JsRuntime.InvokeAsync<Boolean>("Logixware.Blazor.GoogleMaps.SetLocation", location);

		public Task<Boolean> SetOptionsAsync(GoogleMapsOptions options)
			=> this._JsRuntime.InvokeAsync<Boolean>("Logixware.Blazor.GoogleMaps.SetOptions", options);

		public Task<Boolean> InitializeAsync(ElementRef element, String key, String protocol)
			=> this._JsRuntime.InvokeAsync<Boolean>("Logixware.Blazor.GoogleMaps.Initialize", element, key, protocol);
	}
}
