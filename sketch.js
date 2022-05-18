/***********************************************************************************
  Living The 'Dream'

  An interactive experience of living as an undocumented teen in the US
------------------------------------------------------------------------------------
	To play:
  Use WASD/Arrow keys to move
  Press 'E' when prompted to interact with NPCs/objects
  Press 'Q' to get a hint of what to do next

  Some things to add:
  - Decorate Hallway rooms
  - Finish laptop.html website 
***********************************************************************************/
var titleFont, bodyFont, player, msgDiv, interactionDiv, instructionDiv, currentScreen;

var momStart = false;
// Determines the stage of the game which affects events and pathways in the game.
var stage = 1;
var newsCheck = false;
var hideHint = true;

// The events tracker determines what hint to show on a 'Q' press.
var eventIndex = 0;
var events = [
  // 0
  'What is this place? I should take a look around.',
  // 1
  'The Memory Core said a room opened to the south west...',
  // 2
  'This is ... home! I wonder where Mom is?',
  // 3
  'Mom said I should get my stuff for school! Should be in my room.',
  // 4
  'I\'m ready for school, have to talk to Mom before I leave though.',
  // 5
  'Mom says I should go check the news ... wonder what\'s up?',
  // 6
  'This is horrible news ... have to talk to Mom about it.',
  // 7
  'Not a good start to the day, but I should really head to class.',
  // 8
  'Long day ... I should talk to some people before I leave.',
  // 9
  '... I should head back home ...',
  // 10
  'I should talk to Mom.',
  // 11
  'I should give Dad a call like Mom said. Not sure where my phone is, maybe I should look outside?',
  // 12
  'I can call Dad here!',
  // 13
  'I\'m glad he\'s doing well. I hope he can come visit again soon...',
  // 14
  'I looked back on a lot of experiences. Now I feel like ... I should go back to where I started?',
  // 15
  '...'
]

// Shows the laptop.html page in the interaction div.
var laptopWebsite = "<object type=\"text/html\" data=\"laptop.html\" width=\"600px\" height=\"400px\"></object>"

var canvas, studentMap;
var showCore = false;

var playerImg, memoryCore, coreImg, parents, parentsImg, splashImg, instructionImg, hintText;

// ScreenManager object that contains all the game Screens.
var screenManager;
// The opacity of the rectangle that blackens the entire canvas at the end of the game.
var endfill = 0;
// Fill opacity for the black square that covers dad's room before and after a call.
var callFill = 255; 
// Determines when to remove the black square.
var showCall = false;

// Width and height of game canvas in pixels.
var canvasWidth = 1200;
var canvasHeight = 700;

// Set the limits for the game canvas - the Player cannot go past these bounds.
var northBound = (canvasHeight/2) - 300;
var southBound = (canvasHeight/2) + 290;
var eastBound = (canvasWidth/2) + 500;
var westBound = (canvasWidth/2) - 500;

// Load fonts, images, and initialize the ScreenManager object.
function preload() {
  titleFont = loadFont('assets/fonts/DelaGothicOne-Regular.ttf');
  bodyFont = loadFont('assets/fonts/Baloo2-Medium.ttf');
  playerImg = loadImage('assets/player/standingplayer1.png');
  playerName = 'Luis';
  coreImg =loadImage('assets/core.png');
  parentsImg = loadImage('assets/Mom&Dad.png');
  splashImg = loadImage('assets/soloButterfly.png');
  instructionImg = loadImage('assets/Directions.png');
  
  screenManager = new ScreenManager('data/screenMaster.csv');
}

/**
 * Function to increment the starting screens: the splash page and the character screen.
 */
incrementStartingScreens = function () {
  if(screenManager.currID === 'Character Screen') {
    instructionDiv.remove();
  }
  currentScreen = screenManager.updateScreen(currentScreen.nextID);
}

// Shows the interactopm div and displays the laptop.html
revealInteraction = function() {
  interactionDiv.show();
}

