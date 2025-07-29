const functions = {
	getSaveCode() {
		return btoa(unescape(encodeURIComponent(JSON.stringify(data))))
	},
	save() {
		localStorage.setItem("EternalAlphabetLayersSave",this.getSaveCode());
	},
	load() {
		function loadValue(value,alternate) {
			return value || alternate;
		};
		let item = importString !== undefined ? importString : localStorage.getItem("EternalAlphabetLayersSave");
		if (item != null) {
			let object;
			try {
				object = JSON.parse(decodeURIComponent(escape(atob(item))))
			} catch (e) {
				alert("Error loading game.\nReason: " + e);
				return;
			};
		};
	},
	update() {
		
		requestAnimationFrame(functions.update)
	}
};
