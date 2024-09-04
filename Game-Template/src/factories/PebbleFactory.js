import Pebble from "../objects/Pebble.js";

export default class PebbleFactory {
    static createInstance(position) {
        return new Pebble(position);
    }
}