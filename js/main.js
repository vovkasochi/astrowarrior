// ver. 0.1b
window.onload = init;

var gameMap;
var mapWidth = 600;
var mapHeight = 400;
var ctxMap;

//start game title
var gameTitle;
var ctxTitle;
var isTitle = false;
var titleStartY = -200;
var titleStartX = 200;
var titleFrameRate = 0;
var titleFrameRateSpeed = 0;



var bgMap1 = new Image();
bgMap1.src = 'images/bgs1.png';

var bgMap2 = new Image();
bgMap2.src = 'images/bgs2.png';

var mapX1 = 0;
var mapX2 = mapWidth;

var velocityBg = 4;

var ship;
var ctxShip;
var shipImg = new Image();
shipImg.src = 'images/sprites/sprites.png'
var player;
var shipFrameStep = 0;
var shipInc = 0;

var engine;
var shipEngine;
var ctxEngine;
var engineInc = 0;
var engineFrameStep = 0;

var asteroid;
var ctxEnemy;

var gameOver;
var ctxGO;
var goX = 120;
var goY = -100;
var goSpeed = 10;

var enemies = [];
var renderInterval;
var renderDelay = 1000;
var renderAmount = 6;

var standartDamage = 10;

var pause = false;

var splashObj;
var splash;
var ctxSplash;
var splashSpeedScene = 0;
var frameStep = 0;

var score;
var ctxScore;

// POINTS
var pointSheet;
var ctxPoint;
var points = [];
var spriteSheet = new Image();
spriteSheet.src = "images/sprites/spritesheet2.png";
var pointFrameRate = 0;
var pointSceneSpeed = 0;

var pointSplashFrameRate = 0;
var pointSplashSceneSpeed = 0;

//Shield
var shieldSheet;
var ctxShield;
var shields = [];
var shieldFrameRate = 0;
var shieldFrameRateSpeed = 0;
var shieldUpDelay = 5000;
var shieldSplashFrameRate = 0;
var shieldSplashFrameRateSpeed = 0;

//information
var infor;
var ctxInfo;
var startFontInfoValue = 20;
var infoFrameSpeed = 0;

//speed
var enemieSpeedMin = 1;
var enemieSpeedMax = 3;
var pointSpeed = 2;
var playerSpeed = 2;
var splashSpeed = 4;
var shieldSpeed = 2;

//respown
shieldRespownDelay = 20000;
pointRespownDelay = 5000;


var isPlaying;

var requestAF = window.requestAnimationFrame || 
                window.webkitRequestAnimationFrame ||
                window.mozRequestnimationFrame ||
                window.oRequestnimationFrame ||
                window.msRequestnimationFrame;


function init() {
	gameTitle = document.getElementById("startGameTitle");
	ctxTitle = gameTitle.getContext("2d");
	gameTitle.width = mapWidth;
	gameTitle.height = mapHeight;

	gameMap = document.getElementById("gameMap");
	ctxMap = gameMap.getContext('2d');
	gameMap.width = mapWidth;
	gameMap.height = mapHeight;

	ship = document.getElementById("shipBlock");
	ctxShip = ship.getContext('2d');
	ship.width = mapWidth;
	ship.height = mapHeight;

	shipEngine = document.getElementById("shipEngineBlock");
	ctxEngine = shipEngine.getContext('2d');
	shipEngine.width = mapWidth;
	shipEngine.height = mapHeight;

	asteroid = document.getElementById("enemyShip");
	ctxEnemy = asteroid.getContext('2d');
	asteroid.width = mapWidth;
	asteroid.height = mapHeight;

	splash = document.getElementById("enemySplash");
	ctxSplash = splash.getContext('2d');
	splash.width = mapWidth;
	splash.height = mapHeight;

	pointSheet = document.getElementById("pointSheet");
	ctxPoint = pointSheet.getContext("2d");
	pointSheet.width = mapWidth;
	pointSheet.height = mapHeight;

	shieldSheet = document.getElementById("shieldSheet");
	ctxShield = shieldSheet.getContext("2d");
	shieldSheet.width = mapWidth;
	shieldSheet.height = mapHeight;

	score = document.getElementById("score");
	ctxScore = score.getContext('2d');
	score.width = mapWidth;
	score.height = mapHeight;

	infor = document.getElementById("informationLayer");
	ctxInfo = infor.getContext("2d");
	infor.width = mapWidth;
	infor.height = mapHeight;

	gameOver = document.getElementById("gameOverScreen");
	ctxGO = gameOver.getContext("2d");
	gameOver.width = mapWidth;
	gameOver.height = mapHeight;

	renderGameObjects();
	

	titleStart();
	//gameStart();
}