// Setup code goes here
function setup() {
  splashImg.resize(400, 0);
  // Sets the canvas' parent to an outside div in the HTML so it is always centered 
  // on the page.
  canvas = createCanvas(canvasWidth, canvasHeight);
  frameRate(45);
  canvas.parent('sketchHolder');

  // Create Player Sprite and animations
  player = new Player(playerName, width/2, height/2);
  player.sprite.scale = 0.8;
  player.newIdleImage('standing', playerImg);
  player.newAnimation('walking','assets/player/playerwalk1.png', 'assets/player/playerwalk6.png');

  // Create Memory Core NPC that shows up towards the end of the game.
  memoryCore = new NPC("Memory Core", width/2, height/2, 'Press \'e\' to talk');
  memoryCore.newIdleImage('Core', coreImg);
  memoryCore.addSingleInteraction('Are you alright? You seem down.',0);
  memoryCore.addSingleInteraction('These arent exactly the best memories, but they\'re real. They\'ve become a big part of your life',0);
  memoryCore.addSingleInteraction('It\'s become more and more clear the more you grow up hasn\'t it? It\'s not something you can just ignore any longer.',0);
  memoryCore.addSingleInteraction('There\'s one more thing you should recall, go up from here',0);
  memoryCore.addSingleInteraction('This memory has stuck with you for a long time, it never sat right with you.',1);
  memoryCore.addSingleInteraction('It\'s unfortunate, really. The last thing you\'d want is for any of your parents to apologize to you for something like that.',1);
  memoryCore.addSingleInteraction('You always wonder why things have to be this way. Why everything is made so difficult for you and your family, and why some people'+
  ' assume so many things about you without truly knowing everything.',1);
  memoryCore.addSingleInteraction('You\'re not the only one, and so long as these policies remain this way, there will always be countless people with similar' +
  ' or worse experiences than you\'ve had.',1);

  // Create Parents NPC that shows up towards the end of the game.
  parents = new NPC("Mom & Dad", width/2, 200, 'Press \'e\' to talk');
  parents.newIdleImage('Sad', parentsImg);
  parents.addSingleInteraction('I\'m sorry mijo, for everything.',0);
  parents.addSingleInteraction('Your dad and I just wanted to make sure you and your sister had a better life.',0);
  parents.addSingleInteraction('We didn\'t know how difficult things would get for the both of you.',0);
  
  // The div that shows NPC names and dialogue.
  msgDiv = createDiv(
    '<div id = \'message\'></div>' + 
    '<div id = \'name\' class=\'npcName\'></div>' +
    '<div class=\'npcInstruction\'> Press \'e\' to continue conversation.');
  msgDiv.addClass('messageBox');
  msgDiv.id('msg');
  msgDiv.hide();
  msgDiv.parent('sketchHolder');

  // The div that displays the laptop.html website.
  interactionDiv = createDiv();
  interactionDiv.addClass('interactionDisplay');
  interactionDiv.hide();
  interactionDiv.parent('sketchHolder');

  // The div that displays the introduction to the game.
  instructionDiv = createDiv(
    '<p>&emsp;In this game you play as an undocumented teen living in the US. Life as an undocumented person in the US is\
    difficult. There are many things you can\'t experience for yourself, such as having a job. There is also always the\
    looming threat of deportation, even if you yourself are on your best behavior.</p>\
    <p>&emsp;Things have been made more complicated in recent years, specifically through the 4 years of Trump\'s presidency.\
    During this period, negativity towards immigrants of any kind became more and more commonplace. Trump\'s disapproval and subsequent\
    removal of certain polices is also a central focus of this game.</p>\
    <p>&emsp;The experiences outlined in this game are based on my own. The plight of immigrants of all kinds is often overlooked, and we are\
    often grouped into stereotypes that alienate us. The purpose of this game is to showcase and reflect on my own experiences while also\
    giving those who are not aware of these issues some insight into what it is like to live through them. </p>'
  );
  instructionDiv.addClass('instructionDisplay');
  instructionDiv.hide();
  instructionDiv.parent('sketchHolder');
  
  // Sets up all the screens for the game.
  screenManager.setup(incrementStartingScreens, bodyFont);
  currentScreen = screenManager.getCurrentScreen();

  // Sets up the count of the students who have been talked to.
  studentMap = new Map([
    ['Student 1', 0],
    ['Student 2', 0],
    ['Student 3', 0],
    ['Student 4', 0],
  ])

  // The hint text to display.
  hintText = 'Press \'Q\' to show hint.';
 }

