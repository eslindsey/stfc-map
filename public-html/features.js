export function init(map) {
	// Feature buckets
	var systemItems  = L.featureGroup().addTo(map),
		warpItems    = L.featureGroup().addTo(map),
		tollItems    = L.featureGroup().addTo(map),
		missionItems = L.featureGroup().addTo(map),
		regionItems  = L.featureGroup().addTo(map);
	layersControl.addOverlay(systemItems,  "Systems");
	layersControl.addOverlay(warpItems,    "Warp Paths");
	layersControl.addOverlay(tollItems,    "Toll Paths");
	layersControl.addOverlay(missionItems, "Mission Paths");
	layersControl.addOverlay(regionItems,  "Regions");

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
						systemItems.addLayer(layer);
						break;
					case 'LineString':
						layer.setStyle({color: '#3f6f6a', weight: 2, opacity: 0.75});
						let props = feature.properties;
						if (props.toll) {
							let toll = props.toll,
								coords = feature.geometry.coordinates,
								x1 = coords[0][0],
								y1 = coords[0][1],
								x2 = coords[1][0],
								y2 = coords[1][1],
								ctr_x = (x2 - x1) / 2 + x1,
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
								).addTo(tollItems);
								tollItems.addLayer(layer);
							} else if (toll.mission) {
								layer.setStyle({dashArray: '5 7', color: '#ff8080', weight: 4});
								L.marker(xy(ctr_x, ctr_y)).setIcon(lockIcon).bindPopup(
									'<h2>System Path Locked</h2>' +
									'<p>You must complete the mission <a href="https://stfc.space/missions/' + toll.mission.id + '" target="_blank">' + toll.mission.title + '</a></p>',
									{
										className:   'toll',
										closeButton: false,
									}
								).addTo(missionItems);
								missionItems.addLayer(layer);
							} else {
								debugger;
								console.log("ERROR: Toll type not recognized");
								warpItems.addLayer(layer);
							}
						} else {
							warpItems.addLayer(layer);
						}
						break;
					case 'Polygon':
						layer.setStyle({color: feature.properties.color, weight: 0});
						regionItems.addLayer(layer);
						break;
					default:
						debugger;
				}
			},
		}); //.addTo(map);
		ready();
	});

	// Check for parameters
	function ready() {
		let url = new URL(document.location),
			params = url.searchParams,
			s = params.get('s');
		if (s) {
			for (let i in geo.features) {
				let f = geo.features[i];
				if (!'objectid' in f.properties) {
					continue;
				}
				if (f.properties['objectid'] != s) {
					if (f.properties['objectid'])
						console.debug(f.properties['objectid']);
					continue;
				}
				let coords = xy(f.geometry.coordinates);
				L.marker(coords).addTo(map);
				map.setView(coords, 1);
				return;
			}
		}
		let mp = params.get('marker');
		if (mp) {
			let coords = xy(mp.split(','));
			L.marker(coords).addTo(map);
			map.setView(coords, 1);
		}
	}

	xhr.send();
}