function startapp() {
	if(isTitle) {
		titleStop();
		clearCtxTitle();
		gameStart();
	}
}

function titleLoop() {
	if(isTitle) {
		drawTitle();
		requestAF( titleLoop )
	}
}

function titleStart() {
	isTitle = true;
	startKeyboardListeners();
	titleLoop();
}

function titleStop() {
	isTitle = false;
}

function renderGameObjects() {
	player = new Player();
	engine = new Engine();
	splashObj = new Splash();

	renderPoint();
	renderShield();
	renderEnemies(renderAmount);
}

function startKeyboardListeners() {
	document.addEventListener("keydown", listenKeydown, false);
	document.addEventListener("keyup", listenKeyup, false);
}

function gameLoop() {
	if (isPlaying) {
		draw();
		gameUpdate();
		requestAF( gameLoop );
	}
}

function gameStart() {
	isPlaying = true;
	startKeyboardListeners();
	gameLoop();
}

function gameStop() {
	isPlaying = false;
}

function gamePaused() {
	if(pause) {
		pause = false;
		gameStart();	
	} else {
		pause = true;
		gameStop();
		pauseInformation();
	}
	
}

function gameUpdate() {
	updateBackground();
	drawSpace();
	player.update();
	updateScore()
	splashObj.update();
	updatePoints();
	updateShields();
	updateEnemies();
}

function pauseInformation() {
	ctxScore.clearRect(0, 0, mapWidth, mapHeight);
	ctxScore.fillStyle = "rgba(0, 0, 0, 0.7)";
	ctxScore.fillRect(0, 0, mapWidth, mapHeight);
	ctxScore.fillStyle = "#450058";
    ctxScore.font = "bold 40pt Arial";
	ctxScore.fillText("PAUSED", 190, 210);
	ctxScore.strokeStyle = "#FF0000";
    ctxScore.font = "bold 40pt Arial";
	ctxScore.strokeText("PAUSED", 190, 210);
}

function gameOverInformation() {
	ctxScore.clearRect(0, 0, mapWidth, mapHeight);
	ctxScore.fillStyle = "#4E4758";
	ctxScore.fillRect(0, 0, mapWidth, mapHeight);
}

function gameOverScreenDraw() {
	if(player.gameOver) {
		document.removeEventListener("keydown", listenKeydown, false);
	    document.removeEventListener("keyup", listenKeyup, false);

		ctxGO.clearRect(0, 0, mapWidth, mapHeight);
		ctxGO.fillStyle = "#45075A";
		ctxGO.font = "bold 48pt Arial";
		ctxGO.fillText("GAME OVER", 110, 200);
		ctxGO.strokeStyle = "#9A86CA";
		ctxGO.font = "bold 45pt Arial";
		ctxGO.strokeText("GAME OVER", 120, 200);
		ctxGO.fillStyle = "#D5D3D3";
		ctxGO.font = "bold 15pt Arial";
		ctxGO.fillText("Press F5 for RESTART", 200, 250);
	}
}

function updateScore() {
	ctxScore.clearRect(0, 0, mapWidth, mapHeight);
	ctxScore.fillStyle = "rgba(78, 71, 88, 0.5)";
	ctxScore.fillRect(0, 0, mapWidth, 20);

	ctxScore.fillStyle = "#15CA00";
    ctxScore.font = "bold 10pt Arial";
	ctxScore.fillText("Shields : " + player.health + "%", 10, 15);
	
	ctxScore.fillStyle = "#FFB93A";
	ctxScore.fillText("Score : " + player.score, 120, 15);
	
	ctxScore.fillStyle = "#4C5FFF";
	ctxScore.fillText("Special : " + player.special, 200, 15);
}