// Draw code goes here
function draw() {
  background(0);
  // Draw custom text for the start screens.
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
      push();
      textAlign(CENTER, CENTER);
      textFont(titleFont);
      text('W', canvasWidth/4, canvasHeight/2 - 20);
      text('S', canvasWidth/4, canvasHeight/2 + 110);
      text('A', canvasWidth/4 - 70, canvasHeight/2 + 40);
      text('D', canvasWidth/4 + 70, canvasHeight/2 + 40);
      textAlign(LEFT, CENTER);
      textFont(bodyFont);
      text('• Use WASD/Arrow Keys to move\n• Press \'E\' to interact with objects/NPCs\n• Press \'Q\' to get hints', 
      canvasWidth/4 - 190, canvasHeight/2 - 130);
      pop();
      instructionDiv.show();
      
    } else {
      imageMode(CENTER);
      image(splashImg, width/2, height/2);
      fill('#353535');
      text(currentScreen.title, width/2, 183);
      fill('white')
      text(currentScreen.title, width/2, 180);
    }
  } 
  else {
    if(endfill < 255) {
      rectMode(CENTER);
      fill(currentScreen.bgColor);
      noStroke();
      // Draw the shortened canvas - smaller than the full canvas.
      rect(canvasWidth/2, canvasHeight/2, 1040, 650, 18);

      // Draws the background image for the current Screen if it exists
      imageMode(CENTER);
      if(currentScreen.backgroundImg != null) {
        image(currentScreen.backgroundImg, canvasWidth/2, height/2);
      }

      // Draws the walls, decorations, and NPCs of the current Screen
      currentScreen.draw();
      // Track movement/collisions of Player character.
      checkMovement();
      // Draw Player Sprite.
      drawSprite(player.sprite);
      // Show Player name.
      player.displayPlayerTag();
      // Display the interact prompt - when overlapped - for each NPC in the current Screen.
      currentScreen.npcArray.forEach(e => {
        e.displayInteractPrompt();
      })

      // Display the name of the current Screen on the top left.
      stroke(color(255,255,255));
      strokeWeight(2);
      fill(color(0,0,0,100));
      textAlign(LEFT);
      textFont(titleFont);
      textSize(25);
      text(screenManager.currID, westBound+10, northBound+20);

      // Display the student count at the Classroom portion of the game.
      if(screenManager.currID === 'Classroom') {
        textSize(20);
        text('Students Talked To:\t\t\t' + getStudentProgress() + '/4', eastBound-320, northBound+30);
        if(getStudentProgress() === 4) {
          stage = 4;
          eventIndex = 9;
        } else {
          eventIndex = 8;
        }
      }

      // Display the negative labels after talking to all the students and going back Home.
      if(screenManager.currID.includes('Hallway') && stage === 4) {
        drawBadMemories();
      }

      // Either uncovers or covers Dad's room with a black rectangle to indicate the start and end
      // of the phone call.
      if(screenManager.currID === 'Dad\'s Room') {
        rectMode(CENTER);
        if(showCall) {
          if(callFill > 0) {
            callFill -= 5;
          }
        } else {
          if(callFill < 255) {
            callFill += 5;
          }
        }
        fill(color(0,0,0,callFill));
        noStroke()
        rect(canvasWidth/2 + 253, canvasHeight/2, 495, 600);
      }

      // Display the hint prompt at the bottom right.
      push();
      fill(0);
      stroke(color(255,255,255));
      strokeWeight(3);
      textAlign(RIGHT, CENTER);
      textSize(20);
      textFont(bodyFont);
      if(hideHint) {
        text('Press \'Q\' to show hint.', eastBound - 90, southBound - 60);
      } else {
        text(hintText, eastBound - 90, southBound - 60);
      }
      pop();
    }
    if(stage === 8) {
      // Triggers the ending animation of the game which blackens the entire canvas.
      if(endfill < 255) {
        endfill += 5;
      }
      rectMode(CENTER);
      fill(0,0,0,endfill);
      noStroke();
      rect(canvasWidth/2, canvasHeight/2, canvasWidth, canvasHeight);
      if(endfill === 255) {
        fill(255);
        textSize(60);
        textAlign(CENTER, CENTER)
        textFont(titleFont);
        text('The End', canvasWidth/2, 150);
        textFont(bodyFont);
        textAlign(LEFT);
        textSize(25);
        text('You relived some difficult experiences, but it wasn\'t without reason. As you grow older, you have to accept these issues' + 
        ' more and more. It was unfortunate to see how the state of public opinion against immigrants got worse and worse throughout Trump\'s' +
        ' presidency, but now the severity of these issues is even clearer. You should\'t have to live in fear of being ousted from the country,' +
        ' or with the guilt of seeing your family struggle for your benefit. A change has to be made. More people should know about these plights' +
        ' and open their minds to more thoughtful conversation about this topic in order to truly educate themselves and avoid contributing to the' +
        ' problem.', canvasWidth/2, canvasHeight/2 + 30, 1000, 400)
      }
      
    }
  }
}
// Check the number of students talked to.
function getStudentProgress() {
  let sum = Array.from(studentMap.values()).reduce((a, b) => a + b, 0);
  return sum;
}

