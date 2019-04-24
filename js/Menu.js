
class Menu {
	constructor(x, y) {
		this.image = new Image();
		this.origSrc =  "./images/png/menu.png"
		this.image.src = "./images/png/menu.png";
		this.x = x;
		this.y = y;
		this.height=128;
		this.width = 64;
		this.options = [];
		this.poly = [ [x, y], [x+64, y], [x+64, y+128], [x, y+128] ]
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

	update(mousePoint, mouseClick) {
		if (mouseClick) {
			var wasClicked = this.checkCollision(mousePoint);
			if (wasClicked) {
				return true
			} else {
				return false
			}
		} else {
			return true
		}
		
	}
}