function updateEnemies() {
	for(var i = 1; i < enemies.length; i++) {	
		enemies[i].update();
	}
}

function updatePoints() {
	for(var i = 0; i < points.length; i++) {
		points[i].update();
	}
}

function updateShields() {
	for(var i = 0; i < shields.length; i++) {
		shields[i].update();
	}
}

function updateBackground() {
	
	mapX1 -= velocityBg;
	mapX2 -= velocityBg;

	if(mapX1 + mapWidth < 0) {
	   mapX1 = mapWidth - 10;
	}
	if(mapX2 + mapWidth < 0) {
	   mapX2 = mapWidth - 10;
	}

}

function getRandom(min, max) {
	return Math.floor( Math.random() * (max - min + 1) ) + min;
}

function renderEnemies(count) {
	for(var i = 0; i < count; i++  ) {
		enemies[i] = new Enemy();
	}
}

function renderPoint() {
	for(var i = 0; i < 1; i++) {
		points[i] = new Point();
	}
}

function renderShield() {
	for(var i = 0; i < 1; i++) {
		shields[i] = new Shield();
	}
}

function startTimeoutPoints() {
	setTimeout(function() { renderPoint() }, pointRespownDelay);
}

function startTimeoutShields() {
	setTimeout(function() { renderShield() }, shieldRespownDelay);
}

function isObjectCrossing(obj1, obj2) {
	if(obj1.cordX >= obj2.cordX &&
	   obj1.cordY >= obj2.cordY &&
	   obj1.cordX <= obj2.cordX + obj2.width &&
	   obj1.cordY <= obj2.cordY + obj2.height ||
	   obj1.cordX <= obj2.cordX &&
	   obj1.cordX + obj1.width >= obj2.cordX &&
	   obj1.cordY <= obj2.cordY &&
	   obj1.cordY + obj1.height >= obj2.cordY) {
			return true;
	} else {
			return false;
	}
}

function playerLevelUp() {
	velocityBg += 2;
	enemieSpeedMin += 1;
	enemieSpeedMax += 1;
	player.speed += 1;
	splashSpeed += 1;
	pointSpeed += 1;
	player.score += 10;
	player.health = 100;

	for(var i = 0; i < enemies.length; i++) {
		enemies[i].speed += 1;
	}

	for(var i = 0; i < points.length; i++) {
		points[i].speed += 1;
	}

}

//GET SPEED FOR OBJECTS
function getEnemieSpeed() {
	return getRandom(enemieSpeedMin, enemieSpeedMax);
}

function getPlayerSpeed() {
	return playerSpeed;
}

function getSplashSpeed() {
	return splashSpeed;
}

function getPointSpeed() {
	return pointSpeed;
}

function getShieldSpeed() {
	return shieldSpeed;
}



function speedDownAll() {
	velocityBg = 0;
	player.speed = 0;
	player.cordX = -50;
	player.cordY = -50;
	player.gameOver = true;
}

function replayGame() {
	velocityBg = 4;
	player.speed = 2;
	player.cordX = 40;
	player.cordY = 180;
}




//************
//** Objects
//************

function Shield() {
	this.cordX = mapWidth*2;
	this.cordY = getRandom(0, mapHeight);
	this.srcX = 0;
	this.srcY = 50;
	this.width = 25;
	this.height = 25;
	this.speed = getShieldSpeed();
	this.active = true;
}

Shield.prototype.draw = function() {
	if(this.srcX + shieldFrameRate < 210) {
	  if(shieldFrameRateSpeed < 10) {
		  ctxShield.drawImage(spriteSheet, this.srcX + shieldFrameRate, this.srcY, this.width, this.height,
		         	    				   this.cordX, this.cordY, this.width, this.height);
		  shieldFrameRateSpeed += 1;
	  } else {

	  	  ctxShield.drawImage(spriteSheet, this.srcX + shieldFrameRate, this.srcY, this.width, this.height,
		         	    				   this.cordX, this.cordY, this.width, this.height);
	  	  shieldFrameRateSpeed = 0;
	  	  shieldFrameRate += 30;
	  }
	} else {
		shieldFrameRate = 0;
	}	
}

