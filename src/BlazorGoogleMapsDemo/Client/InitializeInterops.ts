import { GoogleMapsInterop } from "./GoogleMapsInterop";

declare var window;

namespace BlazorGoogleMapsDemo
{
	const __BlazorExtensions: string = "Blazor";
	// define what this extension adds to the window object inside BlazorExtensions
	const __ExtensionObject = {
		GoogleMaps: new GoogleMapsInterop()
	};

	export function initialize(): void
	{
		if (typeof window === "undefined") return;
		if (typeof window.Logixware == "undefined") window.Logixware = {};

		const __WindowObject = window.Logixware;

		if (!__WindowObject[ __BlazorExtensions ])
		{
			// when the library is loaded in a browser via a <script> element, make the
			// following APIs available in global scope for invocation from JS
			__WindowObject[ __BlazorExtensions ] = {
				...__ExtensionObject
			};
		}
		else
		{
			__WindowObject[ __BlazorExtensions ] = {
				...__WindowObject[ __BlazorExtensions ],
				...__ExtensionObject
			};
		}
	}
}

BlazorGoogleMapsDemo.initialize();
