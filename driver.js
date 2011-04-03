driver = {};

driver.next = function() {
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

