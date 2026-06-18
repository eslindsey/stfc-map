export function init(map) {
	// Drawing controls
	var drawnItems = L.featureGroup();
	layersControl.addOverlay(drawnItems, "Drawings");
	let toolbar = new LeafletToolbar.DrawToolbar({
		position: 'topleft',
		actions: [
			LeafletToolbar.DrawAction.Polygon,
			LeafletToolbar.DrawAction.Polyline,
			LeafletToolbar.DrawAction.CircleMarker,
		],
	});
	//let toolbar = new L.Control.Draw({
	//	edit: {
	//		featureGroup: drawnItems,
	//		poly: {
	//			allowIntersection: false,
	//		},
	//	},
	//	draw: {
	//		polyline: {
	//			allowIntersection: false,
	//		},
	//		polygon: {
	//			allowIntersection: false,
	//		},
	//		rectangle: false,
	//		circle:    false,
	//		marker:    false,
	//	},
	//});
	
	// Color, save, load controls
	map.editActions = [
		LeafletToolbar.EditAction.Popup.Edit,
		LeafletToolbar.EditAction.Popup.Delete,
		LeafletToolbar.ToolbarAction.extendOptions({
			toolbarIcon: {
				className: 'leaflet-color-picker',
				html: '<i class="fa fa-eyedropper"></i>',
			},
			subToolbar: new LeafletToolbar({ actions: [
				L.ColorPicker.extendOptions({ color: '#db1d0f' }),
				L.ColorPicker.extendOptions({ color: '#025100' }),
				L.ColorPicker.extendOptions({ color: '#ffff00' }),
				L.ColorPicker.extendOptions({ color: '#0000ff' })
			]}),
		}),
		LeafletToolbar.ToolbarAction.extend({
			options: {
				toolbarIcon: {
					className: 'leaflet-poly-info',
					html: '<i class="fa fa-circle-info"></i>',
				},
			},
			enable: function() {
				var shape = this._shape;
				map.removeLayer(this.toolbar);
				alert('Getting you more info!');
			},
		}),
	];

	// Drawing layer hidden/shown
	map.on('overlayadd', function(e) {
		if (e.layer !== drawnItems)
			return;
		map.addControl(toolbar);
	});
	map.on('overlayremove', function(e) {
		if (e.layer !== drawnItems)
			return;
		map.removeControl(toolbar);
	});

	// Feature drawn
	map.on(L.Draw.Event.CREATED, function(event) {
		var layer = event.layer;
		drawnItems.addLayer(layer);
		layer.on('click', function(event) {
			new LeafletToolbar.EditToolbar.Popup(event.latlng, {
				actions: map.editActions,
			}).addTo(map, layer);
		});
	});
}

