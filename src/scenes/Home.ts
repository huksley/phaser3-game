import { GenericScene } from "./GenericScene";

export class Home extends GenericScene {
  constructor(config?: Phaser.Scenes.Settings.Config) {
    super("home", "assets/map-home.json", config)
  }
}