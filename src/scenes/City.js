"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GenericScene_1 = require("./GenericScene");
class City extends GenericScene_1.GenericScene {
    constructor(config) {
        super("city", "assets/map-city.json", config);
    }
}
exports.City = City;