// Advances the progress of the conversations with the Mom NPC.
function progressMomConvo(npc) {
  // if(npc.getConvoSize() === npc.interactionIndex) {
    let momNPC = screenManager.allScreens.get('Mom\'s Room').getNPC('Mom');
    if (npc.name === 'Backpack') {
      if(momNPC.progressState === 0) {
        momNPC.advanceProgress(3);
      }
      else if (momNPC.progressState === 1) {
        momNPC.advanceProgress(1);
      }
      else if (momNPC.progressState === 3) {
        momNPC.advanceProgress(2);
      }
      else if (momNPC.progressState === 4) {
        momNPC.advanceProgress(2);
      }
      else if (momNPC.progressState === 5) {
        momNPC.advanceProgress(1);
      }
    }
    else if (npc.name === 'News') {
      if (momNPC.progressState === 0 || momNPC.progressState === 1) {
        momNPC.advanceProgress(4);
      }
      else if (momNPC.progressState === 2) {
        momNPC.advanceProgress(5);
      }
      else if (momNPC.progressState === 3) {
        momNPC.advanceProgress(4);
      }
    }
    if(momStart) {
      if((momNPC.progressState === 2 || momNPC.progressState === 3) 
      && momNPC.getConvoSize() - 1 === momNPC.interactionIndex) {
        eventIndex = 5;
      }
      else if(momNPC.progressState === 4 || momNPC.progressState === 5
        && momNPC.getConvoSize() - 1 === momNPC.interactionIndex) {
        eventIndex = 3;
      }
    }
    if(!momStart && (momNPC.progressState === 6 || momNPC.progressState === 7)) {
      momNPC.advanceProgress(1)
    }
}

