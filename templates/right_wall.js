// Right Wall Following

// clear the driver object.
driver = {};

// gets called 1 time when the code is downloaded
// to the mouse.
driver.load = function() {
      // Switches to a maze that can be solved
      // using wall following.
      mouse.loadMaze("91japa1");
}

// Figure out next move.
// Gets called each iteration of the simulator.
driver.next = function() {

   if (mouse.isGoal()) {
      alert("Goal Reached!");
      mouse.stop();
      return;
   }

   // priority: right, fwd, left	
   if (mouse.isPathRight()) {
      mouse.right();
      mouse.fwd();
   } else if (mouse.isPathFwd()) {
      mouse.fwd();
   } else {
      mouse.left();
      mouse.fwd();
   }
}


