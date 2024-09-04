import State from "../../../lib/State.js";

export default class GhostDeadState extends State {
    constructor(ghost, map) {
        super();
        this.ghost = ghost;
        this.map = map;
    }
}
