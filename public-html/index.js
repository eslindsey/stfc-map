const yx = L.latLng;
var geo = null;

function xy(x, y) {
	// Handle calls of xy([?, ?]) as well as xy(?, ?)
	return Array.isArray(x) ? yx(x[1], x[0]) : yx(y, x);
}

var bounds = [xy(-2402, -2094), xy(3972, 3380)];

// Make the map
const map = L.map('map', {
	crs: L.CRS.Simple,
	bounds: bounds,
	renderer: L.canvas(),
	minZoom: -2.5,
	maxZoom: 2.5,
	zoomSnap: 0.0,
	zoomDelta: 0.25,
	wheelPxPerZoomLevel: 60,
	attributionControl: false,
});

map.setView(xy(-43, 274), -1) // Sol
L.control.attribution()
	.addAttribution("Map by <a href='https://github.com/eslindsey/stfc-map'>#049 [MAQI] eslindsey</a>")
	.addTo(map);
var layersControl = L.control.layers({}, {}, {position: 'topright', collapsed: true}).addTo(map);

// Set up the visuals
var nodeIcon = L.icon({iconUrl: 'node.png', iconSize: [14, 13], popupAnchor: [235, 86]}),
	tollIcon = L.icon({iconUrl: 'toll.png', iconSize: [19, 23]}),
	lockIcon = L.icon({iconUrl: 'lock.png', iconSize: [24, 31]});

import('./features.js').then(module => module.init(map));
import('./drawing.js').then(module => module.init(map));
import('./zooming.js').then(module => module.init(map));

