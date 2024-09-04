import PacMan from "../entities/PacMan.js";
import SoundName from "../enums/SoundName.js";
import { sounds } from "../globals.js";
import Powerup from "./Powerup.js";

export default class WaltersCook extends Powerup {
    constructor(position) {
		super(position);

        this.sprites = Powerup.generateSprite(15, 5);
        this.activeTime = 3;
    }

    onConsume(consumer) {
        if(consumer instanceof PacMan) {
            sounds.play(SoundName.Snort);
            consumer.slow = true;
            this.cleanUp = true;
        }
    }
}