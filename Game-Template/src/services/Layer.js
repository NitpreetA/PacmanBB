import TileFactory from "../factories/TileFactory.js";

export default class Layer {
	static BOTTOM = 0;
	static COLLISION = 1;
	static TOP = 2;

	/**
	 * A collection of tiles that comprises
	 * one layer of the map. The tiles are stored
	 * in a 1D array instead of a 2D array to make
	 * accessing an individual tile more efficient
	 * when the layers are thousands of tiles long.
	 *
	 * @param {object} layerDefinition
	 * @param {array} sprites
	 */
	constructor(layerDefinition, sprites) {
		this.tiles = Layer.generateTiles(layerDefinition.data, sprites);
		this.width = layerDefinition.width;
		this.height = layerDefinition.height;
	}

	render() {
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				this.getTile(x, y)?.render(x, y);
			}
		}
	}

	/**
	 * The Y coordinate is multiplied by the map width
	 * to get us to the correct row, then the X coordinate
	 * is added to get us to the correct column in that row.
	 *
	 * @param {number} x
	 * @param {number} y
	 * @returns The Tile that lives at (x, y) in the layer.
	 */
	getTile(x, y) {
		return this.tiles[x + y * this.width];
	}

	/**
	 * @param {object} layerData The exported layer data from Tiled.
	 * @param {array} sprites
	 * @returns An array of Tile objects.
	 */
	static generateTiles(layerData, sprites) {
		const tiles = [];

		layerData.forEach((tileId) => {
			// Tiled exports tile data starting from 1 and not 0, so we must adjust it.
			tileId--;

			// -1 means there should be no tile at this location.

			tiles.push(TileFactory.createInstance(tileId, sprites));
		});

		return tiles;
	}
}