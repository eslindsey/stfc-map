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
var nodeIcon = L.icon({iconUrl: 'node.png', iconSize: [14, 13], popupAnchor: [235, 86]});
var tollIcon = L.icon({iconUrl: 'toll.png', iconSize: [19, 23]});
var lockIcon = L.icon({iconUrl: 'lock.png', iconSize: [24, 31]});

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
					layer.bindPopup(
						'<div class="system-pointer-generic">' +
							'<h3 class="faction">' + feature.properties.faction + '</h3>' +
							'<h1 class="name">' + feature.properties.name + ' [' + feature.properties.level + ']</h1>' +
							'<p class="id">S:' + feature.properties.objectid + '</p>' +
							'<div class="hostiles">Hostiles: <b>' + feature.properties.marauderSpawnRuleIds + '</b></div>' +
							'<div class="mining">Mining: <b>' + feature.properties.miningSetups + '</b></div>' +
						'</div>',
						{
							className:   'system-generic',
							closeButton: false,
						}
					);
					break;
				case 'LineString':
					layer.setStyle({color: '#3f6f6a', weight: 2, opacity: 0.75});
					let props = feature.properties;
					if (props.toll) {
						let toll = props.toll;
						coords = feature.geometry.coordinates;
						x1 = coords[0][0];
						y1 = coords[0][1];
						x2 = coords[1][0];
						y2 = coords[1][1];
						ctr_x = (x2 - x1) / 2 + x1;
						ctr_y = (y2 - y1) / 2 + y1;
						if (toll.resource) {
							layer.setStyle({dashArray: '8'});
							L.marker(xy(ctr_x, ctr_y)).setIcon(tollIcon).bindPopup(
								'<h2>Cost To Travel</h2>' +
								'<p>Warping from ' + props.source + ' to ' + props.dest + ' costs ' +
									'<span class="cost">' + toll.resource.name + ' x' + toll.quantity + '</span>' +
								'</p>',
								{
									className:   'toll',
									closeButton: false,
								}
							).addTo(map);
						} else if (toll.mission) {
							layer.setStyle({dashArray: '5 7', color: '#ff8080', weight: 4});
							L.marker(xy(ctr_x, ctr_y)).setIcon(lockIcon).bindPopup(
								'<h2>System Path Locked</h2>' +
								'<p>You must complete the mission ' + toll.mission + '</p>',
								{
									className:   'toll',
									closeButton: false,
								}
							).addTo(map);
						}
					}
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

