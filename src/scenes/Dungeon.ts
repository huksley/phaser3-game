import { GenericScene } from "./GenericScene";

export class Dungeon extends GenericScene {
  constructor(config?: Phaser.Scenes.Settings.Config) {
    super("dungeon", "assets/map-dungeon.json", config)
  }
}