Shield.prototype.update = function() {
	this.move();
}

Shield.prototype.move = function() {
	if(this.cordX > -30) {
		this.cordX -= this.speed;
	} else {
		this.destroy();
	}
}

Shield.prototype.destroy = function() {
	this.active = false;
	shields.splice(shields.indexOf(this), 1);
	startTimeoutShields();
}

function Point() {
	this.cordX = mapWidth + 50;
	this.cordY = getRandom(0, mapHeight);
	this.srcX = 0;
	this.srcY = 0;
	this.width = 10;
	this.height = 15;
	this.speed = getPointSpeed();
	this.active = true;
}

Point.prototype.draw = function() {
	if(this.srcX + pointFrameRate < 120) {
		if(pointSceneSpeed < 5) {
			ctxPoint.drawImage(spriteSheet, this.srcX + pointFrameRate, this.srcY, this.width, this.height,
			    						this.cordX, this.cordY, this.width, this.height);
			pointSceneSpeed += 1;
		} else {
			ctxPoint.drawImage(spriteSheet, this.srcX + pointFrameRate, this.srcY, this.width, this.height,
			    						this.cordX, this.cordY, this.width, this.height);
			pointFrameRate += 10;
			pointSceneSpeed = 0;
		}
	} else {
		pointFrameRate = 0;
	}
}

Point.prototype.destroy = function() {
	this.active = false;
	points.splice(points.indexOf(this), 1);
	startTimeoutPoints();
}

Point.prototype.move = function() {
	if(this.cordX > -20) {
		this.cordX -= this.speed;
	} else {
		this.destroy();
	}
}

Point.prototype.update = function() {
	this.move();
}





function Splash() {
	this.cordX;
	this.cordY;
	this.width = 25;
	this.height = 25;
	this.srcX = 0;
	this.srcY = 100;
	this.speed = getSplashSpeed();
	this.frame = 4;
}

Splash.prototype.update = function() {
	if(player.isSplashed) {
		this.move();
	}
}

Splash.prototype.move = function() {
	if(player.isSplashed) {
	  if(this.cordX > -20) {
	      this.cordX -= this.speed;
	  } 
	}
}

Splash.prototype.draw = function() {
	if(player.isSplashed) {
		if(frameStep < 270) {
			if(splashSpeedScene < 4) {
				ctxSplash.clearRect(0, 0, mapWidth, mapHeight);
				ctxSplash.drawImage(shipImg, this.srcX + frameStep, this.srcY, this.width, this.height, 
		        	                	     this.cordX, this.cordY, this.width, this.height);
				splashSpeedScene += 1;
			} else {
				ctxSplash.clearRect(0, 0, mapWidth, mapHeight);
				ctxSplash.drawImage(shipImg, this.srcX + frameStep, this.srcY, this.width, this.height, 
		        	                	     this.cordX, this.cordY, this.width, this.height);
	  			frameStep += 25;
	  		}
	  	} else {
	  		splashSpeedScene = 0;
	  		player.isSplashed = false;
	  		frameStep = 0;
	  	}
	}	
}





function Enemy() {
	this.width = 35;
	this.height = 26;
	this.srcX = 0;
	this.srcY = 37;
	this.cordX = mapWidth;
	this.cordY = getRandom(0, 400);
	
	this.direction = getRandom(1, 4);
	this.speed = getEnemieSpeed();
	this.score = 0;
}

Enemy.prototype.draw = function() {
	ctxEnemy.drawImage(shipImg, this.srcX, this.srcY, this.width, this.height, 
		                       this.cordX, this.cordY, this.width, this.height);
	
}

Enemy.prototype.update = function() {
	if (this.cordX > -35 ) {
		this.move();
	} else {
		this.cordX = mapWidth;
		this.cordY = getRandom(10, 400);
		this.speed = getRandom(2, 5);
	}
}

