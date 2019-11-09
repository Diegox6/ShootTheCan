var canvas;
var width, height;
var canvasX, canvasY;
var g;
var interval;

var debugUI = false;

var cans = [new can(500, 10000/16, 0, -10, 0.05)];

var fireDelay = 0;
var maxFireDelay = 10;
var triggerReleased = true;

var score = 0;

// ## INIT GAME ##

function start() {
	canvas = document.getElementById("frame");

	canvas.width = 1000;
	canvas.height = canvas.width/8*5;

	width = canvas.width;
	height = canvas.height;

	canvasX = canvas.getBoundingClientRect().left;
	canvasY = canvas.getBoundingClientRect().top;
	window.addEventListener("resize", function(e) {
	  canvasX = canvas.getBoundingClientRect().left;
	  canvasY = canvas.getBoundingClientRect().top;
	});

	g = canvas.getContext("2d");
	interval = setInterval(update, 20);
}

// ## UPDATE AND RENDER ##

function update() {
	render();
	cans.forEach(function(e) {e.update()});
	if (isKeyPressed(68)) debugUI = !debugUI;
	clearKeyInput();
}

function render() {
	background("#CCC");
	
	g.font = "50px Consolas";
	g.fillStyle = "#222222"
	g.fillText(score, 500 - String(score).visualLength()*50/32, 500/8*5)
	
	cans.forEach(function(e) {e.show()});
	
	g.drawImage(sprite("res/img/crosshair.png"), mouse.x - 8, mouse.y - 8);
	//g.fillStyle = "#000000";
	//g.fillRect(mouse.x, mouse.y, 1, 1);
	
	if (mouse.click == 0 && triggerReleased && fireDelay <= 0) {
		shoot();
		triggerReleased = false;
	}
	if (fireDelay > 0) fireDelay--;
	if (mouse.click != 0) triggerReleased = true;
	
	if (debugUI) {
		g.fillStyle = "#444"
		g.font = "10px Consolas";
		g.fillText("KeyHeld: " + (heldKeys.length > 0 ? heldKeys : "none"), 5, 10);
		g.fillText("MouseClick: " + (mouse.click != -1 ? mouse.click : "none"), 5, 20);
		g.fillText("MousePos: " + mouse.x + " - " + mouse.y, 5, 30);
		g.fillText("FireDelay: " + fireDelay, 5, 40);
	}
}

// ## BACKGROUND METHOD ##

function background(c) {
	this.g.fillStyle = c;
	this.g.fillRect(0, 0, this.width, this.height);
}

// ## SPRITE FROM LOCAL IMAGE ##

function sprite(src) {
	var img = new Image();
	img.src = src;
	return img;
}

function shoot(x, y) {
	fireDelay = maxFireDelay;
	new Audio("res/sound/gunshot.wav").play();
	
	cans.forEach(function(e) {
		var vs = [
			[Math.cos(e.a)*10-Math.sin(e.a)*20+e.x,Math.sin(e.a)*10+Math.cos(e.a)*20+e.y],
			[Math.cos(e.a)*10+Math.sin(e.a)*20+e.x,Math.sin(e.a)*10-Math.cos(e.a)*20+e.y],
			[-Math.cos(e.a)*10+Math.sin(e.a)*20+e.x,-Math.sin(e.a)*10-Math.cos(e.a)*20+e.y],
			[-Math.cos(e.a)*10-Math.sin(e.a)*20+e.x,-Math.sin(e.a)*10+Math.cos(e.a)*20+e.y]
		];
		if (inside(mouse.x, mouse.y, vs)) {
			new Audio("res/sound/bang.wav").play();
			e.vx = random(-1,1);
			e.vy = random(-3,-1);
			e.va = random(-0.1, 0.1);
			score++;
		}
	});
}

function inside(x, y, vs) {
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
}

function random(a, b) {
	return Math.random()*(b-a)+a
}

String.prototype.visualLength = function() {
    var ruler = document.getElementById("ruler");
    ruler.innerHTML = this;
    return ruler.offsetWidth;
}