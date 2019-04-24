var cursorX = 0;
var cursorY = 0;
var userClicked = false;

document.onmousemove = function(e){
	cursorX = e.pageX-5;
	cursorY = e.pageY-5;
}

function mouseDown(event) {
	userClicked = true;
}

function mouseUp(event) {
}


function startGame() {
	var game = new Game(true)

	// Game Loop:
	var FPS = 30;
	setInterval(function() {
			game.update();
			game.draw();
	}, 1000/FPS)
  
}

class Game {

	constructor(gameStarted) {
		this.canvas = document.createElement("canvas");
		this.ctx = this.canvas.getContext("2d");

		this.lastClick = new Date().getTime() / 1000;

		var dimension = [document.documentElement.clientWidth, document.documentElement.clientHeight];
		this.canvas.width = dimension[0];
		this.canvas.height = dimension[1];
		this.canvas.addEventListener("mousedown", mouseDown, false);
		this.canvas.addEventListener("mouseup", mouseUp, false);
		document.body.appendChild(this.canvas);

		this.bars = []

		this.oreBar = new ResourceBar(document.documentElement.clientWidth-120, document.documentElement.clientHeight-48, "./images/png/martian_ore.png")
		this.bars.push(this.oreBar)

		this.entities = [];
		this.astronauts = [];
		this.buildings = [];
		this.desiredBoardSize = 101;
		this.tiles = []

		this.selectedTile;
		this.prevSelectTile;
		this.curMenu;
		this.curMenuOwner
		this.curOptions = []
		
		var currentArLen = 1;
		var directionGrow = true;

		var offset = -256;

		var row;
		for (row=0; row < this.desiredBoardSize; row++) {
			var colAr = []

			var y = offset + 16 * row
			var startingX = (this.canvas.width/2-32)-(32*(currentArLen-1))

			var col;
			for (col=0; col< currentArLen; col++) {
				var exTile = new RPTile1(startingX+64*col, y, row, col);
				colAr.push(exTile);
			}

			if (currentArLen == (this.desiredBoardSize+1)/2) {
				directionGrow = false;
			}
			if (currentArLen == 0) {
				break;
			}
			if (directionGrow == true) {
				currentArLen += 1;
			} else {
				currentArLen -= 1;
			}
			this.tiles.push(colAr)

		}


		this.spaceship = new Spaceship(0,0);
		this.spaceship.assignTile(this.tiles[44][22]);
		this.buildings.push(this.spaceship);

	}
	update() {
		for (var row=0; row < this.tiles.length; row++) {
			for (var col=0; col < this.tiles[row].length; col++) {

				var didCollide = this.tiles[row][col].checkCollision([cursorX,cursorY])
				if (didCollide) {
					this.tiles[row][col].groundSelected();
					if(userClicked) {
						if (this.curMenu == undefined) {
							this.prevSelectTile = this.selectedTile
							this.selectedTile = this.tiles[row][col];
						}
						this.lastClick = new Date().getTime() / 1000;
					}

					// Debugging Setting:
					// console.log(this.tiles[row][col]);
				} else {
					this.tiles[row][col].revert();
				}

				// console.log(this.astronauts.length);
				for (var a = 0; a < this.astronauts.length; a++) {
					var exAstro = this.astronauts[a];
					var didCollide = this.tiles[row][col].checkCollision([exAstro.footX, exAstro.footY])
					// console.log("sdas?")
					if (didCollide) {
						exAstro.tileIndex = [row,col];

						// Debugging tool:
						// this.tiles[row][col].groundSelected();
					}
				}
			}
		}

		if (Math.abs(this.lastClick-new Date().getTime() / 1000) > 1) {
			this.selectedTile = undefined;
			this.prevSelectTile = undefined;
		}
		if (this.curMenu) {
			this.selectedTile = undefined;
			this.prevSelectTile = undefined;
		}

		// console.log(this.prevSelectTile, this.selectedTile);
		for(var a = 0; a<this.astronauts.length; a++) {
			this.astronauts[a].update(this.tiles, [this.prevSelectTile, this.selectedTile]);
			if (this.astronauts[a].openMenu == true && this.curOptions.length == 0) {


				// The 64 is non ideally hardcoded
				this.curMenu = new Menu(this.astronauts[a].x+this.astronauts[a].width, this.astronauts[a].y-(64)+(this.astronauts[a].height*3/4));
				this.curMenuOwner = this.astronauts[a]

				// If you switch menus directly:
				this.curOptions = []

				var x = this.curMenu.x + 16;
				var y = this.curMenu.y;
				for (var o = 0; o<this.astronauts[a].options.length; o++) {		
					y+=12;
					var src =  "./images/png/options/" + this.astronauts[a].options[o] + ".png";
					var newOp = new Option(x, y, src, this.astronauts[a].options[o]);
					this.curOptions.push(newOp);
				}
			}
		}


		var someMenuExists = false
		for(var b = 0; b<this.buildings.length; b++) {
			this.buildings[b].update(this.tiles, [this.prevSelectTile, this.selectedTile], userClicked);


			if (this.buildings[b].openMenu == true && this.curOptions.length == 0) {
				this.curMenu = new Menu(this.buildings[b].x+this.buildings[b].width, this.buildings[b].y);
				someMenuExists = true

				this.curMenuOwner = this.buildings[b]

				var x = this.buildings[b].x+this.buildings[b].width + 16;
				var y = this.buildings[b].y;
				for (var o = 0; o<this.buildings[b].options.length; o++) {		
					y+=12;
					var src =  "./images/png/options/" + this.buildings[b].options[o] + ".png";
					var newOp = new Option(x, y, src, this.buildings[b].options[o]);
					this.curOptions.push(newOp);
				}
				 
			}

			this.oreBar.curValue += this.buildings[b].oreCount
		}




		if (this.curMenu != undefined) {
			if (this.curMenu.update([cursorX,cursorY], userClicked) == false) {
				this.curMenu = undefined;
				this.curOptions = [];
			}
		}



		for (var o =0 ; o<this.curOptions.length; o++) {
			var resp = this.curOptions[o].update([cursorX, cursorY], userClicked, this.curMenuOwner, this.tiles
				);
			if (resp != undefined) {
				// console.log(resp)
				

				if (resp == "harvest") {
					this.curMenuOwner.startMender = true;
				} else if (resp == "move") {
					this.curMenuOwner.needToAcceptDestin = true;
				} else if (resp.returnType() == "Astronaut") {
					this.astronauts.push(resp);
					resp.assignTile(resp.docBase);
				}
				this.curMenu = undefined;
				this.curOptions = [];

			} 
		}
		

		// Debugging tool:
		// this.tiles[6][0].groundSelected();

		// This has to be last:
		userClicked = false;
	}

