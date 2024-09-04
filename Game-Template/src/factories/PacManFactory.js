import PacMan from "../entities/PacMan.js";

export default class PacManFactory {
    static createInstance(position, map) {
        return new PacMan(position, map);
    }
}