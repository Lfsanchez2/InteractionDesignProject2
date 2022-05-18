/**
 * Utility class to create 'Sprite' elements utilizing p5 play.
 * ---------------------------------------------------------------------------------------------------
 * This class is useful for creating named p5 play Sprites that have different uses. There are two main
 * subclasses (but more can be added) - The Player and the NPC.
 * 
 * The Sprite class is also utilized to create 'Wall' and 'Decoration' elements in the game that will be
 * collidable with the Player character.
 */
class Sprite {
    constructor(name, xPos, yPos) {
      this.name = name;
      this.sprite = createSprite(xPos, yPos);
    }
  
    /**
     * Adds a new animation to the p5 play sprite.
     * @param {*} animationName - The name to give this new animation
     * @param {*} startFrame - The filepath to the starting frame of this new animation
     * @param {*} endFrame - The filepath to the ending frame of this new animation
     */
    newAnimation(animationName, startFrame, endFrame) {
      this.sprite.addAnimation(animationName, startFrame, endFrame);
    }
  
    /**
     * Adds a new idle image the p5 play sprite.
     * @param {*} imageName - The name of the new idle image
     * @param {*} image - The image to add
     */
    newIdleImage(imageName, image) {
      this.sprite.addImage(imageName, image);
    }

    /**
     * Adds a new idle image without a label.
     * @param {*} image - The image to add
     */
    newNamelessImage(image) {
      this.sprite.addImage(image);
    }

    /**
     * Changes the sprites current animation/image to one matching the given label.
     * @param {*} aniName - The label of the animation to change to
     */
    changeAni(aniName) {
      this.sprite.changeAnimation(aniName);
    }
  
    /**
     * Tracks the collision of this Sprite to a target Sprite
     * @param {*} target - The target Sprite to check collision with
     */
    checkCollision(target) {
      this.sprite.collide(target);
    }
  }
  
  /**
   * A subclass of the Sprite class - this denotes the Player character that the player 
   * operates throughout the game.
   * ---------------------------------------------------------------------------------------------------
   */
  class Player extends Sprite {
    constructor(name, xPos, yPos) {
      super(name, xPos, yPos);
    }
  
    /**
     * Check if the Player sprite is overlapping with a given NPC.
     * @param {*} npc - The NPC to check overlap with
     * @returns true if overlapping, false otherwise
     */
    checkNPCOverlap(npc) {
      return this.sprite.overlap(npc.sprite);
    }

    /**
     * Sets the name of the Player character.
     * @param {*} name - The name to give the Player character
     */
    setName(name) {
      this.name = name;
    }
  
    /**
     * Display's the Player character's name above their head.
     */
    displayPlayerTag() {
      fill('white')
      textSize(17);
      textFont(titleFont);
      textAlign(CENTER);
      text(this.name, this.sprite.position.x, this.sprite.position.y - (this.sprite.height/2 + 10));
    }
  }
  
  /**
   * A subclass of the Sprite class which denotes an NPC character.
   * An NPC Sprite will have predetermined interactions that are filled from given CSV files that contain
   * dialogue options for an NPC.
   * ---------------------------------------------------------------------------------------------------
   * Interactions are contained in the 'interactions' Map. This Map is separated based on 'progress' levels. 
   * This is done to support more complex NPCs that advance dialogue only when the Player triggers progression
   * through interacting with outside elements first.
   * 
   * The 'interaction index' variable is used to maintain a sequential order of dialogue throughout each progress 
   * level of the Map.
   * 
   * The 'isAcive' variable determines whether an NPC is currently being overlapped - this gives them precedence 
   * over every other NPC.
   * 
   * The 'interactPrompt' variable is the message that will display above an NPC to preface an interaction.
   * 
   * The 'progressState' variable determines the 'progress' level of an NPC, this affects what dialogue they show.
   */
  class NPC extends Sprite {
    constructor(name, xPos, yPos, prompt) {
      super(name, xPos, yPos);
      this.interactions = new Map();
      this.interactionIndex = 0;
      this.isActive = false;
      this.interactPrompt = prompt;
      this.progressState = 0;
    }

    /**
     * Adds given dialogue to the NPC's interactions Map.
     * @param {*} interaction - The dialogue interaction to add
     * @param {*} level - The 'progress' level of the given dialogue
     */
    addSingleInteraction(interaction, level) {
      let currInteractions = this.interactions.get(level);
      if(currInteractions != null) {
        currInteractions.push(interaction);
      } else {
        let interactionArray = [];
        interactionArray.push(interaction);
        this.interactions.set(level, interactionArray);
      }
    }

    /**
     * Increases an NPC's progressState by a given amount and resets their
     * interactionIndex to start at the beginning of their new progress level.
     * @param {*} incVal - The value to increase the progressState by
     */
    advanceProgress(incVal) {
      this.progressState += incVal;
      this.interactionIndex = 0;
    }

    /**
     * Get the full size of an NPC's dialogue options for its current progress level
     * @returns The length of the NPC's current dialogue array
     */
    getConvoSize() {
      return this.interactions.get(this.progressState).length;
    }
  
    /**
     * Displays the interact prompt that prefaces each NPC interaction when an NPC is overlapped.
     */
    displayInteractPrompt() {
      if(player.sprite.overlap(this.sprite)) {
        fill('white');
        textSize(12);
        textFont(titleFont);
        textAlign(CENTER);
        text(this.interactPrompt, this.sprite.position.x, this.sprite.position.y - 
        (this.sprite.height / 2 + 15));
        this.isActive = true;
      }
      else {
        if(this.isActive) {
          msgDiv.hide();
          interactionDiv.hide();
        }
        this.isActive = false;
      }  
    }

    /**
     * Update the message div to show the current dialogue of the NPC.
     */
    updateMessageBox() {
      let convoIndex = this.interactionIndex;
      if(convoIndex === this.getConvoSize()) {
        convoIndex--;
      }
      interactionDiv.hide();
      // DOM maniplation to change the HTML of the message div to show the NPC dialogue.
      document.getElementById('message').innerHTML = 
        this.interactions.get(this.progressState)[convoIndex];
      // DOM manipulation to change the name shown above the NPC dialogue.
      document.getElementById('name').innerHTML = this.name;
      // DOM manipulation to set the on click function for the laptop interaction button. 
      // This will open up a 'webpage' from the laptop NPC.
      let button = document.getElementById('laptop');
      if(button != null) {
        button.onclick = function () {
          interactionDiv.show();
          msgDiv.hide();
        }
        interactionDiv.elt.innerHTML = laptopWebsite;
      }
      msgDiv.show();
    }
  
    /**
     * Advances the NPC conversation to the next dialogue in the array.
     */
    continueInteraction() {
      if(this.isActive) {
        this.updateMessageBox();
        this.interactionIndex++;
      }
    }
}