Enemy.prototype.destroy = function() {
	enemies.splice(enemies.indexOf(this), 1);
	var newAster = new Enemy();
	enemies.push( newAster );
}


Enemy.prototype.move = function() {
	if (this.direction == 1) {
		this.cordX -= this.speed;
		this.cordY -= this.speed / 25 ;
	}
	if (this.direction == 2) {
		this.cordX -= this.speed;
		this.cordY += this.speed / 25;
	}
	if (this.direction == 3) {
		this.cordX -= this.speed;
		this.cordY += this.speed / 10;
	}
	if (this.direction == 4) {
		this.cordX -= this.speed;
		this.cordY -= this.speed / 10;
	}

}





function Engine() {
	this.width = 20;
	this.height = 10;
	this.srcX = 0;
	this.srcY = 75;
	this.cordX = player.cordX - this.width;
	this.cordY = (player.cordY + (player.height / 2)) - (this.height / 2);
}

Engine.prototype.draw = function() {
	//if(!player.isSplashed) {
		if(engineInc < 5 && engineFrameStep < 125) {
			ctxEngine.clearRect(0, 0, mapWidth, mapHeight);
			ctxEngine.drawImage(shipImg, this.srcX + engineFrameStep, this.srcY, this.width, this.height, 
		                                 this.cordX, this.cordY, this.width, this.height);

			engineFrameStep += 25;
			engineInc += 1;
		} else {

			engineInc = 0;
			engineFrameStep = 0;
		}
	//}
}

Engine.prototype.clear = function() {
	clearCtxEngine();
}





function Player() {
	this.width = 30;
	this.height = 35;
	this.srcX = 0;
	this.srcY = 0;
	this.cordX = 40;
	this.cordY = 180;
	
	this.isUp = false;
	this.isDown = false;
	this.isLeft = false;
	this.isRight = false;

	this.speed = getPlayerSpeed();
	this.health = 100;
	this.score = 0;
	this.special = "N/A";

	this.isSplashed = false;
	this.isPointUp = false;
	this.isShieldUp = false;
	this.isLevelUp = false;
	this.gameOver = false;
}

Player.prototype.draw = function() {
	clearCtxShip();
		ctxShip.drawImage(shipImg, this.srcX, this.srcY, this.width, this.height, 
				                this.cordX, this.cordY, this.width, this.height);
}

Player.prototype.checkEnemieCollision = function() {
	for(var i = 0; i < enemies.length; i++ ) {
		if( isObjectCrossing(this, enemies[i]) ) {
			
			this.isSplashed = true;
			this.shipSplashing();
			enemies[i].destroy();
			this.getDamage();
		}
	}
}

Player.prototype.checkPointsCollision = function() {
	for(var i = 0; i < points.length; i++) {
		if(isObjectCrossing(this, points[i])) {
			this.getScore();
			this.isPointUp = true;
			points[i].destroy();
		}
	}
}

Player.prototype.shieldDownStatus = function() {
	this.special = "N/A";
	this.isShieldUp = false;
}

Player.prototype.shieldUpStatus = function() {
	this.special = "Shield Up!";

	setTimeout(function() { player.shieldDownStatus() }, shieldUpDelay);
}

Player.prototype.checkShieldsCollision = function() {
	for(var i = 0; i < shields.length; i++) {
		if(isObjectCrossing(this, shields[i])) {
			//Activate 5s
			this.isShieldUp = true;
			this.shieldUpStatus();
			shields[i].destroy();
		}
	}
}

Player.prototype.checkScorePoints = function() {
	if(this.score > 0 && this.score % 100 == 0) {
		this.isLevelUp = true;
		playerLevelUp();
	}
}

Player.prototype.update = function() {
	this.move();
	this.checkEnemieCollision();
	this.checkPointsCollision();
	this.checkShieldsCollision();
	this.checkScorePoints();
}

Player.prototype.getScore = function() {
	this.score += 10;
}

Player.prototype.getDamage = function() {
	if(!this.isShieldUp) {
		if (this.health > 0) {
			this.health -= standartDamage;
		} else {
			speedDownAll();
		}
	}
}

