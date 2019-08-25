"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GenericScene_1 = require("./GenericScene");
class Tunnel extends GenericScene_1.GenericScene {
    constructor(config) {
        super("tunnel", "assets/map-tunnel.json", config);
        this.startTileX = 3;
        this.startTileY = 8;
    }
}
exports.Tunnel = Tunnel;
