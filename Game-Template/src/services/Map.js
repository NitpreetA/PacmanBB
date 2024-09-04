import Layer from "./Layer.js";
import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	images,
	timer,
} from "../globals.js";
import Tile from "./Tile.js";
import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import Pebble from "../objects/Pebble.js";
import Vector from "../../lib/Vector.js";
import PacMan from "../entities/PacMan.js";
import { getRandomPositiveInteger } from "../../lib/RandomNumberHelpers.js";
import Ghost from "../entities/Ghost.js";
import GhostFactory from "../factories/GhostFactory.js";
import PowerupFactory from "../factories/PowerupFactory.js";
import PowerupName from "../enums/PowerupName.js";
import PacManFactory from "../factories/PacManFactory.js";
import PebbleFactory from "../factories/PebbleFactory.js";
import GhostColours from "../enums/GhostColours.js";

export default class Map {
	/**
	 * The collection of layers, sprites,
	 * and characters that comprises the world.
	 *
	 * @param {object} mapDefinition JSON from Tiled map editor.
	 */
	constructor(mapDefinition,score = 0, level = 0) {
		const sprites = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.TileSet),
			Tile.SIZE,
			Tile.SIZE,
			1,1
		);
		this.bottomLayer = new Layer(mapDefinition.layers[Layer.BOTTOM], sprites);
		this.collisionLayer = new Layer(mapDefinition.layers[Layer.COLLISION], sprites);
		this.topLayer = new Layer(mapDefinition.layers[Layer.TOP], sprites);

		this.pacMan = PacManFactory.createInstance(new Vector(10, 21), this);
		this.level = level
		this.showActivated = []
		this.entities = [];
		this.objects = [];
		this.entities.push(this.pacMan);
		this.pacMan.score = score;

		this.populateMap()
		this.spawnGhosts();
	}

	spawnGhosts() {
        const colourRange = [GhostColours.Blue, GhostColours.Red];
		for(let i = 0; i < 3; i++) {
			let colour = Math.floor(getRandomPositiveInteger(colourRange[0], colourRange[1] - 0.001));
			this.entities.push(GhostFactory.createInstance(new Vector(9 + i, 11), colour, this, Ghost.DEFAULT_HEALTH + this.level)); 
		}
	}

	populateMap() {
		for(let x = 0; x < this.collisionLayer.width; x++) {
			for(let y = 0; y < this.collisionLayer.height; y++) {
				if(this.collisionLayer.getTile(x,y) === null) {
					if(getRandomPositiveInteger(0,100) > 2) {
						this.objects.push(PebbleFactory.createInstance(new Vector(x,y)))
					} else {
						let pos = new Vector(x, y);
						switch(getRandomPositiveInteger(1,3))
						{
							case 1:
								this.objects.push(PowerupFactory.createInstance(pos, PowerupName.GusChicken));
								break;
							case 2: 
								this.objects.push(PowerupFactory.createInstance(pos, PowerupName.WaltersCook));
								break;
							case 3:
								this.objects.push(PowerupFactory.createInstance(pos, PowerupName.JessesChiliP));
								break;
						}
					}
				}
			}
		}
	}

	update(dt) {
		this.entities.forEach(entity => {
			entity.update(dt);

			// Check for object collisions
			this.objects.forEach(object => {
				if(object.didCollideWithEntity(entity.hitbox)) {
					if (object.isCollidable) {
						object.onCollision(entity);
					}
					if(object.isConsumable) {
						object.onConsume(entity);
					}
				}
			});

			// Ghost collisions for PacMan
			if(entity instanceof PacMan) {
				this.entities.forEach(other => {
					if(other instanceof Ghost && entity.didCollideWithEntity(other)) {
						other.onCollision(entity);
					}
				});
			}
		});
		this.checkSlow()
		this.cleanObjects()
		this.objects.forEach(o => o.update(dt));
	}

	getPebble(position) {
		for(let i = 0; i < this.objects.length; i++) {
			if(this.objects[i] instanceof Pebble 
				&& this.objects[i].tilePos.x == position.x
				&& this.objects[i].tilePos.y == position.y
			) {
				return this.objects[i]
			}
		}
		return null;
	}

	cleanObjects() {
		this.objects.filter((object) => object.cleanUp && !(object instanceof Pebble)).forEach(object => this.showActivated.push(object));
		this.showActivated = this.showActivated.filter((object) => !object.activated)
		this.objects = this.objects.filter((object) => 
		{
			if(object instanceof Pebble &&  object.cleanUp)
			{
				this.pacMan.score--;
			}
			return !object.cleanUp
		});
	}

	render() {
		this.bottomLayer.render();
		this.collisionLayer.render();
		this.topLayer.render();
		this.renderScore()
		this.renderLives();
		this.objects.forEach(o => o.render());
		this.entities.forEach(e => e.render());
		this.renderActivated()
	}

	checkSlow() {
		const SLOW_FACTOR = 2.5;
		if (this.pacMan.slow) {
			this.entities.forEach((entity)=> {
				if(entity instanceof Ghost) {
					entity.speed *= SLOW_FACTOR;
					timer.addTask(() => {}, 3, 3, () => {
						entity.speed /= SLOW_FACTOR;
					});
				}
			})
			this.pacMan.slow = false
		}
	}

	/**
	 * Draws a grid of squares on the screen to help with debugging.
	 */
	static renderGrid() {
		context.save();
		context.strokeStyle = Colour.White;

		for (let y = 1; y < CANVAS_HEIGHT / Tile.SIZE; y++) {
			context.beginPath();
			context.moveTo(0, y * Tile.SIZE);
			context.lineTo(CANVAS_WIDTH, y * Tile.SIZE);
			context.closePath();
			context.stroke();

			for (let x = 1; x < CANVAS_WIDTH / Tile.SIZE; x++) {
				context.beginPath();
				context.moveTo(x * Tile.SIZE, 0);
				context.lineTo(x * Tile.SIZE, CANVAS_HEIGHT);
				context.closePath();
				context.stroke();
			}
		}

		context.restore();
	}
	renderScore()
	{
		context.save();
		context.font = '20px Fantasy';
		context.fillStyle = 'white';
		context.fillText(`Current score: ${this.pacMan.score}`, CANVAS_WIDTH / 2 - 75, CANVAS_HEIGHT / 2 + 230);
		context.restore();
	}

	renderActivated()
	{
		this.displayX = 10
		this.showActivated.forEach(object => {
			object.position.x = this.displayX 
			object.position.y = CANVAS_HEIGHT / 2 + 215
			this.displayX+= 15
			object.render()
			timer.addTask(() => {},5,object.activeTime,()=>
			{
				object.activated = true
			})
		});
	}
	renderLives()
	{
		context.font = '20px Fantasy';
		context.fillStyle = 'white';
		context.fillText('Health',CANVAS_WIDTH - 70, 65 + 1 * 20)
		let ghost = this.entities.filter(entity => entity instanceof Ghost)
		for (let i = 0; i < ghost.length; i++) {
			for (let j = 0; j < ghost[i].health; j++) 
			{
				ghost[i].sprites[0].render(CANVAS_WIDTH - 25 * (i+1) , 75 + (j+1) * 20)
			}
		}
	}
}
