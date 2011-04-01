driver = {};

driver.next = function() {
	if (mouse.lookRight()) {
		mouse.right();
		mouse.fwd();
	} else if (mouse.lookForward()) {
		mouse.fwd();
	} else {
		mouse.left();
		mouse.fwd();
	}
}

