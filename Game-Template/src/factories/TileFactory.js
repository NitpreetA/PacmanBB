import Tile from "../services/Tile.js";

export default class TileFactory {
    static createInstance(id, sprites) {
        if(id === -1) {
            return null;
        }
        return new Tile(id, sprites);
    }
}