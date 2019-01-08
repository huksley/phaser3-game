import { GenericScene } from "./GenericScene";

export class Dungeon extends GenericScene {
  constructor(config?: Phaser.Scenes.Settings.Config) {
    super("tunnel", "assets/map-tunnel.json", config)
  }
}