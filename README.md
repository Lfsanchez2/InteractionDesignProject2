# Interaction Design Project 2 - Living The 'Dream'
### What It's About:
This game focuses on undocumented immigrants in the US. For more information, refer to the production folder and the ProjectWriteup PDF.
### How it Works: 
This game was made using the p5 and p5 play library. There are 3 custom classes made to build the structure of the game: 
- **ScreenManager** - A 'manager' class built to organize a collection of Screen objects. The manager determines which Screen is drawn on the canvas and the connections between each stream.
- **Screen** - Represents each individual screen of the game. Contains sprites for NPCs, decorative sprites, and walls that will be drawn to the canvas. These sprites are unique to each room.
- **Sprite** - Builds off of p5 play's sprite functionality to add names and other features to each sprite.
    - **Player** - Subclass of Sprite class, represents the player character. The player's name will always appear above the sprite and they can be controlled by the user.
    - **NPC** - Subclass of Sprite class, represents a Non-Playable Character (NPC). NPCs can be interacted with and have unique dialogue which progresses the story of the game.

### How to Play:
- Use WASD/Arrow Keys to move the Player character
- Press 'E' when prompted to interact with NPCs/objects
- Press 'Q' to get a hint of what to do next

### Adobe XD Rough Draft:
- [Here](https://drive.google.com/file/d/11Bl2Z_DGPxN0MsrEO6OKPltvKX4B2Z13/view?usp=sharing)

### Link to Game:
- Game can be played [here](https://xarts.usfca.edu/~lfsanchez/InteractionDesignProject2/)