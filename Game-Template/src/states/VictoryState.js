import State from "../../lib/State.js";
import GameStateName from "../enums/GameStateName.js";
import SoundName from "../enums/SoundName.js";
import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	keys,
	sounds,
	stateMachine,
	timer
} from "../globals.js";

export default class VictoryState extends State {
	/**
	 * Displays a game over screen where the player
	 * can press enter to go back to the title screen.
	 */
	constructor() {
		super();
		this.x = 0

	}

	enter(parameters) {
		sounds.play(SoundName.Level)
		timer.tween(this, ['x'], [CANVAS_WIDTH], 3.5, () => {
			sounds.stop(SoundName.Level)
			this.x = 0
			fetch('./assets/assets/map.json').then((response) => response.json()).then((mapDefinition) => {
				stateMachine.change(GameStateName.Play, { mapDefinition, score: parameters.score, level: parameters.level });
			});
		})
	}

	update() {
		if (keys.Enter) {
			keys.Enter = false;
		}
	}

	render() {

		context.save();
		context.font = '50px Fantasy';
		context.fillStyle = 'white';
		context.fillText('Next Level', this.x, CANVAS_HEIGHT / 2);
		context.restore();
	}
}