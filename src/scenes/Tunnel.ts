import { GenericScene } from "./GenericScene";

export class Tunnel extends GenericScene {
  constructor(config?: Phaser.Scenes.Settings.Config) {
    super("tunnel", "assets/map-tunnel.json", config)
    this.startTileX = 3
    this.startTileY = 8
  }
}