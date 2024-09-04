import Sprite from "../../lib/Sprite.js";
import Vector from "../../lib/Vector.js";
import Ghost from "../entities/Ghost.js";
import PacMan from "../entities/PacMan.js";
import ImageName from "../enums/ImageName.js";
import { images } from "../globals.js";

import GameObject from "./GameObject.js";

export default class Pebble extends GameObject {
    static SIZE = 20;

    constructor(position) {
		super(
            new Vector(Pebble.SIZE, Pebble.SIZE), 
            new Vector(position.x * Pebble.SIZE, position.y * Pebble.SIZE),
            {
                hitboxOffsets: {
                    position: new Vector(5, 5),
                    dimensions: new Vector(-9, -9)
                }
            }
        )

        this.tilePos = position;
        
        this.sprites = Pebble.generateSprite();

        this.isConsumable = true;

        // Used in Ghost's BFS.
        this.targeted = false;
    }

    onConsume(consumer) {
        if(consumer instanceof Ghost) {
            consumer.consumePebble(this);
            
        }
    }

    render() {
        super.render();
    }

    static generateSprite() {
        let x = 12
        let y = 0
        const xOffset = 1;
        const yOffset = 1 ;
		let sprites = [];
        sprites.push(new Sprite(
            images.get(ImageName.TileSet),
            xOffset + x * (Pebble.SIZE + 1), 
            yOffset + y * ( Pebble.SIZE+ 1),
            Pebble.SIZE,
            Pebble.SIZE
        ));

        return sprites;
    }
}