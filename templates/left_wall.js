driver = {};

driver.next = function() {
   if (mouse.isHome()) {
      // switches to a maze that can be solved
      // using left wall following
      // comment out next line if you want to
      // use a different maze.
      mouse.loadMaze("91japa1");
   }

   if (mouse.isGoal()) {
      alert("Goal Reached!");
      mouse.stop();
      return;
   }

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

