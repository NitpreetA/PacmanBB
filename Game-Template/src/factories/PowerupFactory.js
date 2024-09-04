import PowerupName from "../enums/PowerupName.js";
import GusChicken from "../objects/GusChicken.js"
import JessesChiliP from "../objects/JessesChiliP.js"
import WaltersCook from "../objects/WaltersCook.js"

export default class PowerupFactory {
    static createInstance(position, type) {
        switch(type) {
            case PowerupName.GusChicken:
                return new GusChicken(position);
            case PowerupName.JessesChiliP:
                return new JessesChiliP(position);
            case PowerupName.WaltersCook:
                return new WaltersCook(position);
        }
    }
}