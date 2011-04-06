// Flood Fill Algorithm.

// clear the driver object.
driver = {};

// Gets called only when downloaded to the mouse
// Performs initialization
driver.load = function() {
    // default maze
    mouse.loadMaze("91japa1");
}

// Figure out next move.
// Gets called each iteration of the simulator.
driver.next = function() {
    var lval = 255;
    var ldir;

    if (mouse.isGoal()) {
        alert("Goal Reached!");
        mouse.stop();
        return;
    }

    // get the current flood values.
    mouse.memFlood();

    if (mouse.isPathFwd() ) {
        lval = mouse.memGetDataFwd();
        ldir = "F";
    }

    if (mouse.isPathLeft() ) {
        if (mouse.memGetDataLeft() < lval) {
            lval = mouse.memGetDataLeft();
            ldir = "L";
        }
    }

    if (mouse.isPathRight() ) {
        if (mouse.memGetDataRight() < lval) {
            lval = mouse.memGetDataRight();
            ldir = "R";
        }
    }

    if (mouse.isPathBack() ) {
        if (mouse.memGetDataBack() < lval) {
            lval = mouse.memGetDataBack();
            ldir = "B";
        }
    }


    switch (ldir) {
        case "F" :
            mouse.fwd();
            break;
        case "L" :
            mouse.left();
            mouse.fwd();
            break;
        case "R" :
            mouse.right();
            mouse.fwd();
            break;
        case "B" :
            mouse.left(2);
            mouse.fwd();
            break;
    }

}


