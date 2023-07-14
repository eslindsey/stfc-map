const yx = L.latLng;
var geo = null;

function xy(x, y) {
	if (Array.isArray(x)) { // When doing xy([x, y]);
		return yx(x[1], x[0]);
	}
	return yx(y, x); // When doing xy(x, y);
}

var bounds = [xy(-2402, -2094), xy(3972, 3380)];

// Make the map
const map = L.map('map', {
	crs: L.CRS.Simple,
	bounds: bounds,
	minZoom: -3,
});

map.setView(xy(-43, 274), -1) // Sol

// Set up the visuals
var nodeIcon = L.icon({
	iconUrl: 'node.png',
	iconSize: [14, 13],
	popupAnchor: [297, 197],
});

// Load the data
var xhr = new XMLHttpRequest();
xhr.open('GET', 'geo.json');
xhr.responseType = 'json';
xhr.addEventListener('load', function() {
	if (xhr.status !== 200) {
		console.log("Couldn't load GeoJSON");
		return;
	}
	geo = xhr.response;
	L.geoJSON(xhr.response, {
		onEachFeature: function(feature, layer) {
			if (feature == null || feature.geometry == null)
				debugger;
			switch (feature.geometry.type) {
				case 'Point':
					layer.setIcon(nodeIcon);
					layer.bindPopup('<h1 class="name">' + feature.properties.name + ' [' + feature.properties.level + ']</h1><p class="id">S: ' + feature.properties.objectid + '</p>');
					break;
				case 'LineString':
					layer.setStyle({color: '#3f6f6a', weight: 1, opacity: 0.75});
					break;
				case 'Polygon':
					layer.setStyle({color: feature.properties.color, weight: 0});
					break;
				default:
					debugger;
			}
		},
	}).addTo(map);
	ready();
});
xhr.send();

// Check for parameters
function ready() {
	var url = new URL(document.location);
	var params = url.searchParams;
	let s = params.get('s');
	if (s) {
		for (i in geo.features) {
			f = geo.features[i];
			if (!'objectid' in f.properties) {
				continue;
			}
			if (f.properties['objectid'] != s) {
				continue;
			}
			coords = xy(f.geometry.coordinates);
			var marker = L.marker(coords).addTo(map);
			map.setView(coords, 1);
			return;
		}
	}
	let mp = params.get('marker');
	if (mp) {
		coords = xy(mp.split(','));
		var marker = L.marker(coords).addTo(map);
		map.setView(coords, 1);
	}
}

// Set up zoom handler
map.on('zoomend', function() {
	var zoom = map.getZoom();
	//layer.bindTooltip(feature.properties.name + " (" + feature.properties.level + ")", {permanent: true, className: 'system-label', offset: [0, 0]});
});

