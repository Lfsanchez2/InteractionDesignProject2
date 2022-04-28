function clickableHover() {
    if(this.id === 'homeStart') {
        this.width = 350;
        this.x = width/2 - 175;
        this.textSize = 30;
        this.color = '#006c8a';
    }
    if(this.id === 'characterNext') {
        this.width = 350;
        this.x = width/2 - 175;
        this.textSize = 22;
        this.color = '#006c8a';
    }
    if(this.id === 'avatar1' || this.id === 'avatar2') {
        this.width = 200;
        this.height = 239;
        if(this.id === 'avatar1') {
            this.x = width/2 - 308;
            this.y = height/2 - 109.5;
            text("Player 1", this.x + this.width/2, this.y - 20);
        } else {
            this.x = width/2 + 108;
            this.y = height/2 - 109.5;
            text("Player 2", this.x + this.width/2, this.y - 20);
        }
        this.color = color(255, 94, 91, 200);
    }
    
}

function clickableOutside() {
    if(this.id === 'homeStart') {
        this.width = 300;
        this.x = width/2 - 150;
        this.textSize = 20;
        this.color = '#353535'
    }
    if(this.id === 'characterNext') {
        this.width = 300;
        this.x = width/2 - 150;
        this.textSize = 18;
        this.color = '#353535'
    }
    if(this.id === 'avatar1' || this.id === 'avatar2') {
        this.width = 184;
        this.height = 220;
        if(this.id === 'avatar1') {
            this.x = width/2 - 300;
            this.y = height/2 - 100;
        } else {
            this.x = width/2 + 116;
            this.y = height/2 - 100;
        }
        this.color = color(244, 209, 174, 170);
    }
    
}


class Screen {
    constructor(path1, path2, path3, path4, bgColor, bg, north, south, east, west) {
        this.bgColor = bgColor;
        if(bg != null) {
            this.backgroundImg = loadImage(bg);
        }

        this.clickables = [];
        this.npcArray = [];
        this.npcSprites = new Group();
        this.walls = new Group();
        this.decoSprites = new Group();
        this.decoColliders = new Group();

        this.npcTable = null;
        this.interactionTable = null;
        this.wallsTable = null;

        this.northNextScreen = north;
        this.southNextScreen = south;
        this.eastNextScreen = east;
        this.westNextScreen = west;

        if(path1 != null) {
            this.npcTable = loadTable(path1, 'csv', 'header');
        }
        if(path2 != null) {
            this.interactionTable = loadTable(path2, 'csv', 'header');
        }
        if(path3 != null) {
            this.wallsTable = loadTable(path3, 'csv', 'header');
        }
        if(path4 != null) {
            this.decoTable = loadTable(path4, 'csv', 'header');
        }
    }

    setup() {
        if (this.npcTable != null) {
            this.getNPCs();
        }
        if (this.interactionTable != null) {
            this.getInteractions();
        }
        if (this.wallsTable != null) {
            this.getWalls();
        }
        if (this.decoTable != null) {
            this.getDeco();
        }
    }

    getNPCs() {
        for(let i = 0; i < this.npcTable.getRowCount(); i++) {
            let npcName = this.npcTable.getString(i, 'Name');
            let xPos = eval(this.npcTable.getString(i, 'X'));
            let yPos = eval(this.npcTable.getString(i, 'Y'));
            let npc = new NPC(npcName, xPos, yPos);
            if(this.npcTable.getNum(i,'Static')) {
                let staticImage = loadImage(this.npcTable.getString(i, 'Image'), 
                    () => {
                        npc.newIdleImage(this.npcTable.getString(i, 'ImageName'), staticImage);
                    }
                )
            }
            npc.sprite.scale = 1.3;
            this.npcSprites.add(npc.sprite);
            this.npcArray.push(npc);
        }
        // console.log(this.npcArray);
    }

    getInteractions() {
        for(let i = 0; i < this.interactionTable.getRowCount(); i++) {
            let currNPCIndex = this.interactionTable.getNum(i, 'NPCIndex');
            let npc = this.npcArray[currNPCIndex];
            npc.addSingleInteraction(this.interactionTable.getString(i, 'Dialogue'));
        }
    }

    getWalls() {
        for(let i = 0; i < this.wallsTable.getRowCount(); i++) {
            let wallLabel = this.wallsTable.getString(i, 'Name');
            let x = eval(this.wallsTable.getString(i, 'X'));
            let y = eval(this.wallsTable.getString(i, 'Y'));
            let image = loadImage(this.wallsTable.getString(i, 'Image'), () => {
                let wallSprite = createSprite(x, y);
                wallSprite.addImage(wallLabel, image);
                wallSprite.setDefaultCollider();
                this.walls.add(wallSprite);
            });
        }
    }

    getDeco() {
        console.log(this.decoTable)
        for(let i = 0; i < this.decoTable.getRowCount(); i++) {
            let decoLabel = this.decoTable.getString(i, 'Name');
            let x = eval(this.decoTable.getString(i, 'X'));
            let y = eval(this.decoTable.getString(i, 'Y'));
            let collisionCheck = this.decoTable.getNum(i, 'Collision-Object');

            let image = loadImage(this.decoTable.getString(i, 'Image'), () => {
                let decoSprite = createSprite(x, y);
                decoSprite.addImage(decoLabel, image);
                if(collisionCheck) {
                    decoSprite.setDefaultCollider();
                    this.decoColliders.add(decoSprite);
                }
                this.decoSprites.add(decoSprite);
            });
        }
    }

