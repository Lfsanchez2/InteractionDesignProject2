
class Screen {
    constructor() {
        this.clickables = [];
        this.npcs = [];
        this.appearanceTable = null;
        this.interactionTable = null;
    }

    loadAppearanceTable(path1, path2) {
        this.appearanceTable = loadTable(path1, 'csv', 'header');
        this.interactionTable = loadTable(path2, 'csv', 'header');
    }

    initializeNPCs() {
        for(let i = 0; i < this.appearanceTable.getRowCount(); i++) {
            let npcName = this.appearanceTable.getString(i, 0);
            let xPos = this.appearanceTable.getNum(i, 1);
            let yPos = (this.appearanceTable.getNum(i, 2));
            let npc = new NPC(npcName, xPos, yPos);
            if(this.appearanceTable.getNum(i,3)) {
                console.log(this.appearanceTable.getString(i,5))
                npc.newIdleImage(
                    this.appearanceTable.getString(i,4),
                    loadImage(this.appearanceTable.getString(i,5)));
            }
            this.npcs.push(npc);
        }
        for(let i = 0; i < this.interactionTable.getRowCount(); i++) {
            let npcIndex = this.interactionTable.getNum(i, 0);
            let dialogue = this.interactionTable.getString(i, 1);
            this.npcs[npcIndex].addSingleInteraction(dialogue);
        }
        console.log(this.npcs)
    }

    setup() {
        if(this.appearanceTable != null) {
            this.initializeNPCs();
        }
        console.log(this.npcs[0].sprite.position.y);
    }

    draw() {
        if(this.npcs.length > 0) {
            drawSprites();
            this.npcs.forEach((e) => {
                e.displayInteractPrompt()
            });
        }
        if(this.clickables.length > 0) {
            this.clickables.forEach((e) => e.draw());
        }
    }
}

class HomeScreen extends Screen {
    constructor() {
        super();
    }

    setup(font, screenFunc) {
        let introStart = new Clickable();
        introStart.width = 400;
        introStart.height = 120;
        introStart.text = "Start Introduction";
        introStart.textSize = 30;
        introStart.textFont = font;
        introStart.x = width/2 - 200;
        introStart.y = height-200;
        introStart.color = "#11B5E4";
        introStart.textColor = "white";
        introStart.onPress = screenFunc;
        this.clickables.push(introStart);
    }
}

class SelectionScreen extends Screen {
    constructor() {
        super();
        this.player = null;
        this.showPlayer = false;
    }

    setup(char1, charSelectFunc, nextScreenFunc) {
        let charSelect = new Clickable();
        charSelect.id = 0;
        charSelect.image = char1
        charSelect.color = "#11B5E4";
        charSelect.width = 184;
        charSelect.height = 220;
        charSelect.x = width/2 - 300;
        charSelect.y = height/2 - 100;
        charSelect.text = '';
        charSelect.onPress = charSelectFunc;

        let charSelect2 = new Clickable();
        charSelect2.id = 1;
        charSelect2.color = "#11B5E4";
        charSelect2.width = 184;
        charSelect2.height = 220;
        charSelect2.x = width/2 + 116;
        charSelect2.y = height/2 - 100;
        charSelect2.text = 'Placeholder';
        charSelect2.onPress = charSelectFunc;

        let next = new Clickable();
        next.color = "#11B5E4";
        next.textColor = "white";
        next.width = 300;
        next.height = 70;
        next.textSize = 18;
        next.x = width/2 - 150;
        next.y = height - 150;
        next.text = "Proceed to Instructions"
        next.onPress = nextScreenFunc

        this.clickables.push(charSelect, charSelect2, next);
    }

    draw(tFont) {
        textFont(tFont);
        textAlign(CENTER);
        textSize(50);
        fill('white');
        text('Select a Character', width/2, 130);
        super.draw();
        if(this.showPlayer) {
            this.player.draw();
        }
    }
}

class InstructionScreen extends Screen {
    constructor() {
        super();
    }

    setup(nextScreenFunc) {
        let next = new Clickable();
        next.color = "#11B5E4";
        next.textColor = "white";
        next.width = 300;
        next.height = 70;
        next.textSize = 18;
        next.x = width/2 - 150;
        next.y = height - 150;
        next.text = "Start Game"
        next.onPress = nextScreenFunc

        this.clickables.push(next);
    }
}