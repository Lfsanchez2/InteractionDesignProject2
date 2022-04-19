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
        } else {
            this.x = width/2 + 108;
            this.y = height/2 - 109.5;
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
    constructor(path1, path2, path3, bgColor, bg, north, south, east, west) {
        this.bgColor = bgColor;
        if(bg != null) {
            this.backgroundImg = loadImage(bg);
        }

        this.clickables = [];
        this.npcs = new Group();
        this.walls = new Group();

        this.getNPCs = this.getNPCs.bind(this);
        this.getInteractions = this.getInteractions.bind(this);
        this.getWalls = this.getWalls.bind(this);

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
    }

    getNPCs() {
        for(let i = 0; i < this.npcTable.getRowCount(); i++) {
            let npcName = this.npcTable.getString(i, 'Name');
            let xPos = eval(this.npcTable.getString(i, 'X'));
            let yPos = eval(this.npcTable.getString(i, 'Y'));
            let npc = new NPC(npcName, xPos, yPos);
            if(this.npcTable.getNum(i,'Static')) {
                let staticImage = loadImage(this.appearanceTable.getString(i, 'Image'), 
                    () => {
                        npc.newIdleImage(this.npcTable.getString(i, 'ImageName'), staticImage);
                    }
                )
            }
            this.npcs.add(npc);
        }
    }

    getInteractions() {
        for(let i = 0; i < this.interactionTable.getRowCount(); i++) {
            let currNPCIndex = this.interactionTable.getNum(i, 'NPCIndex');
            let npc = this.npcs.get(currNPCIndex);
            npc.addSingleInteraction(this.interactionTable.getString(i, 'Dialogue'));
        }
    }

    getWalls() {
        for(let i = 0; i < this.wallsTable.getRowCount(); i++) {
            let wallLabel = this.wallsTable.getString(i, 'Name');
            let x = eval(this.wallsTable.getString(i, 'X'));
            let y = eval(this.wallsTable.getString(i, 'Y'));
            let image = loadImage(this.wallsTable.getString(i, 'Image'), () => {
                console.log(wallLabel + ": at Position (" + x + ", " + y + ")");
                let wallSprite = createSprite(x, y);
                wallSprite.addImage(wallLabel, image);
                wallSprite.setDefaultCollider();
                this.walls.add(wallSprite);
            });
        }
    }

    draw() {
        this.npcs.forEach((e) => {
            e.draw();
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

// class HomeScreen extends Screen {
//     constructor() {
//         super();
//         this.introIndex = 0;
//     }

//     setup(screenFunc) {
//         let introStart = new Clickable();
//         introStart.id = 'homeStart';
//         introStart.width = 300;
//         introStart.height = 100;
//         introStart.text = "Start Introduction";
//         introStart.textSize = 20;
//         // introStart.textFont = this.bodyFont;
//         introStart.x = width/2 - 200;
//         introStart.y = height-200;
//         introStart.color = "#353535";
//         introStart.textColor = "white";
//         introStart.onPress = screenFunc;
//         introStart.onHover = clickableHover;
//         introStart.onOutside = clickableOutside;
//         this.clickables.push(introStart);
//     }

//     draw() {
//         rectMode(CENTER);
//         fill('#F4D1AE');
//         rect(width/2, height/2, 1140, 640, 28);
//         textAlign(CENTER);
//         // textFont(this.titleFont);
//         textSize(70);
//         fill('#353535');
//         text('Living \'The Dream\'', width/2, 183);
//         fill('white')
//         text('Living \'The Dream\'', width/2, 180);
//         super.draw();
//     }
// }

// class SelectionScreen extends Screen {
//     constructor() {
//         super();
//         this.player = null;
//         this.showPlayer = false;
//     }

//     setup(char1, charSelectFunc, nextScreenFunc) {
//         let charSelect = new Clickable();
//         charSelect.id = 'avatar1';
//         charSelect.image = char1
//         charSelect.color = color(244, 209, 174, 170);
//         charSelect.width = 184;
//         charSelect.height = 220;
//         charSelect.x = width/2 - 300;
//         charSelect.y = height/2 - 100;
//         charSelect.text = '';
//         charSelect.onPress = charSelectFunc;
//         charSelect.stroke = color(244, 209, 174);
//         charSelect.strokeWeight = 3;
//         charSelect.onHover = clickableHover;
//         charSelect.onOutside = clickableOutside;

//         let charSelect2 = new Clickable();
//         charSelect2.id = 'avatar2';
//         charSelect2.color = color(244, 209, 174, 170);
//         charSelect2.width = 184;
//         charSelect2.height = 220;
//         charSelect2.x = width/2 + 116;
//         charSelect2.y = height/2 - 100;
//         charSelect2.text = 'Placeholder';
//         charSelect2.onPress = charSelectFunc;
//         charSelect2.stroke = color(244, 209, 174);
//         charSelect2.strokeWeight = 3;
//         charSelect2.onHover = clickableHover;
//         charSelect2.onOutside = clickableOutside;

//         let next = new Clickable();
//         next.id = 'characterNext'
//         next.color = "#353535";
//         next.textColor = "white";
//         next.width = 300;
//         next.height = 70;
//         next.textSize = 18;
//         next.x = width/2 - 150;
//         next.y = height - 150;
//         // next.textFont = this.bodyFont;
//         next.text = "Proceed to Instructions"
//         next.onPress = nextScreenFunc
//         next.onHover = clickableHover;
//         next.onOutside = clickableOutside;

//         this.clickables.push(charSelect, charSelect2, next);
//     }

//     draw() {
//         rectMode(CENTER);
//         noStroke();
//         fill('#F4D1AE');
//         rect(width/2, height/2, 1140, 640, 28);
//         fill(color(255, 94, 91, 120));
//         rect(width/2, height/2, 1060, 600, 28);
//         // textFont(this.titleFont);
//         textAlign(CENTER);
//         textSize(50);
//         fill('white');
//         text('Select a Character', width/2, 130);
//         super.draw();
//         if(this.showPlayer) {
//             this.player.draw();
//         }
//     }
// }

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