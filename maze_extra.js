/*
 ****************************************************
 * maze_extra.js
 *
 * Author: <brandon.blodget@gmail.com>
 *
 * Copyright 2011 Brandon Blodget.  
 * All rights reserved.
 *
 * This script has additional mouse API
 * functions that were pulled out of maze.js
 * They are stored here in case I want to put
 * them back later.
 *
 ****************************************************
 */


/*
 ****************************************************
 * Private Functions
 ****************************************************
 */

function initMaze() {
	var x, y;
	var gx, gy;  // goal entry square

	maze = [];
	for (y=0;y<cHeight;y++) {
		maze[y] = [];
		for (x=0;x<cWidth;x++) {
			maze[y][x] = "+";  // marks cell uninitialized
		}
	}

	// initialize the 4 center "goal" squares
	x = Math.floor(cWidth/2)- 1;
	y = Math.floor(cHeight/2) - 1;
	maze[y][x] = "SE";
	maze[y][x+1] = "WS";
	maze[y+1][x+1] = "WN";
	maze[y+1][x] = "EN";

	// pick random goal entry square
	gx = x + Math.floor(Math.random()*2);
	gy = y + Math.floor(Math.random()*2);

	// use goal entry square as starting point
	// for Recursive Backtracking maze generation
	
	// choose wall to non-explored neighbor
	choose_wall(gx,gy);
}

function random_sort() {
	return 0.5 - Math.random();
}

function choose_wall(sx,sy) {
	var dir = ["N", "E", "S", "W"].sort(random_sort);

	// coord of neighbor
	var nx;
	var ny;
	var nv;  // neighbor value

	var i;
	var r_dir; // random direction
	var o_dir; // opposite direction

	for (i=0; i<4; i=i+1) {

		r_dir = dir[i];

		// check if direction is okay
		switch (r_dir) {
			case "N" : nx = sx; ny = sy - 1; o_dir = "S"; break;
			case "E" : nx = sx + 1; ny = sy; o_dir = "W"; break;
			case "S" : nx = sx; ny = sy + 1; o_dir = "N"; break;
			case "W" : nx = sx - 1; ny = sy; o_dir = "E"; break;
		}

		if (nx >=0 && nx<cWidth && ny >= 0 && ny<cHeight) {
			if (maze[ny][nx].indexOf("+") !== -1) {
				maze[sy][sx] = maze[sy][sx] + r_dir;
				maze[ny][nx] = o_dir;
				choose_wall(nx, ny);
			}
		}
	}
}

