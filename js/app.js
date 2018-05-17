////////////////////////////////
// By Verveyko Alexander 2015 //
////////////////////////////////

var canvas, ctx;
var ball, pad, ui;
var arrBricks = [];
var timer;
var gameStarted = false;

var startGame = function() {
	//Создаем канвас
	canvas = document.createElement("canvas");
	ctx = canvas.getContext("2d");
	canvas.width = 800;
	canvas.height = 600;
	document.body.appendChild(canvas);

	//Обрабатываем управление
	document.body.onkeydown = processKey;
	window.onmousemove = handleMouseMove;

	//Создаем биту и мячик
	pad = new TPad();
	ball = new TBall();
	ui = new TGameUI();

	//Инициализируем кирпичики
	initArrBricks();

	timer = setInterval(gameLoop, 1000/50);
};

var processKey = function (e) {				
	if (e.keyCode == 39) {
		pad.moveRight();	
	} else if (e.keyCode == 37) {
		pad.moveLeft();
	} else if (e.keyCode == 32) {
		//Запускаем игровой цикл
		gameStarted = true;
	};
};

var handleMouseMove = function (event) {
	event = event || window.event; //IE-ism
	pad.setPosition(event.clientX);
};

var initArrBricks = function () {
	//Генерируем демо уровень
	for (var i = 50; i <= 700; i+=50) {
		//line 1
		var tmpBrick = new TBrick(i,100, 1);
		arrBricks.push(tmpBrick);
		//line 2
		var tmpBrick = new TBrick(i,120, 1);
		arrBricks.push(tmpBrick);
		//line 3
		var tmpBrick = new TBrick(i,140, 2);
		arrBricks.push(tmpBrick);
		//line 4
		var tmpBrick = new TBrick(i,160, 2);
		arrBricks.push(tmpBrick);
		//line 5
		var tmpBrick = new TBrick(i,180, 3);
		arrBricks.push(tmpBrick);
		//line 6
		var tmpBrick = new TBrick(i,200, 3);
		arrBricks.push(tmpBrick);
	};
};

var gameLoop = function() {
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	ball.сolision();
	
	if (gameStarted) {
		ball.move();
	} else {
		ctx.strokeStyle = "green";
		ctx.fillStyle = "green";
		ctx.font = "24pt Arial";
		ctx.fillText("Press space to start game.", 200, 400);
	};

	ball.draw();
	pad.draw();
	ui.draw();

	//Отрисовать все кирпичики
	for (var i = 0; i < arrBricks.length; i++) {
		arrBricks[i].draw();
	};
	//Проверяем, уничтожены ли все кирпичики
	if (!arrBricks.length) {
		//Вы победили!
		ui.YouWin();
	};
};

var TGameUI = function() {
	this.score = 0;
	this.lives = 3;
	
	this.heartStr = function () {
		var drawStr = '';
		for (var i = 0; i < this.lives; i++) {
			drawStr += '♥'
		};
		return drawStr;
	};

	this.addScore = function () {
		this.score += 10;
	};

	this.liveLost = function () {
		this.lives -= 1;
		if (this.lives === 0) {
			//Game Over!
			this.GameOver();
		};
	};

	this.GameOver = function () {
		clearInterval(timer);
		ctx.strokeStyle = "green";
		ctx.fillStyle = "green";
		ctx.font = "24pt Arial";
		ctx.fillText("Game Over!", 300, 300);
	};

	this.YouWin = function () {
		clearInterval(timer);
		ctx.strokeStyle = "green";
		ctx.fillStyle = "green";
		ctx.font = "24pt Arial";
		ctx.fillText("You WIN!", 300, 300);
	};

	this.draw = function () {
		ctx.strokeStyle = "green";
		ctx.fillStyle = "green";
		ctx.font = "14pt Arial";
		ctx.fillText("Score: " + this.score, 10, 20);
		ctx.fillText(this.heartStr(), 200, 20);
		ctx.strokeRect(0, 0, canvas.width, canvas.height);
	};
};

