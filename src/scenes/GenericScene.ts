import { ObjectLayerItem, LayerProperties, LayerProperty, BodyExt } from "../common"

export class GenericScene extends Phaser.Scene {
    private cursors: Phaser.Input.Keyboard.CursorKeys;
    private player: Phaser.Physics.Arcade.Sprite;
    private map: Phaser.Tilemaps.Tilemap;
    private tilemap: string
    private key: string
    private updating: boolean = true
    private pointer: Phaser.Input.Pointer

    constructor(key: string, tilemap: string, config?: Phaser.Scenes.Settings.Config) {
      super(config)
      console.log("Created " + key, config)
      this.key = key
      this.tilemap = tilemap;
      this.sys.settings.key = this.key
    }
  
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
      this.load.tilemapTiledJSON(this.key, this.tilemap);
    }
  
    create(): void {
      this.updating = true
      this.map = this.add.tilemap(this.key);
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
        
        const tilesets = pa.tilesets ? pa.tilesets.split(",") : "dungeon,dungeon2".split(",");
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
  
      const lava = [];
      const scenes = [];
  
      // Process lava
      for (var i = 0; i < this.map.objects.length; i++) {
        var o = this.map.objects[i];
        console.log("Object layer", o.name, "boxes", o.objects.length);
        if (o && o.name == "lava")
          for (var j = 0; j < o.objects.length; j++) {
            var e = <ObjectLayerItem> (<unknown> o.objects[j])

            if (e && e.rectangle && e.visible && (e.type == "lava" || e.type == "")) {
              console.debug("Collision box", e, e.x, e.y, e.width, e.height);
              const s = this.add.graphics()
              s.x = e.x
              s.y = e.y
              this.physics.add.existing(s);
              const b = <BodyExt> s.body;
              b.setOffset(0, 0)
              b.setSize(e.width, e.height, false)
              b.moves = false;
              b.immovable = true;
              lava[lava.length] = s;
            }

            if (e && e.rectangle && e.visible && e.type.startsWith("scene:")) {
              console.info("scene warp", e.x, e.y, e.width, e.height, e)
              const z = this.add.graphics()
              z.setData("sourceScene", this)
              z.setData("scene", e.type.substring(e.type.indexOf(":") + 1))
              z.x = e.x
              z.y = e.y
              this.physics.add.existing(z)
              const b = <BodyExt> z.body
              b.setOffset(0, 0)
              b.setSize(e.width, e.height, false)
              b.moves = false;
              b.immovable = true;
              scenes[scenes.length] = z
            }
          }
      }

      this.add.text(0, 0, `Map: ${this.key}`, {
        font: "8px monospace",
        fill: "#000000",
        padding: { x: 2, y: 2 }
      })
  
      // Add player
      this.player = this.physics.add.sprite(10 * 16, 16 * 16, "dude")
      this.player.setCollideWorldBounds(true)
      this.player.setBounce(0.2)
      const pb = <BodyExt> this.player.body
      pb.setOffset(8, 24)
      pb.setSize(16, 8, false)
  
      this.physics.add.collider(this.player, lava);
      this.physics.add.collider(this.player, scenes, (player, scene) => {
        console.log("Going", scene.getData("scene"))
        const src = <GenericScene> scene.getData("sourceScene")
        const cam = this.cameras.main
        cam.fade(250, 0, 0, 0)
        cam.once("camerafadeoutcomplete", () => {
          const dst = <string> scene.getData("scene")
          src.cleanup()
          this.scene.pause(src.key)
          this.scene.run(dst)
          this.scene.bringToTop(dst)
        })
      })

      this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("dude", { start: 21, end: 27 }),
        frameRate: 10,
        repeat: 0
      });
  
      this.cursors = this.input.keyboard.createCursorKeys();
      this.pointer = this.input.activePointer
    }

    cleanup(): void {
      console.log(`Cleaning up ${this.key}`)
      this.updating = false
    }
  
    update(): void {
      if (!this.updating) {
        //console.log("Updating disabled for " + this.key)
        return
      }

      //console.log(`Updating ${this.key}`)

      this.player.setVelocity(0, 0);
      var x: integer = 0;
      var y: integer = 0;
      var anim: string = null;

      // Mouse, click, tap
      if (this.pointer.primaryDown) {
        this.physics.moveTo(this.player, this.pointer.downX, this.pointer.downY)
        this.player.anims.play("left", true);
      } else {
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
        } else {
          this.player.anims.stop()
        }
      }
    }
  }
  