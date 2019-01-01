export interface ObjectLayerItem {
  rectangle: boolean
  visible: boolean
  x: number
  y: number
  width: number
  height: number
  type: string
}

export interface LayerProperty {
  name: string
  value: string
}

export class LayerProperties {
  tilesets?: string
}

export class BodyExt extends Phaser.Physics.Arcade.Body {
  moves: boolean
  immovable: boolean
}
