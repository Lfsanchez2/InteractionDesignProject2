/**
 * Utility class for creating a Map of Screen objects for a game.
 * ---------------------------------------------------------------------------------------------------
 * The data for all the screens is read from a 'Master' csv file where each row represents an individual
 * screen and the columns are the data of each respective screen.
 * 
 * All the NPCs across the entire game are also stored in a separate map to allow ease of access to each
 * individual NPC. This is useful to remove them or change their appearance based on outside interactions.
 */
class ScreenManager {
    constructor(screensPath) {
        this.allScreens = new Map();
        this.currID = null;
        this.preloadScreens = this.preloadScreens.bind(this);
        this.screenTable = loadTable(screensPath, 'csv', 'header', this.preloadScreens);
        this.allNPCS = new Map();
    }

    /**
     * Calls the setup function for each screen within the allScreens Map
     * @param {*} nextFunc - The function used to advance the two start screens
     * @param {*} font - The font used for the buttons in each start screen
     */
    setup(nextFunc, font) {
        this.allScreens.forEach((key, value) => {
            if(value === 'Home Screen') {
                key.setup(nextFunc, font);
            }
            else if(value === 'Character Screen') {
                key.setup(nextFunc, font);
            } 
            else {
                key.setup();
                for(let i = 0; i < key.npcArray.length; i++) {
                    this.allNPCS.set(key.npcArray[i].name, key.npcArray[i]);
                }
            }            
        })
        // Debug print
        // console.log(this.allNPCS);
    }

    /**
     * Handles the 'preload' actions for all the Screens in the allScreens Map.
     * This is done immediately after the ScreenManager object is created through a callback in the constructor.
     * 
     */
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
                // The CSV that contains the NPC data for a Screen
                let npcCSV = this.screenTable.getString(i, 'NPC-CSV');
                // The CSV that contains the Interaction (dialogue) data for a Screen
                let interactionCSV = this.screenTable.getString(i, 'Interaction-CSV');
                // The CSV that contains the data for all the walls in a Screen
                let wallsCSV = this.screenTable.getString(i, 'Walls-CSV');
                // The CSV that contains the data for all the decorative sprites in a Screen
                let decoCSV = this.screenTable.getString(i, 'Deco-CSV');

                // Having all these CSV files is not required. Any empty file paths will be 
                // replaced with a null value.
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

                // A screen can have a background image if given in the Master CSV
                let bgImg = null;
                if(this.screenTable.getNum(i, 'hasBG')) {
                    bgImg = this.screenTable.getString(i, 'BG-IMG');
                }

                // The room mapped to the North of this current room.
                let northRoom = this.screenTable.getString(i, 'NorthRoom');
                // The room mapped to the South of this current room.
                let southRoom = this.screenTable.getString(i, 'SouthRoom');
                // The room mapped to the West of this current room.
                let westRoom = this.screenTable.getString(i, 'WestRoom');
                // The room mapped to the East of this current room.
                let eastRoom = this.screenTable.getString(i, 'EastRoom');

                // Not every Screen will have an adjacent Screen in every direction, in this case,
                // just give them a null value.
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
                
                // Send all these parameters to a Screen constructor and add that Screen to the allScreens Map.
                let currScreen = new Screen(
                    npcCSV, interactionCSV, wallsCSV, decoCSV, bgColor, bgImg,
                    northRoom, southRoom, eastRoom, westRoom
                );
                this.allScreens.set(id, currScreen);
            }
        }
        // Debug print
        // console.log(this.allScreens);
    }

    /**
     * Method used to update the screen being displayed based on what direction the player goes
     */
    updateScreen(id) {
        this.currID = id;
        return this.getCurrentScreen();
    }

    /**
     * Method used to get a reference to the current screen being displayed
     * @returns The current Screen object being displayed
     */
    getCurrentScreen() {
        return this.allScreens.get(this.currID);
    }

    /**
     * Method used to get a screen object in the allScreens map that matches a given ID
     * @param {*} id The given ID to search for in the allScreens map
     * @returns The Screen object that is mapped to the given ID
     */
    getScreenByName(id) {
        return this.allScreens.get(id);
    }
}