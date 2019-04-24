class Tile {
	constructor(x, y, src, row, col) {
		this.image = new Image();
		this.origSrc = src;
		this.image.src = src;
		this.x = x
		this.y = y
		this.poly  = [[x,y+16], [x+32,y], [x+64, y+16], [x+32,y+32]]
		this.index = [row, col]
		this.haveSomethingOntop = false

	}

	checkCollision(point) {
	    var x = point[0], y = point[1];

	    var inside = false;
	    for (var i = 0, j = this.poly.length - 1; i < this.poly.length; j = i++) {
	        var xi = this.poly[i][0], yi = this.poly[i][1];
	        var xj = this.poly[j][0], yj = this.poly[j][1];

	        var intersect = ((yi > y) != (yj > y))
	            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
	        if (intersect) inside = !inside;
	    }

	    return inside;
	}

	revert() {
		this.image.src = this.origSrc;
	}
}