Player.prototype.shipSplashing = function() {
	splashObj.cordX = this.cordX + (this.width/2);
	splashObj.cordY = this.cordY + (this.height / 4);
}

Player.prototype.move = function() {
	if(this.isUp) {
		if(this.cordY - this.speed > 0) {
			this.cordY -= this.speed;
		} else {
			this.cordY = mapHeight + this.speed;
		}
	}
	if(this.isDown) {
		if(this.cordY + this.speed < mapHeight) {
			this.cordY += this.speed;
		} else {
			this.cordY = 0 - this.speed*2;
		}
	}
	if(this.isLeft) {
		if(this.cordX - this.speed > 0) {
			this.cordX -= this.speed;
		}
	}
	if(this.isRight) {
		if(this.cordX + this.speed < 560) {
			this.cordX += this.speed;
		}
	}

	engine.cordX = this.cordX - engine.width + 2;
	engine.cordY = (this.cordY + (this.height / 2)) - (engine.height / 2);
}


//*******************
//** DRAWING SCENE
//*******************

function draw() {
	player.draw();
	engine.draw();
	enemiesDraw();
	splashObj.draw();
	pointsDraw();
	pointsInsideDrawAnim();
	shieldsDraw();
	shieldInsideDrawAnim();
	levelUpAnimation();
	gameOverScreenDraw()
}

function drawSpace() {
	ctxMap.clearRect(0, 0, mapWidth, mapHeight);
	ctxMap.drawImage(bgMap1, 0, 0, 600, 400, mapX1, 0, mapWidth, mapHeight);
	ctxMap.drawImage(bgMap2, 0, 0, 600, 400, mapX2, 0, mapWidth, mapHeight);
}


function pointsDraw() {
	clearCtxPoints();
	for(var i = 0; i < points.length; i++) {
		points[i].draw();
	}
}

function shieldsDraw() {
	clearCtxShield();
	for(var i = 0; i < shields.length; i++) {
		shields[i].draw();
	}
}

function enemiesDraw() {
	clearCtxEnemy();

	for (var i = 1; i < enemies.length; i++) {
		enemies[i].draw();
	}
}


//********************
//** ANIMATION
//********************

function drawTitle() {
	if(titleFrameRate < 1) {
		clearCtxTitle();
		if(titleFrameRateSpeed < 7) {
			ctxTitle.fillStyle = "rgba(201, 203, 204, " + titleFrameRate + ")";
			ctxTitle.font = "bold 15pt Georgia"
			ctxTitle.fillText("Press ENTER for start", 180, 300);

			titleFrameRateSpeed += 1;
		} else { 
			ctxTitle.fillStyle = "rgba(201, 203, 204, " + titleFrameRate + ")";
			ctxTitle.font = "bold 15pt Georgia"
			ctxTitle.fillText("Press ENTER for start", 180, 300);
			
			titleFrameRate += 0.1;
			titleFrameRateSpeed = 0;
		}
	} else {
		//titleFrameRate = 0.7;
	}
	ctxTitle.drawImage(spriteSheet, 0, 200, 160, 100,
									130, 100, 320, 200);
}

function shieldInsideDrawAnim() {
	if(player.isShieldUp) {
		clearCtxShield();
		//ctxShield.fillStyle = "rgba(255, 57, 218, 0.3)";
		//ctxShield.fillRect(player.cordX, player.cordY, player.width, player.height);
		if(shieldSplashFrameRate + 20 < 100) {
			if(shieldSplashFrameRateSpeed < 5) {
				ctxShield.drawImage(spriteSheet, 0 + shieldSplashFrameRate, 100, 10, 45, 
					                             player.cordX + player.width, player.cordY, 10, 45);

				shieldSplashFrameRateSpeed += 1;
			} else {
				ctxShield.drawImage(spriteSheet, 0 + shieldSplashFrameRate, 100, 10, 45, 
					                             player.cordX + player.width, player.cordY, 10, 45);
				shieldSplashFrameRateSpeed = 0;
				shieldSplashFrameRate += 10;				
			}
		} else {
			shieldSplashFrameRate = 0;
		}
	}
}


