import Ghost from "../entities/Ghost.js";
import PacMan from "../entities/PacMan.js";
import GameStateName from "../enums/GameStateName.js";
import PowerupName from "../enums/PowerupName.js";
import GhostFactory from "../factories/GhostFactory.js";
import PacManFactory from "../factories/PacManFactory.js";
import PebbleFactory from "../factories/PebbleFactory.js";
import PowerupFactory from "../factories/PowerupFactory.js";
import { stateMachine } from "../globals.js";
import GusChicken from "../objects/GusChicken.js";
import JessesChiliP from "../objects/JessesChiliP.js";
import Pebble from "../objects/Pebble.js";
import Powerup from "../objects/Powerup.js";
import Map from "./Map.js";

const CerealType = {
    PacMan: 0,
    Ghost: 1,
    Pebble: 2,
    Powerup: 3
};

export default class GameStateManager {
    static STORAGE_NAME = "gameState";

    static saveGameState(map) {
        let gameState = {};

        gameState.map = { level: map.level };

        gameState.entities = [];
        map.entities.forEach(ent => {
            // There is a lot things we don't want serialized,
            // so I am gonna pick and choose here.
            if(ent instanceof PacMan) {
                gameState.entities.push({
                    score: ent.score,
                    position: ent.tilePos,
                    cereal: CerealType.PacMan
                });
            } else if(ent instanceof Ghost) {
                gameState.entities.push({
                    spawnPoint: ent.spawnPoint,
                    position: ent.tilePos,
                    colour: ent.colour,
                    health: ent.health,
                    spriteDirection: ent.spriteDirection,
                    cereal: CerealType.Ghost
                });
            }
        });

        gameState.objects = [];
        map.objects.forEach(obj => {
            if(obj instanceof Pebble) {
                gameState.objects.push({
                    position: obj.tilePos,
                    cereal: CerealType.Pebble
                });
            } else if(obj instanceof Powerup) {
                gameState.objects.push({
                    position: obj.tilePos,
                    type: obj instanceof JessesChiliP ? PowerupName.JessesChiliP 
                        : obj instanceof GusChicken ? PowerupName.GusChicken : PowerupName.WaltersCook,
                    cereal: CerealType.Powerup
                });
            }
        });

        localStorage.setItem(GameStateManager.STORAGE_NAME, JSON.stringify(gameState));
    }

    static async loadGameState() {
        const gameState = JSON.parse(localStorage.getItem(GameStateManager.STORAGE_NAME));

        const mapDefinition = await (await fetch('./assets/assets/map.json')).json();
        const map = new Map(mapDefinition, 0, gameState.map.level);

        const entities = [];
        gameState.entities.forEach(ent => {
            switch(ent.cereal) {
                case CerealType.PacMan:
                    let pacman = PacManFactory.createInstance(ent.position, map);
                    pacman.score = ent.score;
                    map.pacMan = pacman;
                    entities.push(pacman);
                    break;
                case CerealType.Ghost:
                    let ghost = GhostFactory.createInstance(ent.position, ent.colour, map, ent.health);
                    ghost.spawnPoint = ent.spawnPoint;
                    ghost.spriteDirection = ent.spriteDirection;
                    entities.push(ghost);
                    break;
            }
        });

        const objects = [];
        gameState.objects.forEach(obj => {
            switch(obj.cereal) {
                case CerealType.Pebble:
                    objects.push(PebbleFactory.createInstance(obj.position));
                    break;
                case CerealType.Powerup:
                    objects.push(PowerupFactory.createInstance(obj.position, obj.type));
                    break;
            }
        });

        map.entities = entities;
        map.objects = objects;

        stateMachine.change(GameStateName.Play, { map: map });

        // Remove once loaded
        localStorage.removeItem(GameStateManager.STORAGE_NAME);
    }

    static hasSavedGame() {
        return localStorage.getItem(GameStateManager.STORAGE_NAME) != null;
    }
}