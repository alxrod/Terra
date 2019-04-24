class ResourceBar {
	constructor(x, y, src, row, col) {
		this.image = new Image();
		this.origSrc = src;
		this.image.src = src;
		this.x = x
		this.y = y
		this.width = 24;
		this.height = 24;
		this.curValue = 0

	}
}