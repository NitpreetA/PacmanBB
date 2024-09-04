import State from "../../lib/State.js";
import Vector from "../../lib/Vector.js";
import Ghost from "../entities/Ghost.js";
import PacMan from "../entities/PacMan.js";
import GameStateName from "../enums/GameStateName.js";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  context,
  keys,
  stateMachine,
  timer,
} from "../globals.js";
import GameStateManager from "../services/GameStateManager.js"

export default class TitleScreenState extends State {
	constructor() {
		super();
		this.pacMan = new PacMan(new Vector(-20, 150));

		this.ghostSprites = Ghost.generateSprites().flat();

		this.time = 0;
		this.canLoad = false;
	}

	enter() {
        timer.tween(this.pacMan.position, ['x'], [CANVAS_WIDTH], 4,()=>
		{
			this.pacMan.position.x = -this.pacMan.dimensions.x;
			this.enter()
		});
	}

	update(dt) {
		this.time += dt;

		this.canLoad = GameStateManager.hasSavedGame();

		if (keys['1']) {
			keys['1'] = false;
			fetch('./assets/assets/map.json').then((response) => response.json()).then((mapDefinition) => {
				stateMachine.change(GameStateName.Play, { mapDefinition });
			});
		} else if(keys['2'] && this.canLoad) {
			keys['2'] = false;

			GameStateManager.loadGameState();
		}
		else if (keys['3']){
			keys['3'] = false;
			stateMachine.change(GameStateName.Highscore);
		}
		this.pacMan.update(dt, false);
	}

	render() {
		this.renderTitleWindow();

		this.pacMan.render();

		this.scrollingGhosts();
	}

	scrollingGhosts() {
		for(let i = 0; i < this.ghostSprites.length; i++) {
			this.ghostSprites[i].render(
				Math.floor(i * 60 + (this.time * 60)) % (CANVAS_WIDTH + 20) - 20,
				Math.floor(Math.sin(this.time * 6 + i) * 30) + 150
			);
		}
	}

	renderTitleWindow() {
		context.save();
		context.fillStyle = 'rgb(0,0,0, 0.5)';
		context.fillRect(30, 30, CANVAS_WIDTH - 60, CANVAS_HEIGHT - 60);
		context.font = '50px Fantasy';
		context.fillStyle = 'yellow';
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText('Pac Man On Crack ', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 200);
		context.font = '40px Fantasy';
		context.fillStyle = 'white';
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText('1. New Game!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40);
		context.fillStyle = this.canLoad ? 'white' : 'gray';
		context.fillText('2. Resume Game!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 120);
		context.fillStyle = 'white';
		context.fillText('3. View Highscores!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 200);
		context.restore();
	}
}
