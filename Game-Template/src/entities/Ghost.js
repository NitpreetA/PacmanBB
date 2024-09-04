import Sprite from "../../lib/Sprite.js";
import StateMachine from "../../lib/StateMachine.js";
import Vector from "../../lib/Vector.js";
import Direction from "../enums/Direction.js";
import ImageName from "../enums/ImageName.js";
import { DEBUG, context, images, sounds, timer } from "../globals.js";
import Tile from "../services/Tile.js";
import Entity from "./Entity.js";
import PacMan from "./PacMan.js";
import GhostStateName from "../enums/GhostStateName.js";
import GhostDeadState from "../states/ghost/GhostDeadState.js";
import GhostRepawningState from "../states/ghost/GhostRespawningState.js";
import GhostMovingState from "../states/ghost/GhostMovingState.js";
import SoundName from "../enums/SoundName.js";

export default class Ghost extends Entity {
    static SPRITE_SIZE = 20;
    static DEFAULT_HEALTH = 3;
    static RESPAWN_TIME = 1.75
    static INVULNERABLE_TIME = 3.5;
    static FLICKER_SPEED = 0.25;

    constructor(position, colour, map, health) {
        super(
            new Vector(Ghost.SPRITE_SIZE, Ghost.SPRITE_SIZE), 
            new Vector(position.x * Tile.SIZE, position.y * Tile.SIZE),
            {
                hitboxOffsets: {
                    position: new Vector(2, 2),
                    dimensions: new Vector(-4, -4)
                }
            }
        );

        // Save their spawn location
        this.spawnPoint = new Vector(position.x, position.y);

        // Keep track of their current tile position
        this.tilePos = new Vector(position.x, position.y);

        this.map = map;
        this.scoreValue = 100
        this.allSprites = Ghost.generateSprites();

        this.stateMachine = this.initializeStateMachine();

        this.colour = colour;
        this.sprites = this.allSprites[colour];
        this.spriteDirection = Direction.Up;

        this.isInvulnerable = false;

        this.speed = 0.2 / ((this.map.level + 1 ) * .99)   

        this.alpha = 1.0;

        this.health = health;
    }

    triggerInvulnerability() {
        // Alternate the opacity between 1.0 and 0.5 while invulnerable
        this.alpha = 0.50;
        this.isInvulnerable = true;
        timer.addTask(
            () => {
                this.alpha = this.alpha == 1.0 ? 0.5 : 1.0;
            },
            Ghost.FLICKER_SPEED,
            Ghost.INVULNERABLE_TIME,
            () => {
                this.isInvulnerable = false;
                this.alpha = 1.0;
            }
        );
    }

    onCollision(collider) {
        if(this.isInvulnerable) {
            return;
        }

        if(!(collider instanceof PacMan)) {
            return;
        }
        sounds.play(SoundName.Kill)
        collider.score += 100
        this.stateMachine.change(GhostStateName.Respawning);
    }

    consumePebble(pebble) {
        if(this.stateMachine.currentState != this.stateMachine.states[GhostStateName.Moving]) {
            return;
        }

        // Clean up the pebble
        pebble.cleanUp = true;
    }

    update(dt) {
		this.hitbox.set(
			this.position.x + this.hitboxOffsets.position.x,
			this.position.y + this.hitboxOffsets.position.y,
			this.dimensions.x + this.hitboxOffsets.dimensions.x,
			this.dimensions.y + this.hitboxOffsets.dimensions.y,
		);

        this.stateMachine.update(dt);
    }

    render() {
        context.save();
        context.globalAlpha = this.alpha;
		this.sprites[this.spriteDirection].render(Math.floor(this.position.x), Math.floor(this.position.y));
        context.restore();

		if (DEBUG) {
			this.hitbox.render(context);
		}
    }

    initializeStateMachine() {
        const stateMachine = new StateMachine();

        stateMachine.add(GhostStateName.Dead, new GhostDeadState(this, this.map));
        stateMachine.add(GhostStateName.Respawning, new GhostRepawningState(this, this.map));
        stateMachine.add(GhostStateName.Moving, new GhostMovingState(this, this.map));

        return stateMachine;
    }

    isAlive() {
        return this.health > 0;
    }

    static generateSprites() {
		const sprites = [];
        const xOffset = 1;
        const yOffset = 1 + ((Ghost.SPRITE_SIZE + 1));

		for (let y = 0; y < 2; y++) {
			for (let x = 0; x < 3; x++) {
                sprites[y * 3 + x] = [];
                for(let x1 = 0; x1 < 4; x1++) {
                    sprites[y * 3 + x].push(new Sprite(
                        images.get(ImageName.TileSet), 
                        xOffset + x1 * (Ghost.SPRITE_SIZE + 1) + 4*x*(Ghost.SPRITE_SIZE + 1), 
                        yOffset + y * (Ghost.SPRITE_SIZE + 1), 
                        Ghost.SPRITE_SIZE, 
                        Ghost.SPRITE_SIZE
                    ));
                }
			}
		}
		return sprites;
    }
}