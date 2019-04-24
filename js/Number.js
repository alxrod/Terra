class Number {
	constructor(value, scale) {
		if (scale == undefined) {
			this.scale = 1;
		} else {
			this.scale = scale;
		}
		this.image = new Image();
		this.origSrc = "./images/png/numbers.png"
		this.image.src = "./images/png/numbers.png";
		this.width = 6
		this.height = 8
		
		var stringVal = value.toString()
		this.digits = stringVal.split('');

	}

	displayValue(ctx, x, y) {
		var curX = x;
		var curY = y;
		for (var d = 0; d < this.digits.length; d++) {
			ctx.drawImage(this.image, this.digits[d]*6, 0, this.width, this.height, curX, curY, this.width*this.scale, this.height*this.scale);
			curX += 18
		}
		

	}
}
