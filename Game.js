
import { TextureMan } from "./Texture/TextureManager.js"
import { Texture } from "./Texture/Texture.js";
import { setActiveScene } from './Globals.js';

export default class Game extends Phaser.Scene {

    constructor() {
        super({ key: "Game" });
        
    }
    // ---------------------------------------------------
    // Phaser lifecycle
    // ---------------------------------------------------

    init() {
        console.log("Game initialized");

        // So that scene in availble in all files
        setActiveScene(this);

        TextureMan.Create(1, 1);
    }

    preload() {

        //this.load.image("./assets/HotPink");
        TextureMan.Add(Texture.Name.Aliens, "assets/kindpng_4810910.png");
        //TextureMan.Add(Texture.Name.Birds, "Birds.tga");
        //TextureMan.Add(Texture.Name.PacMan, "PacMan.tga");
        //TextureMan.Add(Texture.Name.Stitch, "stitch.tga");
    }

    create() {
        console.log("===== Manager Tests Begin =====");

        let image = this.textures.get(Texture.Name.Aliens);
        
        image.add('crab_0', 0, 118, 27, 95, 70);

        this.add.sprite(200, 200, Texture.Name.Aliens, 'crab_0').setScale(0.5);

        console.log("===== Manager Tests End =====");
    }

    Update(time, delta) {
        // Game loop placeholder
    }

   
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    // This tells Phaser to start using your Game class defined above
    scene: [Game]
};

// This "turns the key" to start the engine
export const game = new Phaser.Game(config);




