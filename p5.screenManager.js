class ScreenManager {
    constructor(screensPath) {
        this.allScreens = new Map();
        this.currID = null;
        this.titleFont = loadFont('assets/fonts/DelaGothicOne-Regular.ttf');
        this.bodyFont = loadFont('assets/fonts/Baloo2-Medium.ttf');
        this.preloadScreens = this.preloadScreens.bind(this);
        this.screenTable = loadTable(screensPath, 'csv', 'header', this.preloadScreens);
    }

    setup() {
        this.allScreens.forEach((value) => {
            value.setup();
        })
    }

    preloadScreens() {
        this.currID = this.screenTable.getString(0,'ID');
        for(let i = 0; i < this.screenTable.getRowCount(); i++) {
            let id = this.screenTable.getString(i, 'ID');
            let npcCSV = this.screenTable.getString(i, 'NPC-CSV');
            let interactionCSV = this.screenTable.getString(i, 'Interaction-CSV');
            let wallsCSV = this.screenTable.getString(i, 'Walls-CSV');

            if(npcCSV === "") {
                npcCSV = null;
            }
            if(interactionCSV === "") {
                interactionCSV = null;
            }
            if(wallsCSV === "") {
                wallsCSV = null;
            }

            let bgColor = this.screenTable.getString(i, 'bgColor');
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
                npcCSV, interactionCSV, wallsCSV, bgColor, bgImg,
                northRoom, southRoom, eastRoom, westRoom
            );
            this.allScreens.set(id, currScreen);
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