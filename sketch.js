/***********************************************************************************
  Sprite Navigation

  Simple use of the p5.play library
------------------------------------------------------------------------------------
	To use:
	Add this line to the index.html

  <script src="p5.timer.js"></script>
***********************************************************************************/
var titleFont, bodyFont, player, msgDiv, currentScreen;

var playerImg, playerName;


var screenManager;

var canvasWidth = 1200;
var canvasHeight = 700;

var northBound = (canvasHeight/2) - 300;
var southBound = (canvasHeight/2) + 290;
var eastBound = (canvasWidth/2) + 500;
var westBound = (canvasWidth/2) - 500;

var player2Img;

function preload() {
  titleFont = loadFont('assets/fonts/DelaGothicOne-Regular.ttf');
  bodyFont = loadFont('assets/fonts/Baloo2-Medium.ttf');
  playerImg = loadImage('assets/player/standingplayer1.png');
  player2Img = loadImage('assets/standing.png');
  playerName = 'Player';

  screenManager = new ScreenManager('data/screenMaster.csv');
  
}

incrementStartingScreens = function () {
  if(screenManager.currID === 'Character Screen') {
    currentScreen.removeHTML();
  }
  currentScreen = screenManager.updateScreen(currentScreen.nextID);
  if(screenManager.currID === 'Character Screen') {
    currentScreen.showHTML();
  }
}


setPlayer = function() {
  if(this.id === 'avatar1') {
    player.newIdleImage('standing', playerImg);
    player.newAnimation('walking','assets/player/playerwalk1.png', 
    'assets/player/playerwalk6.png');
    currentScreen.updateSelection('You\'ve selected Player 1.');
  } else {
    player.newIdleImage('standing', player2Img);
    currentScreen.updateSelection('You\'ve selected Player 2.');
  }
}

setName = function() {
  playerName = currentScreen.input.value();
  console.log(playerName);
  textAlign(RIGHT);
  fill('red');
  text('Your name is ' + playerName, 100, 200);
}

// Setup code goes here
function setup() {
  console.log(northBound);
  createCanvas(canvasWidth, canvasHeight);
  frameRate(45);

  player = new Player(playerName, width/2, height/2);
  player.sprite.scale = 0.8;
  player.sprite.debug = true;

  
  msgDiv = createDiv(
    '<div id = \'message\'></div>' + 
    '<div id = \'name\' class=\'npcName\'></div>' +
    '<div class=\'npcInstruction\'> Press \'e\' to continue conversation.');
  msgDiv.addClass('messageBox');
  msgDiv.hide();
  screenManager.setup(playerImg, player2Img, incrementStartingScreens, setName, setPlayer, bodyFont);
  currentScreen = screenManager.getCurrentScreen();
 }

// Draw code goes here
function draw() {
  // could draw a PNG file here
  background(0);

  if(screenManager.currID === 'Home Screen' || screenManager.currID === 'Character Screen') {
    currentScreen.draw();
    textFont(titleFont);
    
    if(screenManager.currID === 'Character Screen') {
      fill('#353535');
      text(currentScreen.title, width/2, 123);
      fill('white')
      text(currentScreen.title, width/2, 120);
      textSize(25);
      textFont(bodyFont);
      text(currentScreen.selectionText, width/2, 180);
    } else {
      fill('#353535');
      text(currentScreen.title, width/2, 183);
      fill('white')
      text(currentScreen.title, width/2, 180);
    }
  } 
  else {
    rectMode(CENTER);
    fill(currentScreen.bgColor);
    noStroke();
    rect(canvasWidth/2, canvasHeight/2, 1040, 650, 18);

    imageMode(CENTER);
    if(currentScreen.backgroundImg != null) {
      image(currentScreen.backgroundImg, canvasWidth/2, height/2);
    }

    currentScreen.draw();
    checkMovement();
    drawSprite(player.sprite);

    stroke(color(255,255,255));
    strokeWeight(2);
    fill(color(0,0,0,100));
    textAlign(LEFT);
    textFont(titleFont);
    textSize(25);
    text(screenManager.currID, westBound+10, northBound+20);
  }
}

// This will reset position
function keyPressed() {
  if(key === 'e') {
    let currNPCs = currentScreen.npcArray;
    currNPCs.forEach(e => {
      if(player.checkNPCOverlap(e) && e.isActive) {
        e.continueInteraction();
      }
    })
    // for(let i = 0; i < testScreen.npcs.length; i++) {
    //   if(player.checkNPCOverlap(testScreen.npcs[i]) && 
    //   testScreen.npcs[i].isActive) {
    //     testScreen.npcs[i].continueInteraction();
    //   } 
    // }
  }
}

function checkMovement() {
  player.checkCollision(currentScreen.walls);
  player.checkCollision(currentScreen.decoColliders);
  // player.checkCollision(currentScreen.npcs);
  // Check x movement
  if(keyIsDown(68) || keyIsDown(39)) {
    player.sprite.velocity.x = 10;
    player.sprite.mirrorX(1);
    player.changeAni('walking');
  }
  else if(keyIsDown(65) || keyIsDown(37)) {
    player.sprite.velocity.x = -10;
    player.sprite.mirrorX(-1);
    player.changeAni('walking')
  }
  else {
    player.sprite.velocity.x = 0;
    player.changeAni('standing');
  }

  // Check y movement
  if(keyIsDown(83) || keyIsDown(40)) {
    player.sprite.velocity.y = 10;
  }
  else if(keyIsDown(87) || keyIsDown(38)) {
    player.sprite.velocity.y = -10;
  }
  else {
    player.sprite.velocity.y = 0;
  }

  if (currentScreen.northNextScreen != null && 
    player.sprite.position.y < northBound) {
    currentScreen = screenManager.updateScreen(currentScreen.northNextScreen);
    adjustPlayerSize();
    player.sprite.position.y = southBound - 50;
  }

  if (currentScreen.southNextScreen != null && 
    player.sprite.position.y > southBound) {
      currentScreen = screenManager.updateScreen(currentScreen.southNextScreen);
      adjustPlayerSize();
      player.sprite.position.y = northBound + 50;
  }

  if (currentScreen.eastNextScreen != null && 
    player.sprite.position.x > eastBound) {
      currentScreen = screenManager.updateScreen(currentScreen.eastNextScreen);
      adjustPlayerSize();
      player.sprite.position.x = westBound + 50;
  } 

  if (currentScreen.westNextScreen != null && 
    player.sprite.position.x < westBound) {
      currentScreen = screenManager.updateScreen(currentScreen.westNextScreen);
      adjustPlayerSize();
      player.sprite.position.x = eastBound - 50;
  } 

  
}

function adjustPlayerSize() {
  if(screenManager.currID.startsWith('Memory Hall')) {
    player.sprite.scale = 0.7;
  }
  else if(screenManager.currID === 'Classroom') {
    player.sprite.scale = 0.7;
  }
  else {
    player.sprite.scale = 1.1;
  }
}
