module.exports = (function(Game) {

    Game.Prefabs.PickupSpeedUp = SpeedUp;

    Game.Prefabs.PickupSpeedUp.prototype = Object.create(Phaser.Sprite.prototype);
    Game.Prefabs.PickupSpeedUp.constructor = Game.Prefabs.PickupSpeedUp;

    // Game.Prefabs.Bullet.prototype.shoot = shoot;
    // Game.Prefabs.Bullet.prototype.shootFrom = shootFrom;
    // Game.Prefabs.Bullet.prototype.update = update;

    // function shoot() {
    //     this.rotation = this.player.rotation;

    //     // var pt = this.game.input.activePointer.position;
    //     // laser.angle = this.game.physics.arcade.angleBetween(laser, pt);

    //     this.xVel = Math.cos(this.rotation) * this.BULLET_SPEED;
    //     this.yVel = Math.sin(this.rotation) * this.BULLET_SPEED;
    //     //this.laserSound.play();
    // }

    // function shootFrom(data) {
    //     this.rotation = data.rotation;

    //     this.xVel = Math.cos(this.rotation) * this.BULLET_SPEED;
    //     this.yVel = Math.sin(this.rotation) * this.BULLET_SPEED;
    // }

    // function update() {
    //     var laser = this;
    //     laser.body.velocity.x = this.xVel;
    //     laser.body.velocity.y = this.yVel;
    // }

    function SpeedUp(game, x, y) {
        this.BULLET_SPEED = 500;

        this.getPickupData = function() {
                return {
            speed: 1.5,
            length: -1
        };
        }

        //this.player = player;
        this.game = game;

        Phaser.Sprite.call(this, game, x, y, 'pickup_speed_up');

        this.anchor.setTo(0.5, 0.5);
        this.scale.setTo(0.1,0.1);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);

        this.angle = -Math.PI / 2;
       // this.kill(); // set dead at first

        //this.laserSound = this.game.add.audio('laserFx');

        this.checkWorldBounds = true;
        this.outOfBoundsKill = true;

        // this.events.onKilled.add(this.handleKilled, this);
        // if (handleKilledFn) {
        //     this.events.onKilled.add(handleKilledFn, this);
        // }
    }
});
