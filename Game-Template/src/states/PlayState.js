import State from "../../lib/State.js";
import Vector from "../../lib/Vector.js";
import Ghost from "../entities/Ghost.js";
import PacMan from "../entities/PacMan.js";
import GameStateName from "../enums/GameStateName.js";
import SoundName from "../enums/SoundName.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, keys, sounds, stateMachine } from "../globals.js";
import Pebble from "../objects/Pebble.js";
import Map from "../services/Map.js";
import GameStateManager from "../services/GameStateManager.js";

export default class PlayState extends State {
	constructor() {
		super();
	}

	enter(params) {
		sounds.play(SoundName.Music);
		if(params.map == null) {
			this.map = new Map(params.mapDefinition, params.score, params.level);
		} else {
			this.map = params.map;
		}
	}

	exit() {
		sounds.stop(SoundName.Music);
	}

	update(dt) {
		if(keys.Escape) {
			keys.Escape = false;

			GameStateManager.saveGameState(this.map);
			stateMachine.change(GameStateName.TitleScreen);
		}

		this.map?.update(dt);
		this.checkLoss();
		this.checkVictory();
	}

	checkLoss() {
		this.pebbles = this.map.objects.filter((object) => object instanceof Pebble);
		if(this.pebbles.length === 0) {
			stateMachine.change(GameStateName.GameOver,{score: this.map.pacMan.score});
		}
	}

	checkVictory() {
		let ghosts = this.map.entities.filter((entity)=>entity instanceof Ghost)
		const allDead = ghosts.reduce((alive, ghost) => alive && !ghost.isAlive(), true); 
		if(allDead) {
			stateMachine.change(GameStateName.Victory,{score: this.map.pacMan.score, level: this.map.level + 1});
		} 
	}

	render() {
		context.save()

		// context.translate( (this.map.bottomLayer.width - 1) /2 *Tile.SIZE,0)
		this.map?.render();

		this.drawInstructions();

		context.restore();
	}

	drawInstructions() {
		context.save();
		context.font = '12px Fantasy';
		context.fillStyle = 'white';
		context.fillText("Press Escape to save and exit", CANVAS_WIDTH / 2 - 75, CANVAS_HEIGHT / 2 + 245);
		context.restore();
	}
}
