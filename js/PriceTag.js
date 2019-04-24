class PriceTag {
	constructor(x, y, value, type) {
		this.image = new Image();
		this.origSrc = "./images/png/" + type + ".png";
		this.image.src = "./images/png/xs/" + type + ".png";
		this.type = type;
		this.value = value;
		this.numbVal = new Number(this.value);
		this.x = x
		this.y = y
	}

	display(ctx) {
		ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
		this.numbVal.displayValue(ctx, this.x+12, this.y);
	} 
}