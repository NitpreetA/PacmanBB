import Sprite from "../../lib/Sprite.js";
import Animation from "../../lib/Animation.js";
import ImageName from "../enums/ImageName.js";
import PacManStateName from "../enums/PacManStateName.js";
import Entity from "./Entity.js";
import Vector from "../../lib/Vector.js";
import { images, timer } from "../globals.js";
import StateMachine from "../../lib/StateMachine.js";
import PacManMovingState from "../states/pacman/PacManMovingState.js";
import PacManIdleState from "../states/pacman/PacManIdleState.js";
import Direction from "../enums/Direction.js";
import Tile from "../services/Tile.js";

export default class PacMan extends Entity {
    static SPRITE_SIZE = 20;


    constructor(position, map) {
        super(
            new Vector(PacMan.SPRITE_SIZE, PacMan.SPRITE_SIZE), 
            new Vector(position.x * Tile.SIZE, position.y * Tile.SIZE),
            {
                hitboxOffsets: {
                    position: new Vector(3, 3),
                    dimensions: new Vector(-4, -4)
                }
            }
        );
        this.score = 0
        this.tilePos = position;
        this.map = map;
        this.allSprites = PacMan.generateSprites();
        this.sprites = this.allSprites[1];
        this.currentAnimation = new Animation([ 0, 1, 2, 3, 2, 1 ], 0.1);
        this.stateMachine = this.initializeStateMachine()
        this.direction = Direction.Right;
        this.speed =  0.175
        this.slow = false
        this.spawnPebble = false
    }

    initializeStateMachine() {
        const stateMachine = new StateMachine();

        stateMachine.add(PacManStateName.Moving, new PacManMovingState(this, this.map?.collisionLayer));
        stateMachine.add(PacManStateName.Idling, new PacManIdleState(this));

        stateMachine.change(PacManStateName.Idling);

        return stateMachine;
    }

    update(dt) {
        super.update(dt);

        if(this.direction == Direction.Left)
        {
            this.sprites = this.allSprites[0]
        }
        else if(this.direction == Direction.Right)
        {
            this.sprites = this.allSprites[1]
        }
        else if(this.direction == Direction.Down)
        {
            this.sprites = this.allSprites[2]
        }
        else if(this.direction == Direction.Up)
        {
            this.sprites = this.allSprites[3]
        } 
    }

    render() {
        this.renderEntity();
    }

    static generateSprites() {
		const sprites = [];
        const xOffset = 1;
        const yOffset = 1 + ((PacMan.SPRITE_SIZE + 1) * 3);

		for (let y = 0; y < 4; y++) {
            sprites[y] = [];
			for (let x = 0; x < 4; x++) {
				sprites[y].push(new Sprite(
                    images.get(ImageName.TileSet), 
                    xOffset + x * (PacMan.SPRITE_SIZE + 1), 
                    yOffset + y * (PacMan.SPRITE_SIZE + 1), 
                    PacMan.SPRITE_SIZE, 
                    PacMan.SPRITE_SIZE
                ));
			}
		}
		return sprites;
    }
}