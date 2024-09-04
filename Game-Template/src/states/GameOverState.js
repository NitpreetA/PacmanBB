import GameStateName from "../enums/GameStateName.js";
import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	images,
	keys,
	sounds,
	stateMachine,
	timer,
} from "../globals.js";
import HighScoreManager from "../services/HighScoreManager.js";
import State from "../../lib/State.js";


/**
 * The state in which we've lost all of our health and get our score displayed to us.
 * Should transition to the EnterHighScore state if we exceeded one of our stored high
 * scores, else back to the StartState.
 */
export default class GameOverState extends State {
	constructor() {
		super();
		this.alpha = 0
	}

	enter(parameters) {
		this.alpha = 0
		this.score = parameters.score;
		timer.tween(this,['alpha'],[1],10,()=>{})
	}

	/**
	 * The some() method tests whether at least one element in the array passes the
	 * test implemented by the provided function. It returns true if, in the array,
	 * it finds an element for which the provided function returns true; otherwise
	 * it returns false. It doesn't modify the array.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
	 *
	 * @returns Whether the score is greater than any current high score.
	 */
	wasHighScore() {
		return HighScoreManager.loadHighScores().some((highScore) => this.score > highScore.score);
	}

	update(dt) {
		if (keys.Enter) {
			keys.Enter = false;

			// If the player's score is higher than any score currently in the high score table...
			if (this.wasHighScore()) {
				//sounds.highScore.play();
				stateMachine.change(GameStateName.EnterScore, {
					score: this.score,
				});
			}
			else {
				stateMachine.change(GameStateName.TitleScreen);
			}
		}
	}

	
	render() {
		context.save();
		context.font = '60px FancySerif';
		context.fillStyle = 'rgba(255, 0, 0, ' + this.alpha + ')';
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText('Game Over', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
		context.font = '30px FancySerif';
		context.fillStyle = 'white';
		context.fillText('press enter to continue', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 40);
		context.restore();
	
	}
}
