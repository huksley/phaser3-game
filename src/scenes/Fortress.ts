import { GenericScene } from "./GenericScene";

export class Dungeon extends GenericScene {
  constructor(config?: Phaser.Scenes.Settings.Config) {
    super("fortress", "assets/map-fortress.json", config)
  }
}