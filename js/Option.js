
class Option {
	constructor(x, y, src, type) {
		this.image = new Image();
		this.origSrc =  src
		this.image.src = src;
		this.x = x;
		this.y = y;
		this.width = 64;
		this.height = 8;
		this.options = [];
		this.poly = [ [x-8, y], [x+70, y], [x+70, y+8], [x-8, y+8] ]
		this.type = type
		this.priceTag = undefined;

		if (this.type == "hire") {
			console.log("makong it ")
			this.priceTag = new PriceTag(this.x, this.y, 5, "ore");
					
		}

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

	update(mousePoint, mouseClick, menuOwner, tiles) {
		if (mouseClick) {
			var wasClicked = this.checkCollision(mousePoint);
			if (wasClicked) {

				if (this.type == "hire") {
					console.log("makong it ")
					this.priceTag = new PriceTag(this.x, this.y, 5, "ore");
					return new Astronaut(menuOwner, 0,0, menuOwner.returnRandomDoc(tiles));
				}

				if (this.type == "harvest") {

					return "harvest"
				}

				if (this.type == "move") {
					return "move"
				}
			}
		}

		
	}


}