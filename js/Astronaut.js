class Astronaut {
	constructor(owner, x, y, docingTile, src) {
		this.image = new Image();
		
		
		if (src === undefined) {
   			 this.image.src = "./images/png/average_astronaut.png";
   			 this.origSrc = "./images/png/average_astronaut.png";
  		} else {
  			this.image.src = src;
  			this.origSrc = src;
  		}

  		this.width = 16;
  		this.height = 32;
		this.x = x;
		this.y = y;
		this.footY = this.y+this.height;
		this.footX = this.x+this.width+6;


		this.xVel = 0;
		this.yVel = 0;

		this.movements = [
			[0,16,32],
			[48,64,80],
			[96, 112, 128],
			[144, 160, 176],

		]
		this.movementType = 0;
		this.frame = 0
		this.counter = 0

		this.tileIndex = [0,0]
		// 0.25 is a good one for the final version
		this.speed = 0.5;

		this.lastTurn = new Date().getTime() / 1000;

		this.destination = undefined;
		this.needToHault = false;

		this.options = ["harvest","move"]
		this.openMenu = false;


		this.needToAcceptDestin
		this.startMender

		this.closeMenu=true;

		this.isHarvesting = false;
		this.oreCount = 0;
		this.lastEmpty = new Date().getTime() / 1000;
		this.docBase = docingTile

		this.headingHome = false;
		this.owner = owner;

		this.harvestTime = 15

	}

	assignTile(tile) {
		this.tileIndex = tile.index;
		this.x = tile.x+24;
		this.y = tile.y-12;
		this.footY = this.y+this.height;
		this.footX = this.x+this.width+6;
	}

	assignedTileFooting(tile) {
		var x = tile.x+24;
		var y = tile.y-12;
		var footY = y+this.height;
		var footX = x+this.width+6;
		return [footX, footY]
	}

	centeredOnTile(tile) {
		if (this.footX == this.assignedTileFooting(tile)[0] && this.footY == this.assignedTileFooting(tile)[1]) {
			return true
		} else {
			return false
		}
	}

	runDownLeft() {
		this.movementType = 0;
		this.xVel = -2*this.speed;
		this.yVel = 1*this.speed;
		this.lastTurn = new Date().getTime() / 1000;
	}

	runDownRight() {
		this.movementType = 1;
		this.xVel = 2*this.speed;
		this.yVel = 1*this.speed;
		this.lastTurn = new Date().getTime() / 1000;
	}

	runUpLeft() {
		this.movementType = 3;
		this.xVel = -2*this.speed;
		this.yVel = -1*this.speed;
		this.lastTurn = new Date().getTime() / 1000;

	}

	runUpRight() {
		this.movementType = 2;
		this.xVel = 2*this.speed;
		this.yVel = -1*this.speed;
		this.lastTurn = new Date().getTime() / 1000;
	}

	randomTurn() {
		if (this.isHarvesting == true) {
			var amount = Math.round(Math.random() * 5);
			this.oreCount += amount;
		}

		this.closeMenu = true;
		var decision = Math.floor(Math.random()*4);

		// Debugging Feature
		// console.log(decision)

		if (decision == 0) {
			this.runDownLeft()
		} else if (decision == 1) {
			this.runDownRight()
		} else if (decision == 2) {
			this.runUpLeft()
		} else {
			this.runUpRight()
		}
	}

	hault() {
		this.xVel = 0;
		this.yVel = 0;
		this.frame = 0;
	}

	revert() {
		this.image.src = this.origSrc;
	}


	checkIfGoingOffWorld(tiles) {
		var didHit = false


		// YOu have to subtract one cause indexes start at 0 not 1!!!!
		var yCenter = tiles[((tiles.length+1)/2-1)][0].y;
		var curTile = tiles[this.tileIndex[0]][this.tileIndex[1]];

		// console.log(curTile);

		if (this.xVel<0 && tiles[this.tileIndex[0]][this.tileIndex[1]-1] == undefined) {
			
			if (this.yVel>0) {
				if (this.tileIndex[1] == 0 && curTile.y >= yCenter) {
					if (this.centeredOnTile(curTile)) {
						didHit = true
						console.log("No more to the up left");
						this.runUpLeft();
					}	
				}
			} else if (this.yVel<0) {
				if (this.tileIndex[1] == 0 && curTile.y <= yCenter) {
					if (this.centeredOnTile(curTile)) {
						didHit = true
						console.log("No more to the down left");
						this.runUpRight();
					}
				}
			}

		} else if (this.xVel>0) {
			// console.log(this.tileIndex[1], tiles[this.tileIndex[0]].length-1);
			if (this.yVel<0) {
				if (this.tileIndex[1] == tiles[this.tileIndex[0]].length-1 && curTile.y <= yCenter) {
					if (this.centeredOnTile(curTile)) {
						didHit = true
						console.log("No more to the up right");
						this.runDownRight();
					}
				}
			} else if (this.yVel>0) {
				if (this.tileIndex[1] == tiles[this.tileIndex[0]].length-1 && curTile.y >= yCenter) {
					if (this.centeredOnTile(curTile)) {
						didHit = true
						console.log("No more to the down right");
						this.runDownLeft();
					}
				}
			}
		}

		return didHit

	} 


	changeFrame() {
		if (this.xVel != 0 && this.yVel != 0) {
			this.counter++;
			if (this.counter == 12) {
				this.counter=0;
			}
			this.frame = Math.floor(this.counter/4);
		}


	}

	checkDirection(tiles,curTile) {


		// console.log(this.destination)
		var options = [
						// Down Left
						[curTile.x-32,curTile.y+16, true],
						// Up right
						[curTile.x+32,curTile.y-16, true],
						// Down Right
						[curTile.x+32,curTile.y+16, true],
						// Up left
						[curTile.x-32,curTile.y-16, true],
						];

		var yCenter = tiles[((tiles.length+1)/2-1)][0].y;
		if (this.tileIndex[1] == 0 && curTile.y < yCenter) {
			options[3][2] = false;
		} else if (this.tileIndex[1] == 0 && curTile.y > yCenter) {
			options[0][2] = false;
		} else if (this.tileIndex[1] == tiles[this.tileIndex[0]].length-1 && curTile.y < yCenter) {
			options[1][2] = false;
		} else if (this.tileIndex[1] == tiles[this.tileIndex[0]].length-1 && curTile.y > yCenter) {
			options[2][2] = false;
		}

		// console.log(options)

		var curMoveIndex;
		var lowestDistance = Math.sqrt( Math.pow(curTile.x-this.destination.x,2) + Math.pow(curTile.y-this.destination.y,2) );

	
		for (var o = 0; o < options.length; o++) {
			if (options[o][2] == true) {
				var posDistance = Math.sqrt( Math.pow(options[o][0]-this.destination.x,2) + Math.pow(options[o][1]-this.destination.y,2) );
		
				if (posDistance < lowestDistance) {
					curMoveIndex = o;
					lowestDistance = posDistance;
				}
					
			}
		}	
		// console.log(curMovseIndex)

		// if (lowestDistance == Math.sqrt( Math.pow(this.x-this.destination.x,2) + Math.pow(this.y-this.destination.y,2) )) {
		// 	console.log("Yolo")
		// 	console.log(lowestDistance);
		// 	console.log(Math.sqrt( Math.pow(options[curMoveIndex][0]-this.destination.x,2) + Math.pow(options[curMoveIndex][1]-this.destination.y,2) ));
		// 	console.log(curMoveIndex)
		// }

		if (curMoveIndex == 0) {
			this.runDownLeft();
		} else if (curMoveIndex == 1) {
			this.runUpRight();
		} else if (curMoveIndex == 2) {
			this.runDownRight();
		} else if (curMoveIndex == 3) {
			this.runUpLeft();
		}

	}

	update(tiles, selectHistory) {

		var curTile = tiles[this.tileIndex[0]][this.tileIndex[1]]
		var curSec = new Date().getTime() / 1000;

		if (selectHistory[1] == curTile) {
			this.needToHault = true
			this.openMenu = true;

		} else {
			this.openMenu=false;
		}

		if (this.needToAcceptDestin && selectHistory[1] != undefined) {
			console.log(selectHistory)
			this.destination = selectHistory[1]
			this.needToAcceptDestin = false
		} 

		if (this.startMender == true && this.centeredOnTile(curTile)) {
			this.isHarvesting = true
			this.randomTurn();
			this.startMender = false;
			this.openMenu = false;
		}


		if (this.destination == curTile && this.isHarvesting != true) {
			this.needToHault = true;
		}
		if (this.needToHault == true && this.centeredOnTile(curTile)) {

			this.hault()
			this.needToHault = false
			this.destination = undefined;
			if (curTile != this.docBase && this.isHarvesting == true) {
				this.isHarvesting = false;
			}
		}

		if (Math.abs(this.lastEmpty-new Date().getTime() / 1000) > this.harvestTime && this.isHarvesting == true && this.headingHome == false) {
			this.destination = this.docBase;
			this.headingHome = true
		}

		if (curTile == this.docBase && this.isHarvesting == true && this.headingHome == true) {

			this.headingHome = false
			this.lastEmpty = new Date().getTime() / 1000;
			this.owner.oreCount += this.oreCount;
			this.oreCount = 0;
			this.startMender = true;

		}

		if (curTile != this.docBase) {
		}


		
		// Debugging Tool:
		// console.log(curTile);
		
		// All 
		if (this.checkIfGoingOffWorld(tiles) != true) {
			if(this.tileIndex != [tiles.length, 0] && this.tileIndex != [(tiles.length+1)/2-1, 0] && this.tileIndex != [(tiles.length+1)/2-1, tiles[(tiles.length+1)/2-1].length-1] && this.tileIndex != [0,0]) {
				
				if(this.centeredOnTile(curTile) && this.destination != undefined) {
					this.checkDirection(tiles, curTile);
					this.checkIfGoingOffWorld(tiles);
				}
 
				// Random Movement
				if (Math.abs(this.lastTurn-curSec) > 2 && this.centeredOnTile(curTile) && this.xVel != 0  && this.yVel != 0 && this.destination == undefined) {
					this.randomTurn();
					this.checkIfGoingOffWorld(tiles)
					// Still a bug here!
				} 
			}
		
		}

		this.changeFrame();

		this.x+=this.xVel;
		this.y+=this.yVel;

		this.footY = this.y+this.height;
		this.footX = this.x+this.width+6;

	}


	returnType() {
		return "Astronaut"
	}

}