    draw() {
        
        drawSprites(this.decoSprites);
        drawSprites(this.npcSprites);
        this.npcArray.forEach((e) => {
            e.displayInteractPrompt()
        })
        drawSprites(this.walls);
        this.clickables.forEach((e) => e.draw());
    }

    drawNPCS() {
        if(this.npcs.length > 0) {
            drawSprites(this.npcs);
            this.npcs.forEach((e) => {
                e.displayInteractPrompt()
            })
        }
    }

    drawWalls() {
        if(this.walls.length > 0) {
            drawSprites(this.walls);
        }
    }

    drawClickables() {
        if(this.clickables.length > 0) {
            this.clickables.forEach((e) => e.draw());
        }
    }
}

class HomeScreen extends Screen {
    constructor(path1, path2, path3, bgColor, bg, north, south, east, west) {
        super(path1, path2, path3, bgColor, bg, north, south, east, west);
        this.title = "Living the \'Dream\'";
        this.nextID = "Character Screen";
    }

    setup(nextFunc, font) {
        let introStart = new Clickable();
        introStart.id = 'homeStart';
        introStart.width = 300;
        introStart.height = 100;
        introStart.text = 'Start Introduction';
        introStart.textSize = 20;
        introStart.x = (width/2) - 200;
        introStart.y = height - 200;
        introStart.color = '353535';
        introStart.textColor = 'white';
        introStart.onHover = clickableHover;
        introStart.onOutside = clickableOutside;
        introStart.onPress = nextFunc;
        introStart.textFont = font; 

        this.clickables.push(introStart);
    }

    draw() {
        rectMode(CENTER);
        fill(this.bgColor);
        rect(width/2, height/2, 1140, 640, 28);
        textAlign(CENTER);
        textSize(70);
        super.draw();
    }
}

class CharacterScreen extends Screen {
    constructor(path1, path2, path3, bgColor, bg, north, south, east, west) {
        super(path1, path2, path3, bgColor, bg, north, south, east, west);
        this.title = 'Select Your Character'
        this.nextID = 'Memory Hall I';
        this.selectionText = 'No character has been selected.'
        this.input = null;
        this.button = null;
    }

    updateSelection(newText) {
        this.selectionText = newText;
    }

    setup(char1, char2, nextScreenFunc, setNameFunc, charSelectFunc, font) {
        let charSelect = new Clickable();
        charSelect.id = 'avatar1';
        charSelect.image = char1
        charSelect.color = color(244, 209, 174, 170);
        charSelect.width = 184;
        charSelect.height = 220;
        charSelect.x = width/2 - 300;
        charSelect.y = height/2 - 100;
        charSelect.text = '';
        charSelect.onPress = charSelectFunc;
        charSelect.stroke = color(244, 209, 174);
        charSelect.strokeWeight = 3;
        charSelect.onHover = clickableHover;
        charSelect.onOutside = clickableOutside;

        let charSelect2 = new Clickable();
        charSelect2.id = 'avatar2';
        charSelect2.color = color(244, 209, 174, 170);
        charSelect2.width = 184;
        charSelect2.height = 220;
        charSelect2.x = width/2 + 116;
        charSelect2.y = height/2 - 100;
        charSelect2.text = '';
        charSelect2.image = char2;
        charSelect2.onPress = charSelectFunc;
        charSelect2.stroke = color(244, 209, 174);
        charSelect2.strokeWeight = 3;
        charSelect2.onHover = clickableHover;
        charSelect2.onOutside = clickableOutside;

        let next = new Clickable();
        next.id = 'characterNext'
        next.color = "#353535";
        next.textColor = "white";
        next.width = 300;
        next.height = 70;
        next.textSize = 18;
        next.x = width/2 - 150;
        next.y = height - 150;
        next.textFont = font;
        next.text = "Proceed to Instructions"
        next.onPress = nextScreenFunc;
        next.onHover = clickableHover;
        next.onOutside = clickableOutside;

        this.input = createInput();
        this.input.addClass('nameInput');
        console.log(this.input);
        this.input.hide();
        this.button = createButton('Submit');
        this.button.addClass('inputButton');
        this.button.hide();
        this.button.mousePressed(setNameFunc);

        this.clickables.push(charSelect, charSelect2, next);
    }

    showHTML() {
        this.input.show();
        this.button.show();
    }

    removeHTML() {
        this.input.remove();
        this.button.remove();
    }

    draw() {
        rectMode(CENTER);
        noStroke();
        fill('#F4D1AE');
        rect(width/2, height/2, 1140, 640, 28);
        fill(color(255, 94, 91, 120));
        rect(width/2, height/2, 1060, 600, 28);
        textAlign(CENTER);
        textSize(50);
        super.draw();
    }
}

// class InstructionScreen extends Screen {
//     constructor() {
//         super();
//     }

//     setup(nextScreenFunc) {
//         let next = new Clickable();
//         next.color = "#11B5E4";
//         next.textColor = "white";
//         next.width = 300;
//         next.height = 70;
//         next.textSize = 18;
//         next.x = width/2 - 150;
//         next.y = height - 150;
//         next.text = "Start Game"
//         // next.textFont = this.bodyFont;
//         next.onPress = nextScreenFunc
//         this.clickables.push(next);
//     }
// }