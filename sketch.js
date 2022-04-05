/***********************************************************************************
  Sprite Navigation

  Simple use of the p5.play library
------------------------------------------------------------------------------------
	To use:
	Add this line to the index.html

  <script src="p5.timer.js"></script>
***********************************************************************************/
var titleFont, bodyFont, player, wallGroup, testNPC, msgDiv;


function preload() {
  titleFont = loadFont('assets/fonts/DelaGothicOne-Regular.ttf');
  bodyFont = loadFont('assets/fonts/Baloo2-Medium.ttf');
}
// Setup code goes here
function setup() {
  createCanvas(1200, 700);
  frameRate(30);
  testNPC = new NPC('Tester NPC', 600, height/2, false);
  testNPC.addSingleInteraction('Hello! I\'m a tester!');
  testNPC.addSingleInteraction('I\'m here to test interactions!');
  testNPC.addSingleInteraction('This is the last interaction!');
  msgDiv = createDiv(
    '<div id = \'message\'></div>' + 
    '<div id = \'name\' class=\'npcName\'></div>');
  msgDiv.addClass('messageBox');
  msgDiv.hide();
  console.log(msgDiv)
  player = new Sprite('Luis', 100, height/2, true);
  player.sprite.debug = true;
  wall1 = new Sprite('Wall1', 0, 100, false, 1400, 200);
  wall1.sprite.debug = true;
  wall2 = new Sprite('Wall2', 0, 600, false, 1400, 200);
  wall2.sprite.debug = true;
  wallGroup = new Group();
  wallGroup.add(wall1.sprite);
  wallGroup.add(wall2.sprite);
  
 }




// Draw code goes here
function draw() {
  // could draw a PNG file here
  background('#353535');
  drawSprites();
  checkMovement();
  testNPC.displayInteractPrompt();
}

// This will reset position
function keyPressed() {
  if( key === ' ') {
    player.resetPosition(random(50, width-50), height/2 + 100);
  }
  if (key === 'r') {
    console.log(player.sprite);
  }
  if (key === 'e') {
    if(player.sprite.overlap(testNPC.sprite) && testNPC.firstMessage) {
      testNPC.continueInteraction();
    }
  }
}

function checkMovement() {
  player.checkCollision(wallGroup);
  // Check x movement
  if(keyIsDown(68) || keyIsDown(39)) {
    player.sprite.velocity.x = 10;
  }
  else if(keyIsDown(65) || keyIsDown(37)) {
    player.sprite.velocity.x = -10;
  }
  else {
    player.sprite.velocity.x = 0;
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

class Sprite {
  constructor(name, xPos, yPos, playerCheck, w, h) {
    this.name = name;
    if(w > 0 && h > 0) {
      this.sprite = createSprite(xPos, yPos, w, h);
    }
    else {
      this.sprite = createSprite(xPos, yPos);
    }
    this.isPlayer = playerCheck;
  }

  newAnimation(animationName, startFrame, endFrame) {
    this.sprite.addAnimation(animationName, startFrame, endFrame);
  }

  newIdleImage(imageName, image) {
    this.sprite.addImage(imageName, image);
  }

  resetPosition(xPos, yPos) {
    this.sprite.position.x = xPos;
    this.sprite.position.y = yPos;
  }

  checkCollision(target) {
    this.sprite.collide(target);
  }
}

var npcCount = 0;

class NPC extends Sprite {
  constructor(name, xPos, yPos, playerCheck, w, h) {
    super(name, xPos, yPos, playerCheck, w, h);
    this.interactionsArray = [];
    this.interactionIndex = 0;
    this.firstMessage = false;
    this.promptText = 'Press \'E\' to interact!';
  }

  addInteraction(interactionCSV) {
    let interactionTable = interactionCSV.loadTable();
    if(interactionTable.getColumn('index') && interactionTable.getColumn('interaction')) {
      for(let i = 0; i < interactionTable.getRowCount(); i++) {
        this.interactionsArray.push(table.getString(i, 1));
      }  
    }
  }

  addSingleInteraction(interaction) {
    this.interactionsArray.push(interaction);
  }

  displayInteractPrompt() {
    if(player.sprite.overlap(this.sprite)) {
      fill('white');
      textFont(titleFont);
      textAlign(CENTER);
      
      text(this.promptText,this.sprite.position.x, 
            this.sprite.position.y - 70);
      if(keyCode === 69) {
        textSize(10);
        this.promptText = 'Press \'E\' to continue interaction, \'C\' to close textbox.'
        this.firstMessage = true;
        document.getElementById('message').innerHTML = 
          this.interactionsArray[this.interactionIndex];
        document.getElementById('name').innerHTML =
          this.name;
        // console.log(msgDiv)
        msgDiv.show();
      }
      if(keyCode === 67) {
        msgDiv.hide();
        textSize(15);
        this.promptText = 'Press \'E\' to interact!'
      }
    }
    else {
      msgDiv.hide();
      textSize(15);
        this.promptText = 'Press \'E\' to interact!'
    }  
  }

  continueInteraction() {
    if(this.interactionIndex < this.interactionsArray.length-1) {
      this.interactionIndex++;
    }
    let npcMSG = document.getElementById('message');
        npcMSG.innerHTML = this.interactionsArray[this.interactionIndex];
  }
}