	draw() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		for (var row=0; row < this.tiles.length; row++) {
			for (var col=0; col < this.tiles[row].length; col++) {
				this.ctx.drawImage(this.tiles[row][col].image, this.tiles[row][col].x, this.tiles[row][col].y);
			}
		}
			
		

		for(var a = 0; a<this.astronauts.length; a++) {
			this.ctx.drawImage(this.astronauts[a].image, this.astronauts[a].movements[this.astronauts[a].movementType][this.astronauts[a].frame], 0, this.astronauts[a].width, this.astronauts[a].height, this.astronauts[a].x, this.astronauts[a].y, this.astronauts[a].width, this.astronauts[a].height);
		}
		

		for(var b = 0; b<this.buildings.length; b++) {
			this.ctx.drawImage(this.buildings[b].image, this.buildings[b].x, this.buildings[b].y);

		}

		if (this.curMenu != undefined) {
			this.ctx.drawImage(this.curMenu.image, this.curMenu.x, this.curMenu.y);
			for (var o = 0; o < this.curOptions.length; o++) {
				this.ctx.drawImage(this.curOptions[o].image, this.curOptions[o].x, this.curOptions[o].y);
				if (this.curOptions[o].priceTag != undefined) {
					console.log("yup?")
					this.curOptions[o].priceTag.display(thsctx);
				}
			}
		}


		var boxWidth = 128;
		var boxHeight = 48 * this.bars.length
		this.ctx.fillStyle="#4B2E12";
		this.ctx.fillRect(document.documentElement.clientWidth-boxWidth, document.documentElement.clientHeight-boxHeight, boxWidth, boxHeight);


		for (var b = 0; b<this.bars.length; b++) {
			this.ctx.drawImage(this.bars[b].image, this.bars[b].x, this.bars[b].y, this.bars[b].width, this.bars[b].height);
			var numberEx = new Number(this.bars[b].curValue);
			numberEx.displayValue(this.ctx, this.bars[b].x + 24, this.bars[b].y+4);
		}

		this.oreBar.curValue = 0;


	
	}

}
