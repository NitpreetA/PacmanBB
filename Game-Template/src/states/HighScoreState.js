import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	MAX_HIGH_SCORES,
	context,
	images,
	keys,
	sounds,
	stateMachine,
} from "../globals.js";
import HighScoreManager from "../services/HighScoreManager.js";
import State from "../../lib/State.js";
import GameStateName from "../enums/GameStateName.js";
export default class HighScoreState extends State {
	constructor() {
		super();
	}

	enter(parameters) {
		this.highScores = HighScoreManager.loadHighScores();
	}

	update(dt) {
		// Return to the start screen if we press escape.
		if (keys.Escape) {
			keys.Escape = false;
			stateMachine.change(GameStateName.TitleScreen);
		}
	}

	render() {
		context.save();
		context.fillStyle = "white";
		context.font = "40px Joystix";
		context.textAlign = 'center';
		context.fillText(`🎉 HIGH SCORES 🎉`, CANVAS_WIDTH /2,CANVAS_HEIGHT /2 - 200);

		for (let i = 0; i < MAX_HIGH_SCORES; i++) {
			const name = this.highScores[(i)].name ?? '---';
			const score = this.highScores[(i)].score ?? '---';

			context.textAlign = 'left';
			context.fillText(`${(i+1)}.`, CANVAS_WIDTH * 0.25, 75 + (i+1) * 100);
			context.textAlign = 'center';
			context.fillText(`${name}`, CANVAS_WIDTH * 0.5, 75 + (i+1) * 100);
			context.textAlign = 'right';
			context.fillText(`${score}`, CANVAS_WIDTH * 0.75, 75 + (i+1) * 100);
		}

		context.font = "20px Joystix";
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText(`Press Escape to return to the main menu!`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.95);
		context.restore();
	}
}