function trackEvents(npc) {
  progressMomConvo(npc);
  if (npc.name === 'Backpack') {
    currentScreen.npcSprites.remove(npc.sprite);
    currentScreen.npcArray.splice(1, 1);
    if(eventIndex < 4) {
      eventIndex = 4;
    }
  } else {
    // The NPC conversation is over - hit the last message
    if (npc.getConvoSize() === npc.interactionIndex) {
      // This means the message div is currently visible. If it is visible, the message div will be
      // closed on any consecutive 'e' presses due to it being the end of the conversation.
      if (msgDiv.elt.style.display === "block") {
        msgDiv.hide();
        // Memory Core is a special dynamic NPC that disappears and relocates when its interactions 
        // are finished.
        if (npc.name === 'Memory Core') {
          if(screenManager.currID === 'Memory Hall North') {
            if (stage === 1) {
              currentScreen.npcSprites.clear();
              currentScreen.npcArray = [];
              screenManager.getScreenByName('Memory Hall South').updateWalls(['FullLeft']);
              // Stage 2 is the 'Home' stage. Go explore your apartment.
              stage = 2;
              eventIndex = 1;
            } else if (stage === 7) {
              currentScreen.npcSprites.clear();
              currentScreen.npcArray = [];
              // Stage 8 is the 'Ending' stage. The ending animation will trigger.
              stage = 8;
            }
          }
          if(screenManager.currID === 'Memory Hall South' && stage === 7) {
            // Remove Memory Core from this screen
            currentScreen.npcSprites.clear();
            currentScreen.npcArray = [];
            // Add Parents to the screen above this one (Memory Hall North)
            let memHallII = screenManager.getScreenByName('Memory Hall North');
            memHallII.npcArray.push(parents);
            memHallII.npcSprites.add(parents.sprite);
            eventIndex = 15;
          } 
        } 
        // Mom is a special NPC that has progress based interactions that are dependent on your
        // interactions with NPCs in other rooms. When you hit certain triggers or finish interactions
        // with other NPCs, her conversation will progress accordingly.
        else if (npc.name === 'Mom') {
          if(screenManager.currID === 'Mom\'s Room') {
            if(npc.progressState === 0) {
              npc.advanceProgress(1);
              eventIndex = 3;
            } 
            else if (npc.progressState === 9) {
              // Stage 3 is the start of the 'School' stage - Go to school.
              stage = 3;
              // This opens up the school hallway and classroom to the right.
              screenManager.getScreenByName('Memory Hall South').updateWalls(['FullRight']);
              eventIndex = 7;
            }
            else if(npc.progressState === 10) {
              // Stage 5 is the start of the 'Dad' stage - Look for Dad's room to call him.
              stage = 5;
              eventIndex = 11;
            }
          }
        }
        // The Parents NPC shows up to trigger the end of the game in the Memory Hall North room.
        else if (npc.name === 'Mom & Dad') {
          if (screenManager.currID === 'Memory Hall North' && !showCore){
            // The Memory Core NPC is repositioned beside the Parents NPC and is reset to be shown
            // again instead of removed. This is done in order to trigger the ending interaction.
            memoryCore.sprite.position.x = width/2 + 80;
            memoryCore.sprite.position.y = 150;
            memoryCore.advanceProgress(1);
            memoryCore.sprite.removed = false;
            currentScreen.npcArray.push(memoryCore);
            currentScreen.npcSprites.add(memoryCore.sprite);
            showCore = true;
          }
        }
        else if (npc.name === "News" && !newsCheck) {
          eventIndex = 6;
          newsCheck = true;
        }
        else if (npc.name === 'Dad') {
          screenManager.allNPCS.get('Dad Sprite').changeAni('Standing');
          showCall = false;
          currentScreen.npcSprites.remove(npc.sprite);
          currentScreen.npcArray.splice(0, 1);
          stage = 7;
          eventIndex = 13;
        }
      } else {
        // The message div is currently hidden, which just means the contents of the message div 
        // have to be updated
        npc.updateMessageBox();
      }
    } else {
      if(npc.name === 'Dad') {
        if(npc.interactionIndex === 0) {
          // Removes the black screen
          showCall = true;
        } else if (npc.interactionIndex === 1) {
          // Changes Dad's idle pose to receive a phone call
          screenManager.allNPCS.get('Dad Sprite').changeAni('Calling');
        }
        
      }
      // The NPC conversation has not reached the end, so it can progress like normal.
      npc.continueInteraction();
      // Update the progress of conversations with students that have been completed.
      if(npc.name.includes('Student') && npc.getConvoSize() === npc.interactionIndex) {
        studentMap.set(npc.name, 1);
      }
      // Advances the progress of conversations with the Mom NPC
      if(npc.name === "Mom") {
        momStart = true;
        if (npc.progressState == 6) {
          npc.advanceProgress(3);
        }
        else if (npc.progressState === 7) {
          npc.advanceProgress(2);
        }
        else if (npc.progressState === 8) {
          npc.advanceProgress(1);
        }
      }
    }
  }
}

