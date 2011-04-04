/*
 ****************************************************
 * maze.js
 *
 * Author: <brandon.blodget@gmail.com>
 *
 * Copyright 2011 Brandon Blodget.  
 * All rights reserved.
 *
 * This script defines an API for drawing a
 * MicroMouse maze and controlling a mouse
 * inside the generated maze.
 * It requires an html5 capable web browser.
 *
 ****************************************************
 */


// The MicroMouse object.  This is the only variable
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
var maze;		// data structure the reps the maze

var cMouseX;	// mouse x pos in cells
var cMouseY;	// mouse y pos in cells
var pMouseX;	// mouse x pos in pixels
var pMouseY;	// mouse y pos in pixels
var tpMouseX;	// target x pos in pixels
var tpMouseY;	// target y pos in pixels
var mouseDir; 	// "N", "E", "S", or "W"
var aMouseDir;	// the angle direction of mouse
var taMouseDir;	// the target angle direction of mouse
var mRadius;	// mouse radius.
var turnDir;	// "R"ight, "L"eft, "N"one.

var driver; 	// user code that drives the mouse
var running;	// boolean. True if mouse is running
var timer_id;	// id of the running timer.

var stepMode;	// true if we are in stepping mode.

var ssButton;	// the start stop button

// constants
var turnAmount = 10;	// speed at which the mouse turns
var incAmount = 5;		// speed at which the mouse move


/*
 ****************************************************
 * Public API Functions
 ****************************************************
 */

// Creates a new maze and draws it to the
// canvas with the Id=maze
// ss_button: jQuery start/stop button
// maze_file: string of json maze file.
if (typeof mouse.newMaze !== 'function') {
mouse.newMaze = function(ss_button,maze_file) {
	ssButton = ss_button;
	setRunning(false);


	// default maze size is 16x16 cells
	cWidth = 16;	
	cHeight = 16;	

	canvas = document.getElementById("maze");
	ctx = canvas.getContext("2d");

	pWidth = canvas.width;
	pHeight = canvas.height;

	pCellWidth = pWidth/cWidth;
	pCellHeight = pHeight/cHeight;

	// init mouse starting mostion
	// bottom left square
	setHomePosition();

	// compute mouse radius
	if (pCellWidth > pCellHeight) {
		mRadius = Math.floor(pCellHeight/2) - 5;
	} else {
		mRadius = Math.floor(pCellWidth/2) - 5;
	}

	mouse.loadMaze(maze_file);
};
}

if (typeof mouse.fwd !== 'function') {
mouse.fwd = function(cells) {
	var num = cells || 1;
	var i;

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
};
}

if (typeof mouse.right !== 'function') {
mouse.right = function(turns) {
	var num = turns || 1;
	var i;

	turnDir = "R";
	taMouseDir = taMouseDir + 90;

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
};
}

if (typeof mouse.left !== 'function') {
mouse.left = function(turns) {
	var num = turns || 1;
	var i;

	turnDir = "L";
	taMouseDir = taMouseDir - 90;

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
};
}

if (typeof mouse.isOpenLeft !== 'function') {
mouse.isOpenLeft = function() {
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

if (typeof mouse.isOpenRight !== 'function') {
mouse.isOpenRight = function() {
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

if (typeof mouse.isOpenFwd !== 'function') {
mouse.isOpenFwd = function() {
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

if (typeof mouse.isOpenBack !== 'function') {
mouse.isOpenBack = function() {
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

if (typeof mouse.loadDriver !== 'function') {
mouse.loadDriver = function(driverp) {
	driver = driverp;
};
}

if (typeof mouse.loadMaze !== 'function') {
mouse.loadMaze = function(maze_json) {

	$.getJSON(maze_json, function(json) {
		maze = json;
		drawMaze();
		drawMouse();
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
};
}

if (typeof mouse.isHome !== 'function') {
mouse.isHome = function() {
	if (cMouseX === 0 &&
		cMouseY === 0 &&
		mouseDir === "E") {

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

/* Home position is the upper left cell.
 * This cell is (0,0)
 */
function setHomePosition() {
	cMouseX = 0;
	cMouseY = 0; // cHeight - 1;
	mouseDir = "E";
	pMouseX = cell2px();
	pMouseY = cell2py();
	tpMouseX = pMouseX;
	tpMouseY = pMouseY;
	aMouseDir = head2angle();
	taMouseDir = head2angle();
	turnDir = "E";
	stepMode = false;
}

}());


