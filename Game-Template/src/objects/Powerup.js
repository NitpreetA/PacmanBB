import Sprite from "../../lib/Sprite.js";
import Vector from "../../lib/Vector.js";
import ImageName from "../enums/ImageName.js";
import { images } from "../globals.js";
import GameObject from "./GameObject.js";

export default class Powerup extends GameObject {
    static SIZE = 20;

    constructor(position) {
		super(
            new Vector(Powerup.SIZE, Powerup.SIZE), 
            new Vector(position.x * Powerup.SIZE, position.y * Powerup.SIZE),
            {
                hitboxOffsets: {
                    position: new Vector(5, 5),
                    dimensions: new Vector(-9, -9)
                }
            }
        )

        this.tilePos = position;

        this.activated = false;
        this.isConsumable = true;
    }

    render() {
        super.render();
    }

    static generateSprite(x, y) {
        const xOffset = 1;
        const yOffset = 1;
		let sprites = [];
        sprites.push(new Sprite(
            images.get(ImageName.TileSet),
            xOffset + x * (Powerup.SIZE + 1), 
            yOffset + y * (Powerup.SIZE + 1),
            Powerup.SIZE,
            Powerup.SIZE
        ));

        return sprites;
    }
}