var functions = {
	convertToLayer(number) {
		let letters = "abcdefghijklmnopqrstuvwxyz";
		if (number.gte("10^^5")) {
			return "<[" + this.convertToLayer(number.slog().floor().sub(1)) + "]>:" + this.convertToLayer(new Decimal(10).pow(new Decimal(10).pow(number.slog().sub(number.slog().floor()))));
		} else if (number.gte("ee10")) {
			return "<sub>{" + this.convertToLayer(number.mul(26).add(1).log(27).floor().sub(1)) + "}</sub>◇";
		} else if (number.gte(new Decimal("27").pow(10).mul(26).add(1))) {
			return "<sub>{" + this.convertToLayer(number.mul(26).add(1).log(27).floor().sub(1)) + "}</sub>" + this.convertToLayer(new Decimal(27).pow(number.mul(26).add(1).log(27).sub(number.mul(26).add(1).log(27).floor())).mul(26).mul(26).add(1));
		} else if (number.gte(27)) {
			return this.convertToLayer(number.sub(1).div(26).floor()) + this.convertToLayer(number.sub(1).sub(number.sub(1).div(26).floor().mul(26)).add(1));
		} else {
			return letters[number.sub(1).floor()];
		}
	},
	getSaveCode() {
		return btoa(unescape(encodeURIComponent(JSON.stringify(data))))
	},
	save() {
		localStorage.setItem("EternalAlphabetLayersSave",functions.getSaveCode());
	},
	load() {
		function loadValue(value,alternate) {
			console.log((value !== undefined) ? value : alternate)
			return (value  !== undefined) ? value : alternate;
		};
		let item = localStorage.getItem("EternalAlphabetLayersSave");
		if (item != null) {
			let object;
			try {
				object = JSON.parse(decodeURIComponent(escape(atob(item))))
			} catch (e) {
				alert("Error loading game.\nReason: " + e);
				return;
			};
			data.number = loadValue(data.number, new Decimal("1"));
			data.layer = loadValue(data.layer, new Decimal("1"));
			data.totalA = loadValue(data.totalA, new Decimal("1"));
			data.eternities = loadValue(data.eternities, new Decimal("0"));
			data.tetration = loadValue(data.tetration, 0);
			data.layerHTML = loadValue(data.layerHTML, "Couldn't load.");
		};
	},
	update() {
		data.tetration = data.tetration || 0;
		data.tetration += ((data.tetration >= 1) ? .0001 : .001) * data.eternities.add(1).sqrt();
		data.tetration *= 1 + (.0002 * Math.log10(data.tetration) * data.eternities.add(1).sqrt());
		if (data.tetration == Infinity) {
			data.eternities = data.eternities.add(1);
			data.tetration = 0;
		}
		data.totalA = new Decimal("10").tetrate(data.tetration || 0);
		data.number = data.totalA.gte(1e10)
			? new Decimal("1e10").pow(data.totalA.pow(new Decimal(1).divide(new Decimal(10).pow(data.layer.sub(1)))).mul(new Decimal(1e10).pow(new Decimal(10).pow(data.layer.sub(1)).sub(1).divide(new Decimal(10).pow(data.layer.sub(1)))))
						  .log(1e10).sub(data.totalA.pow(new Decimal(1).divide(new Decimal(10).pow(data.layer.sub(1)))).mul(new Decimal(1e10).pow(new Decimal(10).pow(data.layer.sub(1)).sub(1).divide(new Decimal(10).pow(data.layer.sub(1)))))
								 .log(1e10).floor()))
			: new Decimal("1e10").pow(data.totalA.log(1e10).sub(data.totalA.log(1e10).floor()));
		data.layer = data.totalA.gte(1e10) ? data.totalA.log(1e10).log10().floor().add(2) : data.totalA.log(1e10).floor().add(1);
		document.getElementById("layers").innerHTML = data.layerHTML = data.layer.gte("10^^10") ? `<span style="color: hsl(${data.layer.slog().log10().mul(360)} 100 ${50+(Math.sin(data.layer.slog().log10())*15)+15}); text-shadow: currentcolor 0 0 0.5em;">${functions.convertToLayer(data.layer)}</span>` : 
				data.layer.gte("ee10") ? `<span style="color: hsl(${data.layer.slog().mul(360)} 100 ${55+(Math.sin(data.layer.slog())*10)+10}); text-shadow: currentcolor 0 0 0.5em;">${functions.convertToLayer(data.layer)}</span>` : 
				data.layer.gte("1e6") ? `<span style="color: hsl(${data.layer.log10().log10().mul(180)} 100 ${60+(Math.sin(data.layer.log10().log10())*5)+5}); text-shadow: currentcolor 0 0 0.5em;">${functions.convertToLayer(data.layer)}</span>` : 
				`${fullFormat({num: data.number})}<span style="color: hsl(${data.layer.log10().mul(180)} ${data.layer.gte("10") ? 100 : data.layer.mul(10)} 75); text-shadow: currentcolor 0 0 ${data.layer.gte("100") ? 0.5 : data.layer.sqrt().div(20)}em;">${functions.convertToLayer(data.layer)}</span>`;
		document.getElementById("totalA").innerHTML = data.layer.gte("2") ? `That is also ${fullFormat({num: data.totalA})}<span style="color: hsl(0 10 75);">a</span>` : "";
		document.getElementById("currentLayer").innerHTML = `You're currently in Layer ${fullFormat({num: data.layer, precision: 0})}`;
		document.getElementById("eternities").innerHTML = `You have <span style="font-weight: 700;">${fullFormat({num: data.eternities, precision: 0})}</span> eternities.`;
		requestAnimationFrame(functions.update)
	}
};
