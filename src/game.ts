import * as Phaser from "phaser";
import { City } from "./scenes/City"
import { Home } from "./scenes/Home"
import { Dungeon } from "./scenes/Dungeon"
import { Tunnel } from "./scenes/Tunnel"
import { Fortress } from "./scenes/Fortress"
import { ftch } from "./ftch"
import { UI } from "./UI";

function firstScene() {
  var l = [ "city", "home", "dungeon", "tunnel", "fortress" ]
  var n = [ City, Home, Dungeon, Tunnel, Fortress ]
  console.log("Scenes", l, n, "location", window.location.hash)
  if (window.location.hash != "") {
    var pick = -1
    for (var i = 0; i < l.length; i++) {
      if (window.location.hash == "#" + l[i]) {
        pick = i
        break
      }
    }
    if (pick >= 0) {
      const h = l[i]
      const t = n[i]
      console.log("Start with", h, t)
      l.splice(i, 1)
      n.splice(i, 1)
      l.splice(0, 0, h)
      n.splice(0, 0, t)
    }
  }
  return n
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
      debug: false, // Set to true to show physics boxes
      gravity: { y: 0 }
    }
  },
  input: {
    activePointers: 1
  }
}

// game class
export class Game extends Phaser.Game {
  public git: any
  private ui: UI

  constructor(config: GameConfig) {
    super(config);
  }

  boot(): void {
    super.boot();
    console.log("Boot");
    const c  = <HTMLCanvasElement> document.getElementById("game").childNodes[0]
    c.style.width = "800px";
    c.style.height = "800px";
    ftch("git.json").then(json => {
      this.git = json
    })
    this.ui = new UI()
    this.ui.start()
  }

  log(s: string): void {
    this.ui.log(s)
  }
}

// when the page is loaded, create our game instance
window.addEventListener("load", () => {
  var game = new Game(config);
});
