"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GenericScene_1 = require("./GenericScene");
class Fortress extends GenericScene_1.GenericScene {
    constructor(config) {
        super("fortress", "assets/map-fortress.json", config);
        this.startTileX = 3;
        this.startTileY = 23;
    }
}
exports.Fortress = Fortress;
