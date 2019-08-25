"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Phaser = require("phaser");
const City_1 = require("./scenes/City");
const Home_1 = require("./scenes/Home");
const Dungeon_1 = require("./scenes/Dungeon");
const Tunnel_1 = require("./scenes/Tunnel");
const Fortress_1 = require("./scenes/Fortress");
const ftch_1 = require("./ftch");
const UI_1 = require("./UI");
function firstScene() {
    var l = ["city", "home", "dungeon", "tunnel", "fortress"];
    var n = [City_1.City, Home_1.Home, Dungeon_1.Dungeon, Tunnel_1.Tunnel, Fortress_1.Fortress];
    console.log("Scenes", l, n, "location", window.location.hash);
    if (window.location.hash != "") {
        var pick = -1;
        for (var i = 0; i < l.length; i++) {
            if (window.location.hash == "#" + l[i]) {
                pick = i;
                break;
            }
        }
        if (pick >= 0) {
            const h = l[i];
            const t = n[i];
            console.log("Start with", h, t);
            l.splice(i, 1);
            n.splice(i, 1);
            l.splice(0, 0, h);
            n.splice(0, 0, t);
        }
    }
    return n;
}
const config = {
    type: Phaser.AUTO,
    width: 16 * 25,
    height: 16 * 25,
    pixelArt: true,
    zoom: 4,
    parent: "game",
    autoResize: true,
    scene: firstScene(),
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
            gravity: { y: 0 }
        }
    },
    input: {
        activePointers: 1
    }
};
// game class
class Game extends Phaser.Game {
    constructor(config) {
        super(config);
    }
    boot() {
        super.boot();
        console.log("Boot");
        const c = document.getElementById("game").childNodes[0];
        c.style.width = "800px";
        c.style.height = "800px";
        ftch_1.ftch("git.json").then(json => {
            this.git = json;
        });
        this.ui = new UI_1.UI();
        this.ui.start();
    }
    log(s) {
        this.ui.log(s);
    }
}
exports.Game = Game;
// when the page is loaded, create our game instance
window.addEventListener("load", () => {
    var game = new Game(config);
});
