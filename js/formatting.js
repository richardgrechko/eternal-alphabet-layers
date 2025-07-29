function commaFormat(num) {
	let portions = num.split(".")
	portions[0] = portions[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
	if (portions.length == 1)
		return portions[0]
	return portions[0] + "." + portions[1]
}
function fullFormat(options) {
	options = {
		num: options.num || new Decimal("1"),
		precision: options.precision || 3,
	}
	if (options.num.gte("10^^10")) {
		return fullFormat({num: new Decimal(10).pow(options.num.slog().sub(options.num.slog().floor())), precision: options.precision}) + "F" + options.num.slog().floor();
	} else if (options.num.gte("ee10")) {
		return "e" + fullFormat({num: options.num.log10(), precision: options.precision});
	} else if (options.num.gte("e10")) {
		return fullFormat({num: new Decimal(10).pow(options.num.log10().sub(options.num.log10().floor())), precision: options.precision}) + "e" + options.num.log10().floor();
	} else if (options.num.gte("1000000")) {
		return commaFormat(options.num.floor().toString());
	} else if (options.num.gte("1000")) {
		return commaFormat(Number(options.num).toFixed(options.precision));
	} else if (options.num.gte("0")) {
		return Number(options.num).toFixed(options.precision);
	};
}
