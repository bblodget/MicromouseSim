driver = {};

driver.next = function() {

   if (mouse.isGoal()) {
      alert("Goal Reached!");
      mouse.stop();
      return;
   }

   if (mouse.isOpenRight()) {
      mouse.right();
      mouse.fwd();
   } else if (mouse.isOpenFwd()) {
      mouse.fwd();
   } else {
      mouse.left();
      mouse.fwd();
   }
}

