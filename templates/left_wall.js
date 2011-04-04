// Left Wall Following

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

   // priority: left, fwd, right	
   if (mouse.isOpenLeft()) {
      mouse.left();
      mouse.fwd();
   } else if (mouse.isOpenFwd()) {
      mouse.fwd();
   } else {
      mouse.right();
      mouse.fwd();
   }
}

