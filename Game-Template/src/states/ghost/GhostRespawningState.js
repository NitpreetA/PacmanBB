import State from "../../../lib/State.js";
import Ghost from "../../entities/Ghost.js";
import GhostStateName from "../../enums/GhostStateName.js";
import { timer } from "../../globals.js";
import Tile from "../../services/Tile.js";

export default class GhostRepawningState extends State {
    constructor(ghost, map) {
        super();
        this.ghost = ghost;
        this.map = map;
    }

    enter() {
        // Decrement the Ghost's health
        this.ghost.health = Math.max(0, this.ghost.health - 1);

        // Copy the spawnpoint vector
        let spawnX = this.ghost.spawnPoint.x;
        let spawnY = this.ghost.spawnPoint.y;

        // Set the tilePos accordingly
        this.ghost.tilePos.x = spawnX;
        this.ghost.tilePos.y = spawnY;

        // Tween the Ghost back to their spawn position
		timer.tween(
			this.ghost.position,
			['x', 'y'],
			[spawnX * Tile.SIZE, spawnY * Tile.SIZE],
			Ghost.RESPAWN_TIME,
            () => {
                this.respawnFisished();
            }
		);

        // Trigger invulnerability while respawning
        this.ghost.triggerInvulnerability();
    }

    respawnFisished() {
        if(this.ghost.isAlive()) {
            this.ghost.stateMachine.change(GhostStateName.Moving);
        } else {
            this.ghost.stateMachine.change(GhostStateName.Dead);
        }
    }
}
