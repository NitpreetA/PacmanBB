import PacMan from "../entities/PacMan.js";
import SoundName from "../enums/SoundName.js";
import { sounds, timer } from "../globals.js";
import Powerup from "./Powerup.js";

export default class JessesChiliP extends Powerup {
    constructor(position) {
		super(position);
        
        this.sprites = Powerup.generateSprite(15, 4);
        this.activeTime = 5;
    }

    onConsume(consumer) {
        const SPEED_FACTOR = 1.9;
        if(consumer instanceof PacMan) {
            sounds.play(SoundName.Snort);
            consumer.speed /= SPEED_FACTOR;
            timer.addTask(() => {}, 5, 5, () => { consumer.speed *= SPEED_FACTOR });
            this.cleanUp = true;
        }
    }
}
