var functions = {
	convertToLayer(number,mode="Normal") {
		let layers = {
			letters: "abcdefghijklmnopqrstuvwxyz",
			infinity: {
				default: "Pts..∞..∑..▾..ϱ..Ϗ..₣..Cr..Id..Vt..Im..Atr..Is..Sv..Fat..Ins..Unf..Cal..Fut..Fin..Uni".split(".."),
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
				} else if (number.gte(Decimal.sumGeometricSeries(9,1,26,1).add(1))) {
					return "<sub>{" + this.convertToLayer(number.mul(26).add(1).log(27).floor().sub(1)) + "}</sub>" + this.convertToLayer(new Decimal(27).pow(number.mul(26).add(1).log(27).sub(number.mul(26).add(1).log(27).floor())).mul(26).add(1).mul(26).add(1));
				} else if (number.gte(27)) {
					return this.convertToLayer(number.sub(1).div(26).floor()) + this.convertToLayer(number.sub(1).sub(number.sub(1).div(26).floor().mul(26)).add(1));
				} else {
					return layers.letters[number.sub(1).floor()];
				};
			case "Infinity":
				if (number.gte("10^^1e308")) {
					return "◇<sup>◇[Ω]◇</sup>";
				} else if (number.gte("10^^5")) {
					return this.convertToLayer(new Decimal(10).pow(new Decimal(10).pow(number.slog().sub(number.slog().floor()))),"Infinity") + "<sup>◇[" + this.convertToLayer(number.slog().floor().sub(1),"Infinity") + "]◇</sup>";
				} else if (number.gte(new Decimal(20).pow(160000))) {
					return "α<sub>[" + this.convertToLayer(number.sub(2).log(20).floor(),"Infinity") + "]</sub>◇";
				} else if (number.gte(160002)) {
					return "α<sub>[" + this.convertToLayer(number.sub(2).log(20).floor(),"Infinity") + "]</sub>" + this.convertToLayer(number.sub(2).div(new Decimal(20).pow(number.sub(2).log(20).sub(1).floor())).add(2),"Infinity");
				} else if (number.gte(102)) {
					return this.convertToLayer(number.sub(2).div(20).floor(),"Infinity") + "→" + this.convertToLayer(number.sub(2).sub(number.sub(2).div(20).floor().mul(20)).add(2),"Infinity");
				} else if (number.gte(22)) {
					return layers.infinity.tier1[number.sub(2).div(20).floor()] + this.convertToLayer(number.sub(2).sub(number.sub(2).div(20).floor().mul(20)).add(2),"Infinity");
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
			data.number = loadValue(new Decimal(object.number), new Decimal("1"));
			data.layer = loadValue(new Decimal(object.layer), new Decimal("1"));
			data.totalA = loadValue(new Decimal(object.totalA), new Decimal("1"));
			data.eternities = loadValue(new Decimal(object.eternities), new Decimal("0"));
			data.tetration = loadValue(object.tetration, 0);
			data.layerHTML = loadValue(object.layerHTML, "Couldn't load.");
		};
	},
	hardReset() {
		let a = prompt("Are you sure?").toLowerCase();
		if (a == "yes" || a == "y") {
			let b = prompt("Are you really sure? You will lose your progress.").toLowerCase();
			if (b == "yes" || b == "y") {
				data.number = new Decimal("1");
				data.layer = new Decimal("1");
				data.totalA = new Decimal("1");
				data.eternities = new Decimal("0");
				data.tetration = 0;
				data.layerHTML = "Loading";
			};
		};
	},
	switchTab(tab) {
		if (!document.getElementById("tab--"+tab)) {
			return;
		}
		for (let i of document.getElementsByTagName("div")) {
			if (i.startsWith("tab--")) {
				i.style.display = "none"
			}
		}
		document.getElementById("tab--"+tab).style.display = "inline"
	},
	update() {
		data.tetration = data.tetration || 0;
		data.tetration += ((data.tetration >= 1) ? .0001/(data.tetration**2) : .0005) * data.eternities.add(1).sqrt();
		data.tetration *= (data.tetration >= 1) ? 1 + (.00005 * Math.log10(data.tetration) * data.eternities.add(1).pow(2)) : 1;
		if (data.tetration == Infinity) {
			data.eternities = data.eternities.add(1);
			data.tetration = 0;
		}
		data.mode = document.getElementById("layerModeOption").value;
		data.totalA = new Decimal("10").tetrate(data.tetration || 0);
		let layerFormula = data.totalA.log(Number.MAX_VALUE).log(2).add(1).root(2).sub(1).div(1.5).pow(2).add(1).root(data.totalA.slog().div(new Decimal(Number.MAX_VALUE).slog()).max(1).log(2).add(1).mul(1.5))
		let html = document.getElementsByTagName("html")[0]
		data.number = data.totalA.gte(Number.MAX_VALUE)
			? new Decimal(Number.MAX_VALUE).pow(layerFormula.sub(layerFormula.floor()))
			: data.totalA;
		data.layer = data.totalA.gte(Number.MAX_VALUE) ? layerFormula.floor().add(1) : data.totalA.log(Number.MAX_VALUE).floor().add(1);
		document.getElementById("layers").innerHTML = data.layerHTML = data.layer.gte("10^^10") ? `<span style="color: hsl(${data.layer.slog().log10().mul(180)} 100 ${50+(Math.sin(data.layer.slog().log10())*15)+15}); text-shadow: currentcolor 0 0 0.6em, currentcolor 0 0 0.4em, currentcolor 0 0 0.2em;">${functions.convertToLayer(data.layer,data.mode)}</span>` : 
				data.layer.gte("ee10") ? `<span style="color: hsl(${data.layer.slog().mul(180)} 100 ${55+(Math.sin(data.layer.slog())*10)+10}); text-shadow: currentcolor 0 0 0.6em, currentcolor 0 0 0.4em, currentcolor 0 0 0.2em;">${functions.convertToLayer(data.layer,data.mode)}</span>` : 
				data.layer.gte("1e6") ? `<span style="color: hsl(${data.layer.log10().log10().mul(180)} 100 ${60+(Math.sin(data.layer.log10().log10())*5)+5}); text-shadow: currentcolor 0 0 0.6em, currentcolor 0 0 0.4em, currentcolor 0 0 0.2em;">${functions.convertToLayer(data.layer,data.mode)}</span>` : 
				`${fullFormat({num: data.number})}<span style="color: hsl(${data.layer.log10().mul(120)} ${data.layer.gte("10") ? 100 : data.layer.mul(10)} 75); text-shadow: currentcolor 0 0 ${data.layer.gte("100") ? 0.6 : data.layer.sqrt().div(20).mul(1.2)}em, currentcolor 0 0 ${data.layer.gte("100") ? 0.4 : data.layer.sqrt().div(20).mul(0.8)}em, currentcolor 0 0 ${data.layer.gte("100") ? 0.2 : data.layer.sqrt().div(20).mul(0.4)}em;">${functions.convertToLayer(data.layer,data.mode)}</span>`;
		document.getElementsByClassName("layer-background")[0].style.background = data.layer.gte("10^^10") ? `linear-gradient(to bottom, hsl(${data.layer.slog().log10().mul(180)} 100 ${(50+(Math.sin(data.layer.slog().log10())*15)+15)/4}), #000)` : 
				data.layer.gte("ee10") ? `linear-gradient(to bottom, hsl(${data.layer.slog().mul(180)} 100 ${(55+(Math.sin(data.layer.slog())*10)+10)/4}), #000)` : 
				data.layer.gte("1e6") ? `linear-gradient(to bottom, hsl(${data.layer.log10().log10().mul(180)} 100 ${(60+(Math.sin(data.layer.log10().log10())*5)+5)/4}), #000)` : 
				`linear-gradient(to bottom, hsl(${data.layer.log10().mul(120)} ${data.layer.gte("10") ? 100 : data.layer.mul(10)} 18), #000)`;
		document.getElementById("totalA").innerHTML = data.layer.gte("2") ? `That is also ${fullFormat({num: data.totalA})}<span style="color: hsl(0 10 75);">a</span>` : "";
		document.getElementById("currentLayer").innerHTML = `You're currently in Layer ${fullFormat({num: data.layer, precision: 0})}`;
		document.getElementById("eternities").innerHTML = `You have <span style="font-weight: 700;">${fullFormat({num: data.eternities, precision: 0})}</span> eternities.`;
		requestAnimationFrame(functions.update)
	}
};
