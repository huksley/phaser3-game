"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GenericScene_1 = require("./GenericScene");
class Dungeon extends GenericScene_1.GenericScene {
    constructor(config) {
        super("dungeon", "assets/map-dungeon.json", config);
    }
}
exports.Dungeon = Dungeon;
