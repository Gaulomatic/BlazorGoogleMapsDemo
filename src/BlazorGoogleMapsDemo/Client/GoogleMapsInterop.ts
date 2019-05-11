declare var $;

interface ILocation
{
	street: string;
	city: string;
	country: string;
	latitude: number;
	longitude: number;
}

interface IOptions
{
	logoUrl: string;
	markerImageUrl: string;
	zoom: number;
	draggable: boolean;
	panControl: boolean;
	zoomControl: boolean;
	mapTypeControl: boolean;
	scaleControl: boolean;
	streetViewControl: boolean;
	overviewMapControl: boolean;
	scrollwheel: boolean;
}

interface IGoogleMapsInterop
{
	SetLocation(location: ILocation): boolean;
	SetOptions(options: IOptions): boolean;
	Initialize(element: Element, protocol: string, key: string): boolean;
}

export class GoogleMapsInterop implements IGoogleMapsInterop
{
	private Element: any = {};
	private HasScriptBeenIncluded: boolean = false;

	private Location: ILocation;
	private Options: IOptions;

	public SetLocation = (location: ILocation): boolean =>
	{
		try
		{
			this.Location = location;
			return true;
		}
		catch (ex)
		{
			console.error(ex);
		}

		return false;
	};

	public SetOptions = (options: IOptions): boolean =>
	{
		try
		{
			this.Options = options;
			return true;
		}
		catch (ex)
		{
			console.error(ex);
		}

		return false;
	};

	public Initialize = (element: Element, key: string, protocol: string): boolean =>
	{
		try
		{
			this.Element = element;

			if (!this.HasScriptBeenIncluded)
			{
				const __Script = document.createElement("script");

				__Script.setAttribute("type", "text/javascript");
				__Script.setAttribute("src", `${protocol}://maps.googleapis.com/maps/api/js?key=${key}&callback=Logixware.Blazor.GoogleMaps.DrawMap`);

				document.getElementsByTagName("head")[ 0 ].appendChild(__Script);

				this.HasScriptBeenIncluded = true;
			}
			else
			{
				this.DrawMap();
			}

			return true;
		}
		catch (ex)
		{
			console.error(ex);
		}

		return false;
	};

	private DrawMap = (): void =>
	{
		const __MapMarkers = [
			{
				address: `${this.Location.street}, ${this.Location.city}, ${this.Location.country}`,
				html: this.Options.logoUrl ?
					`<img src="${this.Options.logoUrl}" alt="Logo" class="mb-5 mt-5" style="max-height: 40px;" /><br />${this.Location.street}<br />${this.Location.city}` :
					`${this.Location.street}<br />${this.Location.city}`,
				icon: {
					image: this.Options.markerImageUrl,
					iconsize: [ 26, 46 ],
					iconanchor: [ 12, 46 ]
				},
				popup: true
			}
		];

		// Map Extended Settings
		const __MapSettings = {
			controls: {
				draggable: this.Options.draggable,
				panControl: this.Options.panControl,
				zoomControl: this.Options.zoomControl,
				mapTypeControl: this.Options.mapTypeControl,
				scaleControl: this.Options.scaleControl,
				streetViewControl: this.Options.streetViewControl,
				overviewMapControl: this.Options.overviewMapControl
			},
			scrollwheel: this.Options.scrollwheel,
			markers: __MapMarkers,

			// Map Initial Location
			latitude: this.Location.latitude,
			longitude: this.Location.longitude,

			zoom: this.Options.zoom
		};

		const __Map = $(this.Element).gMap(__MapSettings);

		// Map Center At
		const mapCenterAt = (options, e) =>
		{
			e.preventDefault();
			$(this.Element).gMap("centerAt", options);
		}
	};
}
