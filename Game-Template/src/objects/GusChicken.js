import PacMan from "../entities/PacMan.js";
import SoundName from "../enums/SoundName.js";
import { sounds, timer } from "../globals.js";
import Powerup from "./Powerup.js";

export default class GusChicken extends Powerup {
    constructor(position) {
		super(position);

        this.sprites = Powerup.generateSprite(13, 2);
        this.activeTime = 3;
    }

    onConsume(consumer) {
        if(consumer instanceof PacMan) {
            sounds.play(SoundName.Eating);
            timer.addTask(() => { consumer.spawnPebble = true; }, 0.1, this.activeTime, () => { consumer.spawnPebble = false; });
            
            this.cleanUp = true;
        }
    }
}
