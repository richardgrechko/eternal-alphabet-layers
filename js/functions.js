var functions = {
	convertToLayer(number,mode="Normal") {
		let layers = {
			letters: "abcdefghijklmnopqrstuvwxyz",
			infinity: {
				default: "Pts..∞..∑..Real..Aff..Cel".split(".."),
				tier1: "Sup-..Hyp-..Ult-..Abs-..Meta-".split(".."),
			},
		};
		switch (mode) {
			case "Normal":
				if (number.gte("10^^1e308")) {
					return "<[Ω]>";
				} else if (number.gte("10^^5")) {
					return "<[" + this.convertToLayer(number.slog().floor().sub(1)) + "]>:" + this.convertToLayer(new Decimal(10).pow(new Decimal(10).pow(number.slog().sub(number.slog().floor()))));
				} else if (number.gte("ee10")) {
					return "<sub>{" + this.convertToLayer(number.mul(26).add(1).log(27).floor().sub(1)) + "}</sub>◇";
				} else if (number.gte(5646683826135)) {
					return "<sub>{" + this.convertToLayer(number.mul(26).add(1).log(27).floor().sub(1)) + "}</sub>" + this.convertToLayer(new Decimal(27).pow(number.mul(26).add(1).log(27).sub(number.mul(26).add(1).log(27).floor())).mul(26).add(1).mul(26).add(1));
				} else if (number.gte(27)) {
					return this.convertToLayer(number.sub(1).div(26).floor()) + this.convertToLayer(number.sub(1).sub(number.sub(1).div(26).floor().mul(26)).add(1));
				} else {
					return layers.letters[number.sub(1).floor()];
				};
			case "Infinity":
				if (number.gte("10^^1e308")) {
					return "Ω<sup>◇[Ω]◇</sup>";
				} else if (number.gte("10^^10")) {
					return this.convertToLayer(new Decimal(10).pow(new Decimal(10).pow(number.slog().sub(number.slog().floor()))),"Infinity") + "<sup>◇[" + this.convertToLayer(number.slog().floor().sub(1),"Infinity") + "]◇</sup>";
				} else if (number.gte(new Decimal(5).pow(9765625))) {
					return "<sub>[" + this.convertToLayer(number.sub(2).log(3125).floor(),"Infinity") + "]</sub>◇";
				} else if (number.gte(9765627)) {
					return "<sub>[" + this.convertToLayer(number.sub(2).log(3125).floor(),"Infinity") + "]</sub>" + this.convertToLayer(number.sub(2).mul(3125).div(new Decimal(3125).pow(number.sub(2).log(3125).floor())).floor(),"Infinity");
				} else if (number.gte(3127)) {
					return this.convertToLayer(number.sub(1).div(3125).add(1).floor(),"Infinity") + ">" + this.convertToLayer(number.sub(2).sub(number.sub(2).div(3125).floor().mul(3125)).add(2),"Infinity");
				} else if (number.gte(27)) {
					return "Lvl<sup>" + this.convertToLayer(number.sub(2).div(5).floor(),"Infinity") + "</sup>-" + this.convertToLayer(number.sub(2).sub(number.sub(2).div(5).floor().mul(5)).add(2),"Infinity");
				} else if (number.gte(7)) {
					return layers.infinity.tier1[number.sub(2).div(5).floor()] + this.convertToLayer(number.sub(2).sub(number.sub(2).div(5).floor().mul(5)).add(2),"Infinity");
				} else {
					return layers.infinity.default[number.sub(1).floor()];
				};
			default:
				return this.convertToLayer(number,"Normal");
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
		data.tetration *= 1 + (.0001 * Math.log10(data.tetration) * data.eternities.add(1).sqrt());
		if (data.tetration == Infinity) {
			data.eternities = data.eternities.add(1);
			data.tetration = 0;
		}
		data.mode = document.getElementById("layerModeOption").value;
		data.totalA = new Decimal("10").tetrate(data.tetration || 0);
		data.number = data.totalA.gte(Number.MAX_VALUE)
			? new Decimal(Number.MAX_VALUE).pow(data.totalA.log(Number.MAX_VALUE).log10().pow(0.75).sub(data.totalA.log(Number.MAX_VALUE).log10().pow(0.75).floor()).pow(3))
			: data.totalA;
		data.layer = data.totalA.gte(Number.MAX_VALUE) ? data.totalA.log(Number.MAX_VALUE).log10().pow(0.75).floor().add(1) : data.totalA.log(Number.MAX_VALUE).floor().add(1);
		document.getElementById("layers").innerHTML = data.layerHTML = data.layer.gte("10^^10") ? `<span style="color: hsl(${data.layer.slog().log10().mul(180)} 100 ${50+(Math.sin(data.layer.slog().log10())*15)+15}); text-shadow: currentcolor 0 0 0.6em, currentcolor 0 0 0.4em, currentcolor 0 0 0.2em;">${functions.convertToLayer(data.layer,data.mode)}</span>` : 
				data.layer.gte("ee10") ? `<span style="color: hsl(${data.layer.slog().mul(180)} 100 ${55+(Math.sin(data.layer.slog())*10)+10}); text-shadow: currentcolor 0 0 0.6em, currentcolor 0 0 0.4em, currentcolor 0 0 0.2em;">${functions.convertToLayer(data.layer,data.mode)}</span>` : 
				data.layer.gte("1e6") ? `<span style="color: hsl(${data.layer.log10().log10().mul(180)} 100 ${60+(Math.sin(data.layer.log10().log10())*5)+5}); text-shadow: currentcolor 0 0 0.6em, currentcolor 0 0 0.4em, currentcolor 0 0 0.2em;">${functions.convertToLayer(data.layer,data.mode)}</span>` : 
				`${fullFormat({num: data.number})}<span style="color: hsl(${data.layer.log10().mul(180)} ${data.layer.gte("10") ? 100 : data.layer.mul(10)} 75); text-shadow: currentcolor 0 0 ${data.layer.gte("100") ? 0.6 : data.layer.sqrt().div(20).mul(1.2)}em, currentcolor 0 0 ${data.layer.gte("100") ? 0.4 : data.layer.sqrt().div(20).mul(0.8)}em, currentcolor 0 0 ${data.layer.gte("100") ? 0.2 : data.layer.sqrt().div(20).mul(0.4)}em;">${functions.convertToLayer(data.layer,data.mode)}</span>`;
		document.getElementById("totalA").innerHTML = data.layer.gte("2") ? `That is also ${fullFormat({num: data.totalA})}<span style="color: hsl(0 10 75);">a</span>` : "";
		document.getElementById("currentLayer").innerHTML = `You're currently in Layer ${fullFormat({num: data.layer, precision: 0})}`;
		document.getElementById("eternities").innerHTML = `You have <span style="font-weight: 700;">${fullFormat({num: data.eternities, precision: 0})}</span> eternities.`;
		requestAnimationFrame(functions.update)
	}
};
