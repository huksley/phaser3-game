import { GenericScene } from "./GenericScene";

export class City extends GenericScene {
  constructor(config?: Phaser.Scenes.Settings.Config) {
    super("city", "assets/map-city.json", config)
  }
}