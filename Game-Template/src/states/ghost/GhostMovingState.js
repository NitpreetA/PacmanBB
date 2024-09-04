import State from "../../../lib/State.js";
import Vector from "../../../lib/Vector.js";
import { timer } from "../../globals.js";
import Tile from "../../services/Tile.js";
import Direction from "../../enums/Direction.js";

export default class GhostMovingState extends State {
    constructor(ghost, map) {
        super();
        this.ghost = ghost;
        this.map = map;

        this.currentMoveTask = null;
        this.targetedPebble = null;
        this.moveStack = [];
        this.isMoving = false;
    }

    update(dt) {
        if(!this.isMoving) {
            if(this.moveStack.length == 0) {
                this.findNextPebble(this.ghost.tilePos);
            }

            this.move();
        }
    }

    exit() {
        // Removing the current move task for tweening the movement
        if(this.currentMoveTask) {
            timer.removeTask(this.currentMoveTask);
        }

        // Delete the current BFS move stack and untarget the current pebble
        this.moveStack = [];
        if(this.targetedPebble != null) {
            this.targetedPebble.targeted = false;
            this.targetedPebble = null;
        }

        // We are exiting, so isMoving should be false.
        this.isMoving = false;
    }

    findNextPebble(start) {
        // this is positively, absolutely awful.
        let discovered = [];
        let bfs = [];
        let fromLocations = [];
        bfs.push({pos: start, dir: Direction.Up});

        let solution = [];
        while(bfs.length != 0) {
            let curr = bfs.shift();
            let pebble = this.map.getPebble(curr.pos);
            discovered.push(curr);
            if(pebble && curr.pos != start) {
                solution = [];
                let backtrack = curr;
                this.targetedPebble = pebble;
                solution.push(curr);
                while(1) {
                    let from = fromLocations[backtrack.pos.x * 1000 + backtrack.pos.y];
                    if(from.pos.x == start.x && from.pos.y == start.y) {
                        break;
                    }
                    solution.push(from);
                    backtrack = from;
                }
                if(!pebble.targeted) {
                    pebble.targeted = true
                    this.moveStack = solution;
                    return;
                }
            }

            this.findValidMoves(curr, discovered).forEach(next => {
                fromLocations[next.pos.x * 1000 + next.pos.y] = curr;
                bfs.push(next);
            });
        }
        this.moveStack = solution;
    }

    findValidMoves(current, discovered) {
        let adjacents = [
            { pos: new Vector(current.pos.x - 1, current.pos.y), dir: Direction.Left },
            { pos: new Vector(current.pos.x + 1, current.pos.y), dir: Direction.Right },
            { pos: new Vector(current.pos.x, current.pos.y - 1), dir: Direction.Up },
            { pos: new Vector(current.pos.x, current.pos.y + 1), dir: Direction.Down },
        ];

        return adjacents.filter(a => { 
            if(!this.isValidMove(a.pos.x, a.pos.y)) {
                return false;
            }
            for(let i = 0; i < discovered.length; i++) {
                if(discovered[i].pos.x == a.pos.x && discovered[i].pos.y == a.pos.y) {
                    return false;
                }
            }
            return true;
        });
    }

	tweenMovement(x, y) {
		this.isMoving = true;

		this.currentMoveTask = timer.tween(
			this.ghost.position,
			['x', 'y'],
			[x * Tile.SIZE, y * Tile.SIZE],
			this.ghost.speed, // TODO
			() => {
				this.isMoving = false;
			}
		);
	}

	move() {
        if(this.moveStack.length == 0) {
            return;
        }

        let nextMove = this.moveStack.pop();

		let x = nextMove.pos.x;
		let y = nextMove.pos.y;

		this.ghost.tilePos.x = x;
		this.ghost.tilePos.y = y;

        if(nextMove.dir == Direction.Up) {
            this.ghost.spriteDirection = 3;
        } else if(nextMove.dir == Direction.Down) {
            this.ghost.spriteDirection = 2;
        } else if(nextMove.dir == Direction.Left) {
            this.ghost.spriteDirection = 0;
        } else if(nextMove.dir == Direction.Right) {
            this.ghost.spriteDirection = 1;
        }

		this.tweenMovement(x, y);
	}

	isValidMove(x, y) {
        const WALL_ID = 64;
        let tile = this.map.collisionLayer.getTile(x, y);
		return tile === null
            || (this.ghost.tilePos.x == this.ghost.spawnPoint.x && this.ghost.tilePos.y == this.ghost.spawnPoint.y && tile.id == WALL_ID);
	}
}