function pointsInsideDrawAnim() {
  if(player.isPointUp) {
		clearCtxPoints();
		if(pointSplashFrameRate + 20 < 130) {
			if(pointSplashSceneSpeed < 5) {
				ctxPoint.drawImage(spriteSheet, 0 + pointSplashFrameRate, 20, 20, 20,
			    							player.cordX + 5, player.cordY + 7, 20, 20);
				pointSplashSceneSpeed += 1;
			} else {
				ctxPoint.drawImage(spriteSheet, 0 + pointSplashFrameRate, 20, 20, 20,
			    						player.cordX + 5, player.cordY + 7, 20, 20);
				pointSplashFrameRate += 10;
				pointSplashSceneSpeed = 0;
			}
		} else {
			pointSplashFrameRate = 0;
			player.isPointUp = false;
		}
	}
}

function levelUpAnimation() {
	if(player.isLevelUp) {
		if(startFontInfoValue < 180) {
			if(infoFrameSpeed < 3) {
				ctxInfo.clearRect(0, 0, mapWidth, mapHeight);
				ctxInfo.strokeStyle = "rgba(179, 0, 255, 0.4)";
				ctxInfo.font = "bold " + startFontInfoValue + "pt Arial";
				ctxInfo.strokeText("LEVEL UP", 100, 200);

				infoFrameSpeed += 1;
			
			} else {
				ctxInfo.clearRect(0, 0, mapWidth, mapHeight);
				ctxInfo.strokeStyle = "rgba(179, 0, 255, 0.4)";
				ctxInfo.font = "bold " + startFontInfoValue + "pt Arial";
				ctxInfo.strokeText("LEVEL UP", 100, 200);

				startFontInfoValue += 5;
				infoFrameSpeed = 0;
		    }

		} else {
			ctxInfo.clearRect(0, 0, mapWidth, mapHeight);
			player.isLevelUp = false;
		}

	}
}


//******************
//** CLEAR SCENE
//******************


function clearCtxEngine() {
	ctxEngine.clearRect(0, 0, mapWidth, mapHeight);
}

function clearCtxShip() {
	ctxShip.clearRect(0, 0, gameMap.width, gameMap.height);
}

function clearCtxEnemy() {
	ctxEnemy.clearRect(0, 0, gameMap.width, gameMap.height);
}

function clearCtxPoints() {
	ctxPoint.clearRect(0, 0, gameMap.width, gameMap.height);
}

function clearCtxShield() {
	ctxShield.clearRect(0, 0, gameMap.width, gameMap.height);
}

function clearCtxTitle() {
	ctxTitle.clearRect(0, 0, mapWidth, mapHeight);
}

//****************************
//** SCAN KEYBOARD KEYCHAR
//****************************

function listenKeydown(e) {
	var keyID = e.keyCode || e.which;
	var keyChar = String.fromCharCode(keyID);

	if(keyChar == "W" || e.keyCode == "38") {
		player.isUp = true;
		e.preventDefault();
	}
	if(keyChar == "S" || e.keyCode == "40") {
		player.isDown = true;
		e.preventDefault();
	}
	if(keyChar == "A" || e.keyCode == "37") {
		player.isLeft = true;
		e.preventDefault();
	}
	if(keyChar == "D" || e.keyCode == "39") {
		player.isRight = true;
		e.preventDefault();
	}
	if(keyChar == "P") {
		gamePaused();
	}
	if(e.keyCode == "13") {
		startapp();
	}

}

function listenKeyup(e) {
	var keyID = e.keyCode || e.which;
	var keyChar = String.fromCharCode(keyID);

	if(keyChar == "W" || e.keyCode == "38") {
		player.isUp = false;
		e.preventDefault();
	}
	if(keyChar == "S" || e.keyCode == "40") {
		player.isDown = false;
		e.preventDefault();
	}
	if(keyChar == "A" || e.keyCode == "37") {
		player.isLeft = false;
		e.preventDefault();
	}
	if(keyChar == "D" || e.keyCode == "39") {
		player.isRight = false;
		e.preventDefault();
	}

}

