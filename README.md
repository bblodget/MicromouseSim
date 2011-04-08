A HTML5 Micromouse simulator
============================

This web app can be used to test Micromouse algorithms in your
web browser.  It exposes a [JavaScript Mouse
API](https://github.com/bblodget/MicromouseSim/wiki/Mouse-API)
for controlling a simulated mouse running in a simulated maze.
You can type your mouse driver code directly in a textbox on the
web page.

There are a large number of mazes to test your mouse algorithm
.  These mazes have been used in Micromouse competitions.  The
source of these mazes are

[http://www.tcp4me.com/mmr/mazes/](http://www.tcp4me.com/mmr/mazes/)

Known Issues
------------

* Currently there is no way to save the mouse
driver code you type from the application.  So if you want to
save it you should cut and paste it to a file on your local
machine.  
* There is no error checking of the JavaScript mouse driver
code.  If you have errors in your code you many not find out
until the code is running.  If the page freezes up you may have
to reload which may cause you to loose your changes.

This applicaiton is all client side JavaScript.  The best bet
might be to download and run it locally.  This way you can edit
and save your mouse driver code locally.  It is also helpful to
use Firefox's [Firebug](http://getfirebug.com/) extension for
debugging.

Online Demo
-----------

There is an online demo running at 

[http://bblodget.github.com/MicromouseSim](http://bblodget.github.com/MicromouseSim)

Download and run locally
------------------------

You can download the latest source via

	git clone https://bblodget@github.com/bblodget/MicromouseSim.git

Open the file MicromouseSim/index.html in Firefox or Safari.
Chrome's security model won't allow this application run
locally only from a web server.

License
-------

This program is free software: you can redistribute it and/or
modify it under the terms of the GNU General Public License as
published by the Free Software Foundation, either version 3 of
the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public
License along with this program.  If not, see
[http://www.gnu.org/licenses/](http://www.gnu.org/licenses/)

enjoy,

Brandon Blodget <blodget.sw@gmail.com>


