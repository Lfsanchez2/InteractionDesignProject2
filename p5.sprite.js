class Sprite {
    constructor(name, xPos, yPos, w, h) {
      this.name = name;
      if(w > 0 && h > 0) {
        this.sprite = createSprite(xPos, yPos, w, h);
      }
      else {
        this.sprite = createSprite(xPos, yPos);
      }
    }
  
    newAnimation(animationName, startFrame, endFrame) {
      this.sprite.addAnimation(animationName, startFrame, endFrame);
    }
  
    newIdleImage(imageName, image) {
      this.sprite.addImage(imageName, image);
    }

    changeAni(aniName) {
      this.sprite.changeAnimation(aniName);
    }
  
    resetPosition(xPos, yPos) {
      this.sprite.position.x = xPos;
      this.sprite.position.y = yPos;
    }
  
    checkCollision(target) {
      this.sprite.collide(target);
    }
  }
  
  class Player extends Sprite {
    constructor(name, xPos, yPos, w, h) {
      super(name, xPos, yPos, w, h);
    }
  
    checkNPCOverlap(npc) {
      return this.sprite.overlap(npc.sprite);
    }
  
    displayPlayerTag() {
      fill('white')
      textSize(20);
      textFont(titleFont);
      textAlign(CENTER);
      text(this.name, this.sprite.position.x, this.sprite.position.y - 70);
    }
  }
  
  class NPC extends Sprite {
    constructor(name, xPos, yPos, w, h) {
      super(name, xPos, yPos, w, h);
      this.interactionsArray = [];
      this.interactionIndex = 0;
      this.isActive = false;
    }
  
    addInteraction(interactionCSV) {
      let interactionTable = loadTable(interactionCSV, 'csv', 'header');
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
        textSize(12);
        textFont(titleFont);
        textAlign(CENTER);
        text('Press \'e\' to interact', this.sprite.position.x, this.sprite.position.y - 70);
        if(keyCode === 69) {
          this.isActive = true;
          document.getElementById('message').innerHTML = this.interactionsArray[this.interactionIndex];
          document.getElementById('name').innerHTML = this.name;
          msgDiv.show();
        }
      }
      else {
        if(this.isActive) {
          msgDiv.hide();
        }
        this.isActive = false;
      }  
    }
  
    continueInteraction() {
      if(this.isActive) {
        if(this.interactionIndex < this.interactionsArray.length-1) {
            this.interactionIndex++;
        }
      }
    }
}