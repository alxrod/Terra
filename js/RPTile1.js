class RPTile1 extends Tile {
	constructor(x, y, row, col) {
		super(x, y, "./images/png/red_planet_tile.png", row, col);
	}

	groundSelected() {
		this.image.src = "./images/png/red_planent_tile_yes.png"
	}
}