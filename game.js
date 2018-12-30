var config = {
  type: Phaser.AUTO,
  width: 16 * 25,
  height: 16 * 25,
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
  this.load.tilemapTiledJSON("City", "assets/map-city.json");
}

function create() {
  this.map = this.add.tilemap("City");

  var tilesets = {};
  for (var i = 0; i < this.map.tilesets.length; i++) {
    var tl = this.map.tilesets[i];
    console.log("Loading tileset", tl.name);
    var t = this.map.addTilesetImage(tl.name, tl.name);
    tilesets[tl.name] = t;
  }

  for (var i = 0; i < this.map.layers.length; i++) {
    var l = this.map.layers[i];
    var p = l.properties;
    var pa = {};
    for (var j = 0; j < p.length; j++) {
      pa[p[j].name] = p[j].value;
    }
    p = pa;
    var tilesets = p.tilesets.split(",");
    console.log("Loading layer", l.name, "properties", p, "tilesets", tilesets);
    this.map.createStaticLayer(l.name, tilesets);
  }

  player = this.physics.add.sprite(10 * 16, 16 * 16, "dude");
  player.setCollideWorldBounds(true);
  player.setBounce(0.2);

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
