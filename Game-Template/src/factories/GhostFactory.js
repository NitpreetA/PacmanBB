import { getRandomPositiveNumber } from "../../lib/RandomNumberHelpers.js";
import Ghost from "../entities/Ghost.js";
import GhostColours from "../enums/GhostColours.js";

export default class GhostFactory {
    static createInstance(mapPosition, colour, map, health) {
        return new Ghost(mapPosition, colour, map, health);
    }
}