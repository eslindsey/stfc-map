//  // Legend
//  var legend = L.control({position: 'bottomleft'});
//  import('./legend.js').then(module => {
//  	module.init(legend);
//  	legend.addTo(map);
//  });

export function init(legend) {
	legend.onAdd = function(map) {
		this._div = L.DomUtil.create('div', 'legend');
		this.update();
		return this._div;
	};

	legend.update = function(props) {
		this._div.innerHTML = `
			<h4>Data</h4>
			<p>No data to show.</p>
		`.trim();
	};
}

