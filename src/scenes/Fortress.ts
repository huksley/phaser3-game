import { GenericScene } from "./GenericScene";

export class Fortress extends GenericScene {
  constructor(config?: Phaser.Scenes.Settings.Config) {
    super("fortress", "assets/map-fortress.json", config)
    this.startTileX = 3
    this.startTileY = 23
  }
}