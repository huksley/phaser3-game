import * as Phaser from "phaser";
import { City } from "./scenes/City"

const config = {
  type: Phaser.AUTO,
  width: 16 * 25,
  height: 16 * 25,
  pixelArt: true,
  zoom: 4,
  parent: "game",
  autoResize: true,
  scene: City,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  }
};

// game class
export class Game extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
  }

  boot(): void {
    super.boot();
    console.log("Boot");
    const c  = <HTMLCanvasElement> document.getElementById("game").childNodes[0]
    c.style.width = "800px";
  }
}

// when the page is loaded, create our game instance
window.addEventListener("load", () => {
  var game = new Game(config);
});
