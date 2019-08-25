"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GenericScene_1 = require("./GenericScene");
class Home extends GenericScene_1.GenericScene {
    constructor(config) {
        super("home", "assets/map-home.json", config);
    }
}
exports.Home = Home;