function keyPressed() {
  // Main key function for talking to NPCs/interacting with objects
  if(key === 'e') {
    hideHint = true;
    let currNPCs = currentScreen.npcArray;
    if(currNPCs.length > 0) {
      currNPCs.forEach(e => {
        if(player.checkNPCOverlap(e) && e.isActive) {
          trackEvents(e);
        }
      })
    }
  }
  // Main key function for displaying progress hints
  if(key === 'q') {
    hideHint = !hideHint;
    if(!hideHint) {
      hintText = events[eventIndex] + '\nPress \'Q\' to hide hint.';
    }
  }
}

function checkMovement() {
  // Check collision of player to walls and background decorations
  player.checkCollision(currentScreen.wallSprites);
  player.checkCollision(currentScreen.decoColliders);

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
    player.changeAni('walking');
  }
  else if(keyIsDown(87) || keyIsDown(38)) {
    player.sprite.velocity.y = -10;
    player.changeAni('walking');
  }
  else {
    player.sprite.velocity.y = 0;
  }
  
  // Keep player inside Classroom until they talk to all the students
  if(screenManager.currID === 'Classroom' && getStudentProgress() != 4) {
    if(player.sprite.position.x < westBound) {
      player.sprite.position.x = westBound;
    }
  } else {
    // Check for the player moving into a North-adjacent room
    if (currentScreen.northNextScreen != null && 
      player.sprite.position.y < northBound) {
      // Always hide an open hint upon room transition
      hideHint = true;
      // Change screen to the room mapped North of the current screen
      currentScreen = screenManager.updateScreen(currentScreen.northNextScreen);
      // Adjust player size based on room
      adjustPlayerSize();
      // Reset player position to match new room
      player.sprite.position.y = southBound - 50;
    }
    // Check for player moving into a South-adjacent room
    if (currentScreen.southNextScreen != null && 
      player.sprite.position.y > southBound) {
        // Always hide an open hint upon room transition
        hideHint = true;
        // Change screen to the room mapped South of the current screen
        currentScreen = screenManager.updateScreen(currentScreen.southNextScreen);
        // Adjust player size based on room
        adjustPlayerSize();
        // Reset player position to match new room
        player.sprite.position.y = northBound + 50;
    }
    // Check for player moving into an East-adjacent room
    if (currentScreen.eastNextScreen != null && 
      player.sprite.position.x > eastBound) {
        // Always hide an open hint upon room transition
        hideHint = true;
        // Change screen to the room mapped East of the current screen
        currentScreen = screenManager.updateScreen(currentScreen.eastNextScreen);
        // Adjust player size based on room
        adjustPlayerSize();
        // Reset player position to match new room
        player.sprite.position.x = westBound + 50;
        // After the player talks to Mom after coming back from School, close the path to the Apartment and 
        // open the path to Dad's Room in the Northeast 
        if(stage === 5 && screenManager.currID === 'Memory Hall South') {
          screenManager.getScreenByName('Memory Hall North').updateWalls(['Right']);
          currentScreen.addWall('assets/MemoryHall/MHFullLeftWall.png', (canvasWidth/2) - 460, canvasHeight/2);
          // Continues the 'Dad' stage - Go to Dad's room
          stage = 6;
        }
        if(stage === 6 && screenManager.currID === 'Dad\'s Room') {
          eventIndex = 12;
        }
    }
    // Check for player moving into a West-adjacent room
    if (currentScreen.westNextScreen != null && 
      player.sprite.position.x < westBound) {
        // Always hide an open hint upon room transition
        hideHint = true;
        // Change screen to the room mapped West of the current screen
        currentScreen = screenManager.updateScreen(currentScreen.westNextScreen);
        // Adjust player size based on room
        adjustPlayerSize();
        // Reset player position to match new room
        player.sprite.position.x = eastBound - 50;
        // Sets the event index upon entry to the Apartment
        if (screenManager.currID === 'Living Room') {
          if(stage === 2 && eventIndex < 2) {
            eventIndex = 2;
          } 
          else if (stage === 4 && eventIndex < 10){
            eventIndex = 10;
          } 
        }
        // Closes the pathway to the School and sets the Mom NPC up for a new interaction.
        if (stage === 4 && screenManager.currID === 'Memory Hall South') {
          currentScreen.addWall('assets/MemoryHall/MHFullRightWall.png', (canvasWidth/2) + 460, canvasHeight/2);
          let momNPC = screenManager.allScreens.get('Mom\'s Room').getNPC('Mom');
          momNPC.advanceProgress(1);
        }
        // Closes the pathway to Dad's Room and adds the Memory Core NPC to the starting area.
        if(stage === 7 && screenManager.currID === 'Memory Hall North') {
          currentScreen.addWall('assets/MemoryHall/MHFullRightWall.png', (canvasWidth/2) + 460, canvasHeight/2);
          let memHallI = screenManager.getScreenByName('Memory Hall South');
          memHallI.npcArray.push(memoryCore);
          memHallI.npcSprites.add(memoryCore.sprite);
          eventIndex = 14;
        }
    } 
  }
}

