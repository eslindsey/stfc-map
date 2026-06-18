export function init(map) {
	// Set up zoom handler
	var zoomTimeout = null;

	map.on('zoomstart', function() {
		if (zoomTimeout != null) {
			window.clearTimeout(zoomTimeout);
		}
	});

	map.on('zoomend', function() {
		zoomTimeout = window.setTimeout(function() {
			var zoom = map.getZoom();
			let min = map.options.minZoom;
			let max = map.options.maxZoom;
			let scale = 1.75 * (zoom - min) / (max - min) + 0.25;  // -2.5 = 25%, 0.0 = 100%, 2.5 = 175%
			//layer.bindTooltip(feature.properties.name + " (" + feature.properties.level + ")", {permanent: true, className: 'system-label', offset: [0, 0]});
			nodeIcon = L.icon({iconUrl: 'node.png', iconSize: [14 * scale, 13 * scale], popupAnchor: [235, 86]});
			map.eachLayer(function(layer) {
				let geometry = layer.feature?.geometry;
				if (!geometry) {
					return;
				}
				switch (geometry.type) {
					case 'Point':
						layer.setIcon(nodeIcon);
						break;
					case 'LineString':
						break;
					case 'Polygon':
						break;
				}
			});
			zoomTimeout = null;
		}, 200);
	});
}

