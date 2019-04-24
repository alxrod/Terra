
class Building {
	constructor(x, y, src) {
		this.image = new Image();
		this.origSrc = src;
		this.image.src = src;
		this.x = x;
		this.y = y;
		this.width = 64;
		this.height = 128;

		this.tileIndex;
		this.openMenu = false;
		this.options = []

		this.oreCount = 0;
	}

	assignTile(tile) {
		this.tileIndex = tile.index;
		this.x = tile.x;
		this.y = tile.y-96;
	}

	update(tiles, selectHistory, userClicked) {

		var curTile = tiles[this.tileIndex[0]][this.tileIndex[1]]

		if (selectHistory[1] == curTile) {
			this.openMenu=true;
		} else if (userClicked) {
			this.openMenu=false;
		}
	}

	returnType() {
		return "Building"
	}
}