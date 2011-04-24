/*
 ****************************************************
 * maze.js
 *
 * Author: <brandon.blodget@gmail.com>
 *
 * Copyright 2011 Brandon Blodget.  
 *
 * This script defines an API for drawing a
 * Micromouse maze and controlling a mouse
 * inside the generated maze.
 * It requires an html5 capable web browser.
 *
 * License:
 * 
 * This file is part of "MicromouseSim"
 *
 * "MicromouseSim" is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * "MicromouseSim" is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with "MicromouseSim".  If not, see <http://www.gnu.org/licenses/>.
 *
 ****************************************************
 */

// The Micromouse object.  This is the only variable
// we export to the global namespace.  The API is
// made available through this object.
var mouse;
if (!mouse) {
	mouse = {};
}

// start closure
(function () {

/*
 ****************************************************
 * Global variables to this closure
 ****************************************************
 */

// Note: For the maze the top left cell is
// (0,0)

var cWidth;	// the width of the maze in cells
var cHeight;	// the height of the maze in cells
var canvas; // the html5 canvas we draw on
var ctx;	// the canvas context
var pWidth;	// the width of maze in pixels
var pHeight; // the height of the maze in pixels
var pCellWidth; // width of a cell in pixels
var pCellHeight;	// height of a cell in pixels
var speed;		// the number of steps it takes to move one cell
var maze;		// data structure the reps the maze
var memMaze;	// the mouses memory of the maze.
//var memMazeValue;	// mouses memory of cell values
//var memMazeWall;	// mouses memory of the walls

var memMouseX;		// mouse x pos in cells
var memMouseY;		// mouse y pos in cells
var memMouseDir;	// "N", "E", "S", or "W"

var cMouseX;	// mouse x pos in cells
var cMouseY;	// mouse y pos in cells
var pMouseX;	// mouse x pos in pixels
var pMouseY;	// mouse y pos in pixels
var tpMouseX;	// target x pos in pixels
var tpMouseY;	// target y pos in pixels
var mouseDir;	// "N", "E", "S", or "W"
var aMouseDir;	// the angle direction of mouse
var taMouseDir;	// the target angle direction of mouse
var mRadius;	// mouse radius.
var turnDir;	// "R"ight, "L"eft, "N"one.

var driver;		// user code that drives the mouse
var maze_sel;	// text id of currently selected maze.
var running;	// boolean. True if mouse is running
var timer_id;	// id of the running timer.

var stepMode;	// true if we are in stepping mode.

var ssButton;	// the start stop button

var moveCount;	// number of moves from start square

// constants
var turnAmount = 10;	// speed at which the mouse turns
var incAmount = 5;		// speed at which the mouse move
var outOfBounds = 401;   // constant for out of bound values

// memMaze array constants
var NORTH	= 0;
var EAST	= 1;
var SOUTH	= 2;
var WEST	= 3;
var VISIT	= 4;
var DATA	= 5;


/*
 ****************************************************
 * Public Data structures
 ****************************************************
 */


// public pointer to the mouses memory.
//if (typeof mouse.newMaze !== 'function') {
//mouse.memMaze = memMaze;
//}

/*
 ****************************************************
 * Public API Functions
 ****************************************************
 */

// Creates a new maze and draws it to the
// canvas with the Id=maze
// ss_button: jQuery start/stop button
// maze_sel: string of selected maze.
if (typeof mouse.newMaze !== 'function') {
mouse.newMaze = function(ss_button,maze_sel) {
	ssButton = ss_button;
	//setRunning(false);
	running = false;


	// default maze size is 16x16 cells
	cWidth = 16;	
	cHeight = 16;	

	canvas = document.getElementById("maze");
	ctx = canvas.getContext("2d");

	pWidth = canvas.width;
	pHeight = canvas.height;

	pCellWidth = pWidth/cWidth;
	pCellHeight = pHeight/cHeight;

	mouse.setSpeed(10);

	// init mouse starting mostion
	// bottom left square
	setHomePosition();

	// compute mouse radius
	if (pCellWidth > pCellHeight) {
		mRadius = Math.floor(pCellHeight/2) - 5;
	} else {
		mRadius = Math.floor(pCellWidth/2) - 5;
	}

	mouse.loadMaze(maze_sel);
};
}

if (typeof mouse.fwd !== 'function') {
mouse.fwd = function(cells) {
	var num = cells || 1;
	var i;

	if (mouse.isHome()) {moveCount=0;}
	moveCount += num;

	for (i=0; i<num; i++) {
		switch (mouseDir) {
			case "N" : 
				if (maze[cMouseY][cMouseX].indexOf("N") !== -1) {
					cMouseY = cMouseY - 1;
				}
				break;
			case "E" : 
				if (maze[cMouseY][cMouseX].indexOf("E") !== -1) {
					cMouseX = cMouseX + 1; 
				}
				break;
			case "S" : 
				if (maze[cMouseY][cMouseX].indexOf("S") !== -1) {
					cMouseY = cMouseY + 1;
				}
				break;
			case "W" : 
				if (maze[cMouseY][cMouseX].indexOf("W") !== -1) {
					cMouseX = cMouseX - 1;
				}
				break;
		}
	}
	tpMouseX = cell2px();
	tpMouseY = cell2py();

	memMouseX = cMouseX;
	memMouseY = cMouseY;
	memMouseDir = mouseDir;
	memUpdate();

};
}

if (typeof mouse.back !== 'function') {
mouse.back = function(cells) {
	var num = cells || 1;
	var i;

	if (mouse.isHome()) {moveCount=0;}
	moveCount += num;

	for (i=0; i<num; i++) {
		switch (mouseDir) {
			case "N" : 
				if (maze[cMouseY][cMouseX].indexOf("S") !== -1) {
					cMouseY = cMouseY + 1;
				}
				break;
			case "E" : 
				if (maze[cMouseY][cMouseX].indexOf("W") !== -1) {
					cMouseX = cMouseX - 1; 
				}
				break;
			case "S" : 
				if (maze[cMouseY][cMouseX].indexOf("N") !== -1) {
					cMouseY = cMouseY - 1;
				}
				break;
			case "W" : 
				if (maze[cMouseY][cMouseX].indexOf("E") !== -1) {
					cMouseX = cMouseX + 1;
				}
				break;
		}
	}
	tpMouseX = cell2px();
	tpMouseY = cell2py();

	memMouseX = cMouseX;
	memMouseY = cMouseY;
	memMouseDir = mouseDir;
	memUpdate();
};
}

if (typeof mouse.right !== 'function') {
mouse.right = function(turns) {
	var num = turns || 1;
	var i;

	if (mouse.isHome()) {moveCount=0;}
	moveCount += num;

	turnDir = "R";
	taMouseDir = taMouseDir + (90*num);

	for (i=0; i<num; i++) {
		switch (mouseDir) {
			case "N" : 
				mouseDir = "E"; break;
			case "E" : 
				mouseDir = "S"; break;
			case "S" : 
				mouseDir = "W"; break;
			case "W" : 
				mouseDir = "N"; break;
		}
	}

	memMouseX = cMouseX;
	memMouseY = cMouseY;
	memMouseDir = mouseDir;
};
}

if (typeof mouse.left !== 'function') {
mouse.left = function(turns) {
	var num = turns || 1;
	var i;

	if (mouse.isHome()) {moveCount=0;}
	moveCount += num;

	turnDir = "L";
	taMouseDir = taMouseDir - (90*num);

	for (i=0; i<num; i++) {
		switch (mouseDir) {
			case "N" : 
				mouseDir = "W"; break;
			case "E" : 
				mouseDir = "N"; break;
			case "S" : 
				mouseDir = "E"; break;
			case "W" : 
				mouseDir = "S"; break;
		}
	}

	memMouseX = cMouseX;
	memMouseY = cMouseY;
	memMouseDir = mouseDir;
};
}

if (typeof mouse.isPathLeft !== 'function') {
mouse.isPathLeft = function() {
	var goodDir = maze[cMouseY][cMouseX];

		switch (mouseDir) {
			case "N" : 
				if (goodDir.indexOf("W") === -1) {
					return false;
				}
				break;
			case "E" : 
				if (goodDir.indexOf("N") === -1) {
					return false;
				}
				break;
			case "S" : 
				if (goodDir.indexOf("E") === -1) {
					return false;
				}
				break;
			case "W" : 
				if (goodDir.indexOf("S") === -1) {
					return false;
				}
				break;
		}
		return true;
};
}

if (typeof mouse.isWallLeft !== 'function') {
mouse.isWallLeft = function() {
	return !(mouse.isPathLeft());
};
}

if (typeof mouse.isPathRight !== 'function') {
mouse.isPathRight = function() {
	var goodDir = maze[cMouseY][cMouseX];

		switch (mouseDir) {
			case "N" : 
				if (goodDir.indexOf("E") === -1) {
					return false;
				}
				break;
			case "E" : 
				if (goodDir.indexOf("S") === -1) {
					return false;
				}
				break;
			case "S" : 
				if (goodDir.indexOf("W") === -1) {
					return false;
				}
				break;
			case "W" : 
				if (goodDir.indexOf("N") === -1) {
					return false;
				}
				break;
		}
		return true;
};
}

if (typeof mouse.isWallRight !== 'function') {
mouse.isWallRight = function() {
	return !(mouse.isPathRight());
};
}

if (typeof mouse.isPathFwd !== 'function') {
mouse.isPathFwd = function() {
	var goodDir = maze[cMouseY][cMouseX];

		switch (mouseDir) {
			case "N" : 
				if (goodDir.indexOf("N") === -1) {
					return false;
				}
				break;
			case "E" : 
				if (goodDir.indexOf("E") === -1) {
					return false;
				}
				break;
			case "S" : 
				if (goodDir.indexOf("S") === -1) {
					return false;
				}
				break;
			case "W" : 
				if (goodDir.indexOf("W") === -1) {
					return false;
				}
				break;
		}
		return true;
};
}

if (typeof mouse.isWallFwd !== 'function') {
mouse.isWallFwd = function() {
	return !(mouse.isPathFwd());
};
}

if (typeof mouse.isPathBack !== 'function') {
mouse.isPathBack = function() {
	var goodDir = maze[cMouseY][cMouseX];

		switch (mouseDir) {
			case "N" : 
				if (goodDir.indexOf("S") === -1) {
					return false;
				}
				break;
			case "E" : 
				if (goodDir.indexOf("W") === -1) {
					return false;
				}
				break;
			case "S" : 
				if (goodDir.indexOf("N") === -1) {
					return false;
				}
				break;
			case "W" : 
				if (goodDir.indexOf("E") === -1) {
					return false;
				}
				break;
		}
		return true;
};
}

if (typeof mouse.isWallBack !== 'function') {
mouse.isWallBack = function() {
	return !(mouse.isPathBack());
};
}

if (typeof mouse.start !== 'function') {
mouse.start = function() {
	stepMode = false;
	if (driver && !running) {
		timer_id = setInterval(update,20);
		setRunning(true);
	}
};
}

if (typeof mouse.stop !== 'function') {
mouse.stop = function() {
	stepMode = true;
};
}

if (typeof mouse.step !== 'function') {
mouse.step = function() {
	stepMode = true;
	if (driver && !running) {
		timer_id = setInterval(update,20);
		setRunning(true);
	}
};
}

// number of moves made since last at home.
if (typeof mouse.moveCount !== 'function') {
mouse.moveCount = function() {
	return moveCount;
};
}

// Resets mouse memory and returns it home.
if (typeof mouse.reset !== 'function') {
mouse.reset = function() {

	if (driver.load) {
		driver.load();
	}

	mouse.home();
	mouse.memClear();
};
}

// Sets the mouses speed.
// Indicates number of steps required to move
// one cell.
// 1 is fastest.
if (typeof mouse.setSpeed !== 'function') {
mouse.setSpeed = function(speedp) {
	speed = speedp;
	incAmount = pCellWidth/speed;
	turnAmount = 90/speed;
};
}

// returns true on success else false
if (typeof mouse.loadDriver !== 'function') {
mouse.loadDriver = function(driverp) {
	driver = driverp;

	// make sure a maze is loaded.
	if (maze_sel && maze_sel !== "loading") {

		/*
		if (driver.load) {
			driver.load();
		}
		*/
		//mouse.home();
		//mouse.memClear(); // clear the mouses memory.
		mouse.reset();

		return true;
	} else {
		return false;
	}
};
}

if (typeof mouse.loadMaze !== 'function') {
mouse.loadMaze = function(maze_selp) {
	var maze_json = "mazes_json/" + maze_selp + ".json";

	maze_sel = "loading";

	// change menu selection
	$("#maze_sel").val(maze_selp).attr('selected','selected');

	$.getJSON(maze_json, function(json) {
		maze_sel = maze_selp;
		maze = json;
		drawMaze();
		drawMouse();

		// clear the mouses memory
		mouse.home();
		mouse.memClear();
	});


};
}

if (typeof mouse.x !== 'function') {
mouse.x = function() {
	return cMouseX;
};
}

if (typeof mouse.y !== 'function') {
mouse.y = function() {
	return cMouseY;
};
}

if (typeof mouse.heading !== 'function') {
mouse.heading = function() {
	return mouseDir;
};
}

if (typeof mouse.home !== 'function') {
mouse.home = function() {
	mouse.stop();
	eraseMouse();
	setHomePosition();
	clearTimer();
	drawMouse();
	moveCount = 0;
};
}

if (typeof mouse.isHome !== 'function') {
mouse.isHome = function() {
	if (cMouseX === 0 &&
		cMouseY === 15) { // &&
		// mouseDir === "N") {

		return true;
	} else {
		return false;
	}
};
}

if (typeof mouse.isGoal !== 'function') {
mouse.isGoal = function() {
   if ((cMouseX === 7 || cMouseX === 8) &&
       (cMouseY === 7 || cMouseY === 8)) {

		return true;
	} else {
		return false;
	}
};
}

// Mouse memory functions

//memIsWallLeft(): Returns true if a wall to the left has been remembered.
if (typeof mouse.memIsWallLeft !== 'function') {
mouse.memIsWallLeft = function() {
	var i = left2Index(memMouseDir);
	return !(memMaze[memMouseY][memMouseX][dir]);
};
}

//memIsPathLeft(): Returns true if a wall to the left has not been remembered.
if (typeof mouse.memIsPathLeft !== 'function') {
mouse.memIsPathLeft = function() {
	var i = left2Index(memMouseDir);
	return memMaze[memMouseY][memMouseX][dir];
};
}

//memIsWallRight(): Returns true if a wall to the right has been remembered.
if (typeof mouse.memIsWallRight !== 'function') {
mouse.memIsWallRight = function() {
	var i = right2Index(memMouseDir);
	return !(memMaze[memMouseY][memMouseX][dir]);
};
}

//memIsPathRight(): Returns true if a wall to the right has not been remembered.
if (typeof mouse.memIsPathRight !== 'function') {
mouse.memIsPathRight = function() {
	var i = right2Index(memMouseDir);
	return memMaze[memMouseY][memMouseX][dir];
};
}

//memIsWallFwd(): Returns true if a wall to the forward has been remembered.
if (typeof mouse.memIsWallFwd !== 'function') {
mouse.memIsWallFwd = function() {
	var i = fwd2Index(memMouseDir);
	return !(memMaze[memMouseY][memMouseX][dir]);
};
}

//memIsPathFwd(): Returns true if a wall to the forward has not been remembered.
if (typeof mouse.memIsPathFwd !== 'function') {
mouse.memIsPathFwd = function() {
	var i = fwd2Index(memMouseDir);
	return memMaze[memMouseY][memMouseX][dir];
};
}

//memIsWallBack(): Returns true if a wall to the back has been remembered.
if (typeof mouse.memIsWallBack !== 'function') {
mouse.memIsWallBack = function() {
	var i = back2Index(memMouseDir);
	return !(memMaze[memMouseY][memMouseX][dir]);
};
}

//memIsPathBack(): Returns true if a wall to the back has not been remembered.
if (typeof mouse.memIsPathBack !== 'function') {
mouse.memIsPathBack = function() {
	var i = back2Index(memMouseDir);
	return memMaze[memMouseY][memMouseX][dir];
};
}

//memSetData(data): Store data in the current cell.
if (typeof mouse.memSetData !== 'function') {
mouse.memSetData = function(data) {
	memMaze[memMouseY][memMouseX][DATA] = data;
};
}

//memSetDataLeft(data): Store data in the left cell.
if (typeof mouse.memSetDataLeft !== 'function') {
mouse.memSetDataLeft = function(data) {
	var off = left2Offset(memMouseDir);
	memMaze[memMouseY+off.y][memMouseX+off.x][DATA] = data;
};
}

//memSetDataRight(data): Store data in the right cell.
if (typeof mouse.memSetDataRight !== 'function') {
mouse.memSetDataRight = function(data) {
	var off = right2Offset(memMouseDir);
	memMaze[memMouseY+off.y][memMouseX+off.x][DATA] = data;
};
}

//memSetDataFwd(data): Store data in the forward cell.
if (typeof mouse.memSetDataFwd !== 'function') {
mouse.memSetDataFwd = function(data) {
	var off = fwd2Offset(memMouseDir);
	memMaze[memMouseY+off.y][memMouseX+off.x][DATA] = data;
};
}

//memSetDataBack(data): Store data in the back cell.
if (typeof mouse.memSetDataBack !== 'function') {
mouse.memSetDataBack = function(data) {
	var off = back2Offset(memMouseDir);
	memMaze[memMouseY+off.y][memMouseX+off.x][DATA] = data;
};
}

//memGetData(): Returns the data stored in the current cell.
if (typeof mouse.memGetData !== 'function') {
mouse.memGetData = function() {
	return memMaze[memMouseY][memMouseX][DATA];
};
}

//memGetDataLeft(): Returns the value for the left cell.
if (typeof mouse.memGetDataLeft !== 'function') {
mouse.memGetDataLeft = function() {
	var off = left2Offset(memMouseDir);
	return memMaze[memMouseY+off.y][memMouseX+off.x][DATA];
};
}

//memGetDataRight(): Returns the value for the right cell.
if (typeof mouse.memGetDataRight !== 'function') {
mouse.memGetDataRight = function() {
	var off = right2Offset(memMouseDir);
	return memMaze[memMouseY+off.y][memMouseX+off.x][DATA];
};
}

//memGetDataFwd(): Returns the value for the cell in front.
if (typeof mouse.memGetDataFwd !== 'function') {
mouse.memGetDataFwd = function() {
	var off = fwd2Offset(memMouseDir);
	return memMaze[memMouseY+off.y][memMouseX+off.x][DATA];
};
}

//memGetDataBack(): Returns the value for the cell in back.
if (typeof mouse.memGetDataBack !== 'function') {
mouse.memGetDataBack = function() {
	var off = back2Offset(memMouseDir);
	return memMaze[memMouseY+off.y][memMouseX+off.x][DATA];
};
}

//memGetVisited(): Returns true if the current memory has been visited.
if (typeof mouse.memGetVisited !== 'function') {
mouse.memGetVisited = function() {
	return memMaze[memMouseY][memMouseX][VISIT];
};
}

//memGetVisitedLeft(): Returns true if the left cell has been visited.
if (typeof mouse.memGetVisitedLeft !== 'function') {
mouse.memGetVisitedLeft = function() {
	var off = left2Offset(memMouseDir);
	return memMaze[memMouseY+off.y][memMouseX+off.x][VISIT];
};
}

//memGetVisitedRight(): Returns true if the right cell has been visited.
if (typeof mouse.memGetVisitedRight !== 'function') {
mouse.memGetVisitedRight = function() {
	var off = right2Offset(memMouseDir);
	return memMaze[memMouseY+off.y][memMouseX+off.x][VISIT];
};
}

//memGetVisitedFwd(): Returns true if the forward cell has been visited.
if (typeof mouse.memGetVisitedFwd !== 'function') {
mouse.memGetVisitedFwd = function() {
	var off = fwd2Offset(memMouseDir);
	return memMaze[memMouseY+off.y][memMouseX+off.x][VISIT];
};
}

//memGetVisitedBack(): Returns true if the back cell has been visited.
if (typeof mouse.memGetVisitedBack !== 'function') {
mouse.memGetVisitedBack = function() {
	var off = back2Offset(memMouseDir);
	return memMaze[memMouseY+off.y][memMouseX+off.x][VISIT];
};
}

//memClear(): Clears everything from the mouse memory.
if (typeof mouse.memClear !== 'function') {
mouse.memClear = function() {
	var x, y;
	memMaze = [];
	for (y=0;y<cHeight;y++) {
		memMaze[y] = [];
		for (x=0;x<cWidth;x++) {
			// [NORTH,EAST,SOUTH,WEST,VISIT,DATA]
			memMaze[y][x] = [];
			if (y===0) {
				memMaze[y][x][NORTH] = false;  // wall north
			} else { 
				memMaze[y][x][NORTH] = true;
			}
			if (y===cHeight-1) {
				memMaze[y][x][SOUTH] = false; // wall south
			} else { 
				memMaze[y][x][SOUTH] = true;
			}
			if (x===0) {
				memMaze[y][x][WEST] = false; // wall west
			} else { 
				memMaze[y][x][WEST] = true;
			}
			if (x===cWidth-1) {
				memMaze[y][x][EAST] = false; // wall east
			} else { 
				memMaze[y][x][EAST] = true;
			}
			memMaze[y][x][VISIT] = false;
			memMaze[y][x][DATA] = 0;
		}
	}
	// We should look at and record the cell we are in.
	memUpdate();
};
}

//memPerfect(): Get a perfect memory of the maze.
if (typeof mouse.memPerfect !== 'function') {
mouse.memPerfect = function() {
	var x, y;
	memMaze = [];
	for (y=0;y<cHeight;y++) {
		memMaze[y] = [];
		for (x=0;x<cWidth;x++) {
			// [NORTH,EAST,SOUTH,WEST,VISIT,DATA]
			memMaze[y][x] = [];
			if (y===0) {
				memMaze[y][x][NORTH] = false;  // wall north
			} else { 
				//memMaze[y][x][NORTH] = true;
				memMaze[y][x][NORTH] = (maze[y][x].indexOf("N") !== -1);
			}
			if (y===cHeight-1) {
				memMaze[y][x][SOUTH] = false; // wall south
			} else { 
				//memMaze[y][x][SOUTH] = true;
				memMaze[y][x][SOUTH] = (maze[y][x].indexOf("S") !== -1);
			}
			if (x===0) {
				memMaze[y][x][WEST] = false; // wall west
			} else { 
				//memMaze[y][x][WEST] = true;
				memMaze[y][x][WEST] = (maze[y][x].indexOf("W") !== -1);
			}
			if (x===cWidth-1) {
				memMaze[y][x][EAST] = false; // wall east
			} else { 
				//memMaze[y][x][EAST] = true;
				memMaze[y][x][EAST] = (maze[y][x].indexOf("E") !== -1);
			}
			memMaze[y][x][VISIT] = false;
			memMaze[y][x][DATA] = 0;
		}
	}
};
}

//memSetPosAt(x,y,heading):
if (typeof mouse.memSetPosAt !== 'function') {
mouse.memSetPosAt = function(x,y,heading) {
	memMouseX = x;
	memMouseY = y;
	memMouseDir = heading;
};
}



//memFlood(rev): Uses the walls in the mouse's memory to calculate 
//how far each cell is from a destination square. 
//The distances are stored in the cells value.
//when goGoal==true then goal squares are the destination
//when goGoal==false then home square is the destination
if (typeof mouse.memFlood !== 'function') {
mouse.memFlood = function(goGoalp) {
	var goGoal = goGoalp;
	var x, y;
	var level = 0;
	var currentLevel = [];
	var nextLevel = [];
	var cell;
	var cellData;
	var done = false;
	var str="";

	if (goGoalp === undefined) {
		goGoal = true;  // the default
	} 

	// Set all data values to 255.
	for (y=0;y<cHeight;y++) {
		for (x=0;x<cWidth;x++) {
			memMaze[y][x][DATA] = 255;
		}
	}

	// put destination cells in currentLevel
	if (goGoal) {
		// goal squares
		currentLevel.push(Cell(7,7),Cell(8,7),Cell(7,8),Cell(8,8));
	} else {
		// home square
		currentLevel.push(Cell(0,15));
	}

	while(!done) {
		while(currentLevel.length>0) {
			cell = currentLevel.pop();
			cellData = memMaze[cell.y][cell.x];
			if (cellData[DATA] === 255) {
				cellData[DATA] = level;
				// add open neighbors to nextLevel
				if (cellData[NORTH]) {
					nextLevel.push(Cell(cell.x,cell.y-1));
				}
				if (cellData[EAST]) {
					nextLevel.push(Cell(cell.x+1,cell.y));
				}
				if (cellData[SOUTH]) {
					nextLevel.push(Cell(cell.x,cell.y+1));
				}
				if (cellData[WEST]) {
					nextLevel.push(Cell(cell.x-1,cell.y));
				}
			}
		}
		if (nextLevel.length>0) {
			level++;
			currentLevel = nextLevel;
			nextLevel = [];
		} else {
			done = true;
		}
	}

};
}

// print the content of the mouse data memory.
if (typeof mouse.memPrintData !== 'function') {
mouse.memPrintData = function() {
	var x,y;
	var str="";
	var d;

	// print debugging info
	str = "Flood values:\n";
	for (y=0;y<cHeight;y++) {
		for (x=0;x<cWidth;x++) {
			d = memMaze[y][x][DATA];
			if (d < 10) {
				str += "  "+ memMaze[y][x][DATA] + " ";
			} else if (d < 100) {
				str += " "+ memMaze[y][x][DATA] + " ";
			} else {
				str += memMaze[y][x][DATA] + " ";
			}
		}
		str = str + "\n";
	}
	console.log(str);
};
}

// print the maze in the mouse's memory.
if (typeof mouse.memPrintMaze !== 'function') {
mouse.memPrintMaze = function() {
	var x,y;
	var str="";
	var path;

	// print debugging info
	str = "Flood values:\n";
	for (y=0;y<cHeight;y++) {
		// print north wall
		for (x=0;x<cWidth;x++) {
			path = memMaze[y][x][NORTH];
			if (path) {
				str += "+ ";
			} else {
				str += "+-";
			}
		}
		str += "+\n";
		// print west wall
		for (x=0;x<cWidth;x++) {
			path = memMaze[y][x][WEST];
			if (path) {
				str += "  ";
			} else {
				str += "| ";
			}
		}
		str += "|\n";
	}
	str += "+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+\n";
	console.log(str);
};
}

/*
 ****************************************************
 * Private Functions
 ****************************************************
 */

function drawMaze() {
	var x;
	var y;
	var px;
	var py;
	var code;

	// clear canvas
	canvas.width = canvas.width;

	for (y=0;y<cHeight;y++) {
		for (x=0;x<cWidth;x++) {
			code = maze[y][x];
			px = x * pCellWidth;
			py = y * pCellHeight;

			// north wall
			ctx.beginPath();
			ctx.moveTo(px,py);
			ctx.lineTo(px+pCellWidth,py);
			if (code.indexOf("N") !== -1) {
				ctx.strokeStyle="white";
			} else {
				ctx.strokeStyle="blue";
			}
			ctx.stroke();

			// east wall
			ctx.beginPath();
			ctx.moveTo(px+pCellWidth,py);
			ctx.lineTo(px+pCellWidth,py+pCellHeight);
			if (code.indexOf("E") !== -1) {
				ctx.strokeStyle="white";
			} else {
				ctx.strokeStyle="blue";
			}
			ctx.stroke();

			// south wall
			ctx.beginPath();
			ctx.moveTo(px+pCellWidth,py+pCellHeight);
			ctx.lineTo(px,py+pCellHeight);
			if (code.indexOf("S") !== -1) {
				ctx.strokeStyle="white";
			} else {
				ctx.strokeStyle="blue";
			}
			ctx.stroke();

			// west wall
			ctx.beginPath();
			ctx.moveTo(px,py+pCellHeight);
			ctx.lineTo(px,py);
			if (code.indexOf("W") !== -1) {
				ctx.strokeStyle="white";
			} else {
				ctx.strokeStyle="blue";
			}
			ctx.stroke();
		}
	}
}

function rads(degrees) {
	return (Math.PI/180)*degrees;
}

function eraseMouse() {
	var px, py;

	px = pMouseX - (pCellWidth-2)/2;
	py = pMouseY - (pCellHeight-2)/2;

	ctx.clearRect(px,py,pCellWidth-3, pCellHeight-3);
	//ctx.strokeStyle = "#000";
	//ctx.stroke();

}


function drawMouse() {
	var r;	// radius

	ctx.beginPath();
	ctx.arc(pMouseX,pMouseY,mRadius,rads(aMouseDir),
		rads(aMouseDir+360),false); // Outer circle
	ctx.lineTo(pMouseX,pMouseY);
	/*
	ctx.moveTo(110,75);
	ctx.arc(75,75,35,0,Math.PI,false);   // Mouth (clockwise)
	ctx.moveTo(65,65);
	ctx.arc(60,65,5,0,Math.PI*2,true);  // Left eye
	ctx.moveTo(95,65);
	ctx.arc(90,65,5,0,Math.PI*2,true);  // Right eye
	*/
	ctx.closePath();
	ctx.strokeStyle = "#000";
	ctx.stroke();
}

function clearTimer() {
	if (running && timer_id) {
		clearInterval(timer_id);
		setRunning(false);
	}
}

function setRunning(isRunning) {
	if (isRunning) {
		running = true;
		ssButton.html('Stop');

	} else {
		running = false;
		ssButton.html('Start');
	}
}

function update() {
	var dirDiff;
	var xDiff;
	var yDiff;

	// if we are all up to date then run the
	// next user command.
	if (pMouseX === tpMouseX &&
		pMouseY === tpMouseY &&
		aMouseDir === taMouseDir) {

		driver.next();

		if (stepMode) {
			clearTimer();
			return;
		}

	}

	eraseMouse();

	// turn first then move
	dirDiff = Math.abs(aMouseDir - taMouseDir);
	if (dirDiff > turnAmount) {
		if (turnDir === "R") {
			aMouseDir+=turnAmount;
		} else {
			aMouseDir-=turnAmount;
		}
		drawMouse();
		return;
	} else {
		if (aMouseDir !== taMouseDir) {
			aMouseDir = taMouseDir;
			drawMouse();
			return;
		}
	}

	xDiff = Math.abs(pMouseX - tpMouseX);
	if (xDiff > incAmount) {
		if (pMouseX < tpMouseX) {
			pMouseX+=incAmount;
		} else {
			pMouseX-=incAmount;
		}
	} else {
		if (pMouseX !== tpMouseX) {
			pMouseX = tpMouseX;
		}
	}

	yDiff = Math.abs(pMouseY - tpMouseY);
	if (yDiff > incAmount) {
		if (pMouseY < tpMouseY) {
			pMouseY+=incAmount;
		} else {
			pMouseY-=incAmount;
		}
	} else {
		if (pMouseY !== tpMouseY) {
			pMouseY = tpMouseY;
		}
	}


	drawMouse();
}

function cell2px() {
	return ((cMouseX * pCellWidth) + (pCellWidth/2));
}

function cell2py() {
	return ((cMouseY * pCellHeight) + (pCellHeight/2));
}

function head2angle() {
	switch(mouseDir) {
		case "N" : return -90;
		case "E" : return 0;
		case "S" : return 90;
		case "W" : return 180;
	}
	return 0;
}

/* Home position is the lower left cell.
 * This cell is (0,15)
 */
function setHomePosition() {
	cMouseX = 0;
	cMouseY = cHeight - 1;
	mouseDir = "N";
	pMouseX = cell2px();
	pMouseY = cell2py();
	tpMouseX = pMouseX;
	tpMouseY = pMouseY;
	aMouseDir = head2angle();
	taMouseDir = head2angle();
	turnDir = "N";
	stepMode = false;
	memMouseX = cMouseX;
	memMouseY = cMouseY;
	memMouseDir = mouseDir;
}

// update the mouses memory of this cell.
function memUpdate() {
	var cell = memMaze[memMouseY][memMouseX];
	var lcell, rcell, fcell, bcell; // neighbor cells
	var fwd, right, back, left;
	var off;

	// FIXME:  Don't update for now
	//return;

	cell[VISIT] = true;
	switch (memMouseDir) {
		case "N" : fwd=NORTH; right=EAST; back=SOUTH; left=WEST; break;
		case "E" : fwd=EAST; right=SOUTH; back=WEST; left=NORTH; break;
		case "S" : fwd=SOUTH; right=WEST; back=NORTH; left=EAST; break;
		case "W" : fwd=WEST; right=NORTH; back=EAST; left=SOUTH; break;
	}

	// left cell
	off = left2Offset(memMouseDir);
	if (memMouseY+off.y >= 0 && memMouseY+off.y < cHeight &&
		memMouseX+off.x >= 0 && memMouseX+off.x < cWidth) {
		lcell = memMaze[memMouseY+off.y][memMouseX+off.x];
	}

	// right cell
	off = right2Offset(memMouseDir);
	if (memMouseY+off.y >= 0 && memMouseY+off.y < cHeight &&
		memMouseX+off.x >= 0 && memMouseX+off.x < cWidth) {
		rcell = memMaze[memMouseY+off.y][memMouseX+off.x];
	}

	// fwd cell
	off = fwd2Offset(memMouseDir);
	if (memMouseY+off.y >= 0 && memMouseY+off.y < cHeight &&
		memMouseX+off.x >= 0 && memMouseX+off.x < cWidth) {
		fcell = memMaze[memMouseY+off.y][memMouseX+off.x];
	}

	// back cell
	off = back2Offset(memMouseDir);
	if (memMouseY+off.y >= 0 && memMouseY+off.y < cHeight &&
		memMouseX+off.x >= 0 && memMouseX+off.x < cWidth) {
		bcell = memMaze[memMouseY+off.y][memMouseX+off.x];
	}

	// left path
	if (mouse.isPathLeft()) {
		cell[left]=true;
		if (lcell) {lcell[right]=true;}
	} else {
		cell[left]=false;
		if (lcell) {lcell[right]=false;}
	}

	// right path
	if (mouse.isPathRight()) {
		cell[right]=true;
		if (rcell) {rcell[left]=true;}
	} else {
		cell[right]=false;
		if (rcell) {rcell[left]=false;}
	}

	// fwd path
	if (mouse.isPathFwd()) {
		cell[fwd]=true;
		if (fcell) {fcell[back]=true;}
	} else {
		cell[fwd]=false;
		if (fcell) {fcell[back]=false;}
	}

	// back path
	if (mouse.isPathBack()) {
		cell[back]=true;
		if (bcell) {bcell[fwd]=true;}
	} else {
		cell[back]=false;
		if (bcell) {bcell[fwd]=false;}
	}
	/*
	console.log("pos: "+memMouseX+" "+memMouseY+"\n");
	console.log("cell: "+cell[NORTH]+" "+
						 cell[EAST]+" "+
						 cell[SOUTH]+" "+
						 cell[WEST]+" "+
						 cell[VISIT]+" "+
						 cell[DATA]+"\n");
	 */

}

function left2Index(heading) {
	switch(heading) {
		case "N" : return WEST;
		case "E" : return NORTH;
		case "S" : return EAST;
		case "W" : return SOUTH;
	}
}

function right2Index(heading) {
	switch(heading) {
		case "N" : return EAST;
		case "E" : return SOUTH;
		case "S" : return WEST;
		case "W" : return NORTH;
	}
}

function fwd2Index(heading) {
	switch(heading) {
		case "N" : return NORTH;
		case "E" : return EAST;
		case "S" : return SOUTH;
		case "W" : return WEST;
	}
}

function back2Index(heading) {
	switch(heading) {
		case "N" : return SOUTH;
		case "E" : return WEST;
		case "S" : return NORTH;
		case "W" : return EAST;
	}
}

function left2Offset(heading) {
	var off = {};
	off.x = 0;
	off.y = 0;
	switch(heading) {
		case "N" : off.x = -1; break;
		case "E" : off.y = -1; break;
		case "S" : off.x = 1;  break;
		case "W" : off.y = 1;  break;
	}
	return off;
}

function right2Offset(heading) {
	var off = {};
	off.x = 0;
	off.y = 0;
	switch(heading) {
		case "N" : off.x = 1; break;
		case "E" : off.y = 1; break;
		case "S" : off.x = -1; break;
		case "W" : off.y = -1; break;
	}
	return off;
}

function fwd2Offset(heading) {
	var off = {};
	off.x = 0;
	off.y = 0;
	switch(heading) {
		case "N" : off.y = -1; break;
		case "E" : off.x = 1; break;
		case "S" : off.y = 1; break;
		case "W" : off.x = -1; break;
	}
	return off;
}

function back2Offset(heading) {
	var off = {};
	off.x = 0;
	off.y = 0;
	switch(heading) {
		case "N" : off.y = 1; break;
		case "E" : off.x = -1; break;
		case "S" : off.y = -1; break;
		case "W" : off.x = 1; break;
	}
	return off;
}

// constructs a Cell object.
function Cell(x,y) {
	return {"x":x,"y":y};
}

}());


