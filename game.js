var config = {
  type: Phaser.AUTO,
  width: 16 * 25,
  height: 16 * 25,
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);
var cursors = null;
var player = null;

function preload() {
  this.load.spritesheet("dude", "assets/animated-cleric.png", {
    frameWidth: 32,
    frameHeight: 32
  });
  this.load.image("medieval-ext", "assets/medieval-ext.png");
  this.load.image("medieval-int", "assets/medieval-int.png");
  this.load.image("dungeon", "assets/dungeon.png");
  this.load.image("dungeon2", "assets/dungeon2.png");
  this.load.tilemapTiledJSON("City", "assets/map-city.json");
}

function create() {
  this.map = this.add.tilemap("City");
  console.log("Loaded map", this.map)

  // Tilesets
  var tilesets = {};
  for (var i = 0; i < this.map.tilesets.length; i++) {
    var tl = this.map.tilesets[i];
    console.log("Loading tileset", tl.name);
    var t = this.map.addTilesetImage(tl.name, tl.name);
    tilesets[tl.name] = t;
  }

  // All layers except player
  for (var i = 0; i < this.map.layers.length; i++) {
    var l = this.map.layers[i];
    var p = l.properties;
    var pa = {};
    for (var j = 0; j < p.length; j++) {
      pa[p[j].name] = p[j].value;
    }
    p = pa;
    var tilesets = p.tilesets.split(",");
    if (l.name != "player") {
      console.log("Loading layer", l.name, "properties", p, "tilesets", tilesets);
      this.map.createStaticLayer(l.name, tilesets);
    }
  }

  var lava = []
  var platforms = this.physics.add.staticGroup();

  // Process lava
  for (var i = 0; i < this.map.objects.length; i++) {
    var o = this.map.objects[i];
    console.log("Object layer", o.name, "boxes", o.objects.length)
    for (var j = 0; j < o.objects.length; j++) {
      var e = o.objects[j];
      if (e && e.rectangle && e.visible) {
        var x = e.x
        var y = e.y
        var width = e.width
        var height = e.height
        console.log("Collision box", e, x, y, width, height)
        var s = platforms.create(x, y);
        s.setSize(width, height);
        s.setOrigin(0, 0)
        s.setVisible(false)
        lava[lava.length] = s;
      }
    }
  }

  // Add player
  player = this.physics.add.sprite(10 * 16, 16 * 16, "dude");
  player.setCollideWorldBounds(true);
  player.setBounce(0.2);

  this.physics.add.collider(player, platforms);

  this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("dude", { start: 20, end: 26 }),
    frameRate: 10,
    repeat: 0
  });

  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  player.setVelocity(0, 0);
  var x = 0;
  var y = 0;
  var anim = null;
  if (cursors.left.isDown) {
    x = -100;
    anim = "left";
    player.flipX = true;
  }
  if (cursors.right.isDown) {
    x = 100;
    anim = "left";
    player.flipX = false;
  }
  if (cursors.up.isDown) {
    y = -100;
    anim = "left";
  }
  if (cursors.down.isDown) {
    y = 100;
    anim = "left";
  }
  player.setVelocity(x, y);
  if (anim != null) {
    player.anims.play(anim, false);
  }
}