var TBrick = function(x, y, style) {
	this.x = x;
	this.y = y;
	this.width = 45;
	this.height = 15;
	this.style = style || 1;

	this.draw = function () {
		//Отрисовка кирпичика
		switch (this.style) {
			case 1:
				ctx.fillStyle = "#005909";		
				break
			case 2:
				ctx.fillStyle = "#009C10";
				break
			case 3:
				ctx.fillStyle = "#00D415";
				break
			case 4:
				ctx.fillStyle = "#00FF1A";
		};
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.strokeStyle = "yellow";
		ctx.strokeRect(this.x, this.y, this.width, this.height);
	};

	this.ballColision = function () {
		//Проверяем по Y
		if (ball.y - ball.radius <= this.y + this.height && ball.y + ball.radius >= this.y ) {
			//Проверяем по X
			if (ball.x + ball.radius >= this.x && ball.x - ball.radius <= this.x + this.width) {
				//Попал
				return true;
			};
		};
	};
};

var TPad = function(width, height, speed) {
	this.width 	= 	width 	|| 100;
	this.height = 	height 	|| 20;
	this.speed 	= 	speed 	|| 10;
	this.x 		=	canvas.width / 2 - this.width / 2;
	this.y 		=	canvas.height - this.height * 2;
	
	this.moveLeft = function () {
		this.x -= this.speed;
		this.wallColision();
	};

	this.moveRight = function () {
		this.x += this.speed;
		this.wallColision();
	};

	this.wallColision = function () {
		//Ограничиваем слева\справа
		if (this.x + this.width > canvas.width) {
			this.x = canvas.width - this.width;
		} else if (this.x < 0) {
			this.x = 0;
		};
	};

	this.setPosition = function (mouseX) {
		this.x = mouseX - (this.width / 2);
		this.wallColision();
	};

	this.draw = function () {
		ctx.fillStyle = "green";
		ctx.fillRect(this.x, this.y, this.width, this.height);
	};
};

var TBall = function(radius, speed) {
	this.radius 	= 	radius 	|| 10;
	this.speed 		= 	speed 	|| 5;
	this.x 			= 	canvas.width / 2;
	this.y 			= 	canvas.height / 2;
	this.vectorX 	= 	this.speed;
	this.vectorY 	=	-this.speed;
	
	this.сolision = function() {
		if (this.x + this.radius >= canvas.width || this.x - this.radius <= 0) {
			this.vectorX = -this.vectorX;
		};
		if (this.y - this.radius <= 0) {
			this.vectorY = -this.vectorY;
		};
		//Коллизия с битой
		if (this.y + this.radius >= pad.y) {
			if (this.x >= pad.x && this.x <= pad.x + pad.width) {
				if (this.x < (pad.x + pad.width /2)) {
					//Ударился в левую часть
					this.vectorX = -(((pad.x + pad.width/2) - this.x) / 5);
				} else {
					//В правую часть
					this.vectorX = (this.x - (pad.x + pad.width/2)) / 5;
				};
					this.vectorY = -this.vectorY;
			};
		};
		//Шарик коснулся низа экрана
		if (this.y + this.radius >= canvas.height) {
			this.vectorY = -this.vectorY;
			ui.liveLost();
		};
		//Шарик коснулся кирпичика
		for (var i = 0; i < arrBricks.length; i++) {
			if (arrBricks[i].ballColision()) {
	 			ball.vectorY = -ball.vectorY;
	 			arrBricks.splice(i,1);
	 			ui.addScore();
			};
		};
	};

	this.draw = function () {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
		ctx.fillStyle = "green";
		ctx.fill();
	};

	this.move = function () {
		this.vectorX = this.vectorX;
		this.x += this.vectorX;
		this.y += this.vectorY;
	};
};
		
