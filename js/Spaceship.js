class Spaceship extends Building {
	constructor(x, y) {
		super(x, y, "./images/png/starter_spaceship.png");
		this.options = ["hire"]
	}

	returnRandomDoc(tiles) {
		var x = tiles[this.tileIndex[0]][this.tileIndex[1]].x
		var y = tiles[this.tileIndex[0]][this.tileIndex[1]].y
		
		var options = [[x-32,y+16], [x+32,y-16], [x+32,y+16], [x-32,y-16]]
		var tileChoice = []

		for (var row=0; row < tiles.length; row++) {
			for (var col=0; col < tiles[row].length; col++) {
				for (var o = 0; o<options.length; o++) {
					if (tiles[row][col].x == options[o][0] && tiles[row][col].y == options[o][1]) {
						tileChoice.push(tiles[row][col])
					}
				}
			}
		}
	
		return tileChoice[Math.round(Math.random()*3)]
	}


}