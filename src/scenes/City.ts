interface ObjectLayerItem {
  rectangle: boolean,
  visible: boolean,
  x: number,
  y: number,
  width: number,
  height: number
}

interface LayerProperty {
  name: string,
  value: string
}

class LayerProperties {
  tilesets?: string
}

class BodyExt extends Phaser.Physics.Arcade.Body {
  moves: boolean;
  immovable: boolean;
}

export class City extends Phaser.Scene {
  private cursors: Phaser.Input.Keyboard.CursorKeys;
  private player: Phaser.Physics.Arcade.Sprite;
  private map: Phaser.Tilemaps.Tilemap;

  preload(): void {
    this.load.spritesheet("dude_old", "assets/animated-cleric.png", {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet("dude", "assets/animated-warrior.png", {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.image("medieval-ext", "assets/medieval-ext.png");
    this.load.image("medieval-int", "assets/medieval-int.png");
    this.load.image("dungeon", "assets/dungeon.png");
    this.load.image("dungeon2", "assets/dungeon2.png");
    this.load.tilemapTiledJSON("City", "assets/map-city.json");
  }

  create(): void {
    this.map = this.add.tilemap("City");
    console.log("Loaded map", this.map);

    // Tilesets
    var tilesets = {};
    for (let i = 0; i < this.map.tilesets.length; i++) {
      const tl = this.map.tilesets[i];
      console.log("Loading tileset", tl.name);
      const t = this.map.addTilesetImage(tl.name, tl.name);
      tilesets[tl.name] = t;
    }

    // All layers except player
    for (var i = 0; i < this.map.layers.length; i++) {
      const l = this.map.layers[i];
      const p = <Array<LayerProperty>> l.properties;
      const pa = new LayerProperties();
      for (var j = 0; j < p.length; j++) {
        pa[p[j].name] = p[j].value;
      }
      
      const tilesets = pa.tilesets ? pa.tilesets.split(",") : "dungeon,dungeon2";
      if (l.name != "player") {
        console.log(
          "Loading layer",
          l.name,
          "properties",
          p,
          "tilesets",
          tilesets
        );
        this.map.createStaticLayer(l.name, tilesets, 0, 0);
      }
    }

    var lava = [];

    // Process lava
    for (var i = 0; i < this.map.objects.length; i++) {
      var o = this.map.objects[i];
      console.log("Object layer", o.name, "boxes", o.objects.length);
      if (o && o.name == "lava")
        for (var j = 0; j < o.objects.length; j++) {
          var e = <ObjectLayerItem> (<unknown> o.objects[j]);
          if (e && e.rectangle && e.visible) {
            var x = e.x;
            var y = e.y;
            var width = e.width;
            var height = e.height;
            console.trace("Collision box", e, e.x, e.y, e.width, e.height);
            var s = this.add.graphics();
            s.x = e.x;
            s.y = e.y;
            this.physics.add.existing(s);
            const b = <BodyExt> s.body;
            b.setSize(width, height);
            b.moves = false;
            b.immovable = true;
            lava[lava.length] = s;
          }
        }
    }

    // Add player
    this.player = this.physics.add.sprite(10 * 16, 16 * 16, "dude");
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.2);

    this.physics.add.collider(this.player, lava);

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 21, end: 27 }),
      frameRate: 10,
      repeat: 0
    });

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update(): void {
    this.player.setVelocity(0, 0);
    var x: integer = 0;
    var y: integer = 0;
    var anim: string = null;
    if (this.cursors.left.isDown) {
      x = -100;
      anim = "left";
      this.player.flipX = true;
    }
    if (this.cursors.right.isDown) {
      x = 100;
      anim = "left";
      this.player.flipX = false;
    }
    if (this.cursors.up.isDown) {
      y = -100;
      anim = "left";
    }
    if (this.cursors.down.isDown) {
      y = 100;
      anim = "left";
    }
    this.player.setVelocity(x, y);
    if (anim != null) {
      this.player.anims.play(anim, true);
    }
  }
}
