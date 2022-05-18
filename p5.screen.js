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
}

/**
 * Utility class for defining each screen of the game.
 * ------------------------------------------------------------------------------------
 * Each Screen object has data which is gathered from 4 separate CSV files (optional - it isn't
 * required for a Screen to have all 4 CSVs). 
 *  - An NPC CSV file - Determines name, position, scale, and sprite image/animation of the NPCs 
 *    for a given screen.
 *  - An Interaction CSV file - Determines the dialogue options for each NPC in a given screen.
 *  - A Decoration CSV file - Determines the name, position, scale, image, and whether a decorative
 *    sprite is collidable in a given screen.
 *  - A Walls CSV file - Determines the name, position, and image for each of the walls in a given screen.
 * 
 * All these CSV files are saved in tables stored in each Screen
 * 
 * Each screen also has a Clickables array, but this is only utilized by the starting screens.
 * 
 * The npc array contains references to the NPC Sprite Objects themselves while the npcSprites Group contains
 * references to the p5 play sprites of these NPCs. It is important to make this distinction because NPC class
 * functions will not work on the p5 play sprites.
 * 
 * The walls array contains references to the Sprite objects while the wallSprites Group contains references to
 * the p5 play sprites of the custom Sprite objects. It is important to make this distinction because Sprite class
 * functions will not work on the p5 play sprites.
 * 
 * The decoSprites Group contains references to all the non-collidable decoration sprites, while the decoColliders
 * Group contains references to all the collidable decoration sprites.
 */
class Screen {
    constructor(path1, path2, path3, path4, bgColor, bg, north, south, east, west) {
        this.bgColor = bgColor;
        if(bg != null) {
            this.backgroundImg = loadImage(bg);
        }

        this.clickables = [];
        this.npcArray = [];
        this.npcSprites = new Group();
        this.walls = []
        this.wallSprites = new Group();
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
            let npcScale = this.npcTable.getString(i, 'Scale');
            let visibility = this.npcTable.getNum(i, 'Visible');
            let xPos = eval(this.npcTable.getString(i, 'X'));
            let yPos = eval(this.npcTable.getString(i, 'Y'));
            let prompt = this.npcTable.getString(i, 'Prompt');
            let npc = new NPC(npcName, xPos, yPos, prompt);
            if(this.npcTable.getNum(i,'Static')) {
                let images = this.npcTable.getString(i, 'Image').split(',');
                let names = this.npcTable.getString(i, 'ImageName').split(',');
                for(let i = 0; i < images.length; i++) {
                    npc.newIdleImage(names[i], loadImage(images[i]));
                }
            } else {
                npc.sprite.width = 100;
                npc.sprite.height = 100;
            }
            npc.sprite.scale = npcScale;
            npc.sprite.visible = visibility;
            this.npcSprites.add(npc.sprite);
            this.npcArray.push(npc);
        }
    }

    getInteractions() {
        for(let i = 0; i < this.interactionTable.getRowCount(); i++) {
            let currNPCIndex = this.interactionTable.getNum(i, 'NPCIndex');
            let dialogue = this.interactionTable.getString(i, 'Dialogue');
            let level = this.interactionTable.getNum(i, 'ProgressLevel');
            let npc = this.npcArray[currNPCIndex];
            npc.addSingleInteraction(dialogue, level);
        }
    }

    getWalls() {
        for(let i = 0; i < this.wallsTable.getRowCount(); i++) {
            let wallLabel = this.wallsTable.getString(i, 'Name');
            let x = eval(this.wallsTable.getString(i, 'X'));
            let y = eval(this.wallsTable.getString(i, 'Y'));
            let image = loadImage(this.wallsTable.getString(i, 'Image'), () => {
                let wallSprite = new Sprite(wallLabel, x, y);
                wallSprite.newIdleImage('wall',image);
                wallSprite.sprite.setDefaultCollider();
                this.walls.push(wallSprite);
                this.wallSprites.add(wallSprite.sprite);
            });
        }
    }

    addWall(path, x, y) {
        let image = loadImage(path, () => {
            let newWall = new Sprite('NewWall', x, y);
            newWall.newIdleImage('wall', image);
            newWall.sprite.setDefaultCollider();
            this.walls.push(newWall);
            this.wallSprites.add(newWall.sprite);
        })
    }

    getDeco() {
        for(let i = 0; i < this.decoTable.getRowCount(); i++) {
            let decoLabel = this.decoTable.getString(i, 'Name');
            let x = eval(this.decoTable.getString(i, 'X'));
            let y = eval(this.decoTable.getString(i, 'Y'));
            let collisionCheck = this.decoTable.getNum(i, 'Collision-Object');
            let imagePath = this.decoTable.getString(i, 'Image');
            let scale = this.decoTable.getNum(i, 'Scale');
            let decoSprite;
            if(imagePath === '') {
                if(collisionCheck) {
                    decoSprite = createSprite(x, y, 80, 80);
                } else {
                    decoSprite = createSprite(x, y, 50, 50);
                }
                
            } else {
                let image = loadImage(imagePath);
                decoSprite = createSprite(x, y);
                decoSprite.addImage(decoLabel, image);
            }
            decoSprite.scale = scale;
            if(collisionCheck) {
                decoSprite.setDefaultCollider();
                this.decoColliders.add(decoSprite);
            }
            this.decoSprites.add(decoSprite);
        }
    }

    draw() {
        drawSprites(this.wallSprites);
        drawSprites(this.decoSprites);
        drawSprites(this.npcSprites);
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

    getNPC(name) {
        for(let i = 0; this.npcArray.length; i++) {
            if(this.npcArray[i].name === name) {
                return this.npcArray[i];
            }
        }
    }

    updateWalls(array) {
        for(let i = 0; i < array.length; i++) {
            let deleteName = array[i];
            for(let i = 0; i < this.walls.length; i++){
                if(deleteName === this.walls[i].name) {
                    this.walls.splice(i, 1);
                    break;
                }
            }
        }
        this.wallSprites.clear();
        for(let i = 0; i < this.walls.length; i++) {
            this.wallSprites.add(this.walls[i].sprite);
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
        this.title = 'Introduction / How to Play'
        this.nextID = 'Memory Hall South';
    }

    setup(nextScreenFunc, font) {
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
        next.text = "Start Game"
        next.onPress = nextScreenFunc;
        next.onHover = clickableHover;
        next.onOutside = clickableOutside;

        this.clickables.push(next);
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
        this.clickables[0].draw();
        push();
        imageMode(CENTER);
        image(instructionImg, canvasWidth/4, canvasHeight/2 + 50);
        pop();
    }
}