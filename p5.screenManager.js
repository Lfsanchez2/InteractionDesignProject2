class ScreenManager {
    constructor(screensPath) {
        this.allScreens = new Map();
        this.currID = null;
        this.titleFont = loadFont('assets/fonts/DelaGothicOne-Regular.ttf');
        this.bodyFont = loadFont('assets/fonts/Baloo2-Medium.ttf');
        this.preloadScreens = this.preloadScreens.bind(this);
        this.screenTable = loadTable(screensPath, 'csv', 'header', this.preloadScreens);
    }

    setup(playerImg, player2Img, nextFunc, setNameFunc, characterSelectFunc, font) {
        this.allScreens.forEach((key, value) => {
            if(value === 'Home Screen') {
                key.setup(nextFunc, font);
            }
            else if(value === 'Character Screen') {
                key.setup(playerImg, player2Img, nextFunc, setNameFunc, characterSelectFunc, font);
            } 
            else {
                key.setup();
            }            
        })
    }

    preloadScreens() {
        this.currID = this.screenTable.getString(0,'ID');
        for(let i = 0; i < this.screenTable.getRowCount(); i++) {
            let id = this.screenTable.getString(i, 'ID');
            let bgColor = this.screenTable.getString(i, 'bgColor');
            if (id === 'Home Screen') {
                let currScreen = new HomeScreen(null, null, null, null, bgColor, null,null, null, null, null);
                this.allScreens.set(id, currScreen);
            }
            else if (id === 'Character Screen') {
                let currScreen = new CharacterScreen(null, null, null, null, bgColor, null,null, null, null, null);
                this.allScreens.set(id, currScreen);
            }
            else {

                let npcCSV = this.screenTable.getString(i, 'NPC-CSV');
                let interactionCSV = this.screenTable.getString(i, 'Interaction-CSV');
                let wallsCSV = this.screenTable.getString(i, 'Walls-CSV');
                let decoCSV = this.screenTable.getString(i, 'Deco-CSV');

                if(npcCSV === "") {
                    npcCSV = null;
                }
                if(interactionCSV === "") {
                    interactionCSV = null;
                }
                if(wallsCSV === "") {
                    wallsCSV = null;
                }
                if(decoCSV === "") {
                    decoCSV = null;
                }

                let bgImg = null;

                if(this.screenTable.getNum(i, 'hasBG')) {
                    bgImg = this.screenTable.getString(i, 'BG-IMG');
                }

                let northRoom = this.screenTable.getString(i, 'NorthRoom');
                let southRoom = this.screenTable.getString(i, 'SouthRoom');
                let westRoom = this.screenTable.getString(i, 'WestRoom');
                let eastRoom = this.screenTable.getString(i, 'EastRoom');

                if (northRoom === "") {
                    northRoom = null;
                }
                if (southRoom === "") {
                    southRoom = null;
                }
                if (westRoom === "") {
                    westRoom = null;
                }
                if (eastRoom === "") {
                    eastRoom = null;
                }
                
                let currScreen = new Screen(
                    npcCSV, interactionCSV, wallsCSV, decoCSV, bgColor, bgImg,
                    northRoom, southRoom, eastRoom, westRoom
                );
                this.allScreens.set(id, currScreen);
            }
        }
        console.log(this.allScreens);
    }

    updateScreen(id) {
        this.currID = id;
        return this.getCurrentScreen();
    }

    getCurrentScreen() {
        return this.allScreens.get(this.currID);
    }
}