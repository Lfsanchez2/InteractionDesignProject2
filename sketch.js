/***********************************************************************************
  Sprite Navigation

  Simple use of the p5.play library
------------------------------------------------------------------------------------
	To use:
	Add this line to the index.html

  <script src="p5.timer.js"></script>
***********************************************************************************/
var titleFont, bodyFont, player, wallGroup, msgDiv, screen;


var playerImg;
var homeScreen, testScreen, selectScreen, instructionScreen;

var npcArray = [];

var cnv;

var testTable;

var defaultGroup;

function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

function preload() {
  titleFont = loadFont('assets/fonts/DelaGothicOne-Regular.ttf');
  bodyFont = loadFont('assets/fonts/Baloo2-Medium.ttf');
  playerImg = loadImage('assets/standingplayer1.png');
  testScreen = new Screen();
  testScreen.loadAppearanceTable('data/Screen3NPCs/testNPCAppearance.csv',
  'data/Screen3NPCs/npcDialogue.csv');
  homeScreen = new HomeScreen();
  selectScreen = new SelectionScreen();
  instructionScreen = new InstructionScreen();
}

incrementScreen = function () {
  screen++;
}

setPlayer = function() {
  if(this.id === 0) {
    player.newIdleImage('standing', playerImg);
    player.newAnimation('walking','assets/playerwalk1.png', 'assets/playerwalk6.png');
  }
}

// Setup code goes here
function setup() {
  cnv = createCanvas(1200, 700);
  centerCanvas();
  frameRate(30);

  // wall1 = new Sprite('Wall1', 0, 100, 1400, 200);
  // wall1.sprite.debug = true;
  // wall2 = new Sprite('Wall2', 0, 600, 1400, 200);
  // wall2.sprite.debug = true;
  // wallGroup = new Group();
  // wallGroup.add(wall1.sprite);
  // wallGroup.add(wall2.sprite);
  defaultGroup = new Group();
  player = new Player('Luis', 100, height/2);
  
  player.sprite.debug = true;
  defaultGroup.add(player.sprite);

  testScreen.setup();
  homeScreen.setup(bodyFont, incrementScreen);
  selectScreen.setup(playerImg, setPlayer, incrementScreen);
  instructionScreen.setup(incrementScreen);

  screen = 0;
  msgDiv = createDiv(
    '<div id = \'message\'></div>' + 
    '<div id = \'name\' class=\'npcName\'></div>' +
    '<div class=\'npcInstruction\'> Press \'e\' to continue conversation.');
  msgDiv.addClass('messageBox');
  msgDiv.hide();
 }

 function windowResized() {
   centerCanvas();
 }

// Draw code goes here
function draw() {
  // could draw a PNG file here
  background('#353535');
  screenManager();
}

function screenManager() {
  if(screen === 0) {
    rectMode(CENTER);
    fill('#F4D1AE');
    rect(width/2, height/2, 1140, 640, 28);
    textAlign(CENTER);
    textFont(titleFont);
    textSize(70);
    fill('#353535');
    text('Living \'The Dream\'', width/2, 183);
    fill('white')
    text('Living \'The Dream\'', width/2, 180);
    homeScreen.draw();
  }
  if(screen === 1) {
    rectMode(CENTER);
    fill('#F4D1AE');
    rect(width/2, height/2, 1140, 640, 28);
    selectScreen.draw(titleFont);
  }
  if(screen == 2) {
    rectMode(CENTER);
    fill('#F4D1AE');
    rect(width/2, height/2, 1140, 640, 28);
    instructionScreen.draw();
    defaultGroup.draw();
    checkMovement();
    player.displayPlayerTag();
  }
  if(screen === 3) {
    background('#F4D1AE');
    // wallGroup.draw();
    testScreen.draw();
    defaultGroup.draw();
    checkMovement();
    player.displayPlayerTag();
  }
}

// This will reset position
function keyPressed() {
  if(key === 'e') {
    for(let i = 0; i < testScreen.npcs.length; i++) {
      if(player.checkNPCOverlap(testScreen.npcs[i]) && 
      testScreen.npcs[i].isActive) {
        testScreen.npcs[i].continueInteraction();
      } 
    }
  }
}

function checkMovement() {
  // player.checkCollision(wallGroup);
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
}