function adjustPlayerSize() {
  interactionDiv.elt.innerHTML = '';
  interactionDiv.hide();
  if(screenManager.currID.startsWith('Memory Hall')) {
    player.sprite.scale = 0.7;
  }
  else if(screenManager.currID === 'Classroom') {
    player.sprite.scale = 0.8;
  }
  else if(screenManager.currID === 'Dad\'s Room') {
    player.sprite.scale = 1.2;
  }
  else {
    player.sprite.scale = 1.1;
  }
}

function drawBadMemories() {
  textFont(titleFont);
  stroke('white');
  fill('black');
  textSize(40)
  push()
  rotate(radians(-10))
  text('Build the wall!', 160 + random(5), 200 + cos(frameCount * 0.1) + random(5));
  pop()
  push()
  let angle0 = radians(10 + random(2));
  rotate(angle0);
  textSize(90)
  text('Illegal', 600, 180 + sin(frameCount) + random(10));
  pop()
  push()
  let angle1 = radians(30 + random(1));
  rotate(angle1);
  textSize(60);
  text('Spic', cos(frameCount * 0.2) + random(2) + 550, sin(frameCount*0.1) - 190);
  pop()
  push()
  let angle3 = radians(-30 + random(2))
  rotate(angle3)
  textSize(40);
  text('Beaner', sin(frameCount*0.1) + 160 + random(8), cos(frameCount*0.1) + 410 + random(2));
  pop()
  push();
  let angle2 = radians(15 + random(1));
  rotate(angle2)
  textSize(50);
  text('Wetback', sin(frameCount*0.1) + random(2) + 820, -90) 
  pop();
}
