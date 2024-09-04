import Animation from "../../../lib/Animation.js";
import State from "../../../lib/State.js";
import Vector from "../../../lib/Vector.js";
import PacMan from "../../entities/PacMan.js";
import Direction from "../../enums/Direction.js";
import PacManStateName from "../../enums/PacManStateName.js";
import { CANVAS_HEIGHT, keys, timer } from "../../globals.js";
import Pebble from "../../objects/Pebble.js";
import Tile from "../../services/Tile.js";

export default class PacManMovingState extends State {
    constructor(pacMan, collisionLayer) {
        super();

        this.pacMan = pacMan;
		this.collisionLayer = collisionLayer;

        this.isMoving = false;
    }

    enter() {

    }

    update(dt) {
        this.handleMovement(dt);
    }

	handleMovement(dt) {
		if(this.isMoving) {
			return;
		}

		this.updateDirection();
		this.move();
	}

	tweenMovement(x, y) {
		this.isMoving = true;

		timer.tween(
			this.pacMan.position,
			['x', 'y'],
			[x * Tile.SIZE, y * Tile.SIZE],
			this.pacMan.speed,
			() => {
				this.isMoving = false;

				this.updateDirection();
			}
		);
	}

	move() {
		let x = this.pacMan.tilePos.x;
		let y = this.pacMan.tilePos.y;
		if(this.pacMan.spawnPebble)
		{
			if(!this.pacMan.map.getPebble(new Vector(x, y)))
			{
				this.pacMan.map.objects.push(new Pebble(new Vector(x, y)));
			}
			
		}
		if (this.pacMan.direction === Direction.Up) {
			y--;
		}
		else if (this.pacMan.direction === Direction.Down) {
			y++;
		}
		else if (this.pacMan.direction === Direction.Left) {
			x--;
		}
		else if (this.pacMan.direction === Direction.Right) {
			x++;
		}

		if (!this.isValidMove(x, y)) {
			return;
		}

		this.pacMan.tilePos.x = x;
		this.pacMan.tilePos.y = y;

		this.tweenMovement(x, y);
	}

    updateDirection() {
		if (keys.s) {
			this.pacMan.direction = Direction.Down;
		}
		else if (keys.d) {
			this.pacMan.direction = Direction.Right;
		}
		else if (keys.w) {
			this.pacMan.direction = Direction.Up;
		}
		else if (keys.a) {
			this.pacMan.direction = Direction.Left;
		}
		else {
			this.pacMan.stateMachine.change(PacManStateName.Idling);
		}
	}

	isValidMove(x, y) {
		return this.collisionLayer?.getTile(x, y) === null;
	}
}
