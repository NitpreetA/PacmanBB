import Animation from "../../../lib/Animation.js";
import State from "../../../lib/State.js";
import Direction from "../../enums/Direction.js";
import PacManStateName from "../../enums/PacManStateName.js";
import { keys } from "../../globals.js";

export default class PacManIdleState extends State {
    constructor(pacMan) {
        super();
        this.pacMan = pacMan;
        this.animation = {
            [Direction.Up]: new Animation([3],1),
            [Direction.Down]: new Animation([2],1),
            [Direction.Left]: new Animation([0],1),
            [Direction.Right]: new Animation([1],1),
            
        }

    }

    enter() {

    }

    update(dt) {
    this.checkForMovement()
    }
	checkForMovement() {
		if (keys.s) {
			this.pacMan.direction = Direction.Down;
            this.pacMan.stateMachine.change(PacManStateName.Moving);
		}
		else if (keys.d) {
			this.pacMan.direction = Direction.Right;
			this.pacMan.stateMachine.change(PacManStateName.Moving);
		}
		else if (keys.w) {
			this.pacMan.direction = Direction.Up;
			this.pacMan.stateMachine.change(PacManStateName.Moving);
		}
		else if (keys.a) {
			this.pacMan.direction = Direction.Left;
			this.pacMan.stateMachine.change(PacManStateName.Moving);
		}
	}

}