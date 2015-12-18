define(['tripledollar', 'key-value-pointer'], function ($$$, kvp) {

	// read-n-place v0.1.0

	function readData (elem, model) {
		var data = kvp({});
		Object.keys(model).forEach(function (id) {
			var d = elem.query('#' + id),
				p,
				c;
			if (d) {
				if ('checkbox' === d.type) {
					data.insert(model[id].pointer, d.checked);
				} else if (model[id].type === Array) {
					if (model[id].model) {
						c = d.children;
						for (var i = 0; i < d.children.length; i++) {
							p = model[id].pointer + '/' + i;
							data.insert(p, readData(c.item(i), model[id].model));
						}
					} else {
						var val,
							list,
							subtype = model[id].subtype || String,
							divider = /[\n\t;]/;
						if (typeof d.value !== 'undefined') {
							val = d.value;
						} else {
							val = d.textContent;
						}
						list = val.split(divider);
						data.insert(model[id].pointer, list);
					}
				} else if (model[id].type === Object) {
					if (model[id].model) {
						p = model[id].pointer;
						data.insert(p, readData(d, model[id].model));
					}
				} else {
					data.insert(model[id].pointer, model[id].type(d.value));
				}
				
			}
		})
		return data.getObject();
	}

	function placeData (elem, model, data) {
		if (!data || !elem) return;
		var template;
		data = kvp(data);
		Object.keys(model).forEach(function (id) {
			var input = elem.query('#' + id),
				value = data.select(model[id].pointer);
			if (input) {
				if (model[id].type === Array) {
					if (model[id].model) {
						template = $$$.structify(input.firstChild);
						$$$.destroy(input);
						value.forEach(function (v, i) {
							var row = $$$(template);
							input.ins(row);
							placeData(row, model[id].model, v);
						})
					} else { // array with simple types
						value = value.join(', ');	
						if (typeof input.value !== 'undefined') {
							input.value = value;
						} else {
							input.textContent = value;
						}
					}
				} else if (model[id].type === Object) {
					if (model[id].model) {
						placeData(input, model[id].model, value);
					}
				} else if (model[id].type === Boolean) {
					input.checked = Boolean(value);
				} else {
					if (typeof input.value === 'undefined') {
						input.textContent = value;
					} else {
						input.value = model[id].type(value);
					}
				}
			}
		})
	}

	return {
		readData: readData,
		placeData: placeData
	}

})