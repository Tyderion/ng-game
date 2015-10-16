module.exports = function(Game) {

    Game.Prefabs.Player = Player;
    Game.Prefabs.Player.prototype = Object.create(Phaser.Sprite.prototype);
    Game.Prefabs.Player.constructor = Game.Prefabs.Player;

    Game.Prefabs.Player.prototype.setVelocity = setVelocity;
    Game.Prefabs.Player.prototype.update = update;
    Game.Prefabs.Player.prototype.onUpdateFromServer = onUpdateFromServer;
    Game.Prefabs.Player.prototype.updateHero = updateHero;
    Game.Prefabs.Player.prototype.updateRemote = updateRemote;
    Game.Prefabs.Player.prototype.die = die;
    Game.Prefabs.Player.prototype.wasHitBy = wasHitBy;
    Game.Prefabs.Player.prototype.showExplosion = showExplosion;
    Game.Prefabs.Player.prototype.enableShield = enableShield;
    Game.Prefabs.Player.prototype.disableShield = disableShield;
    Game.Prefabs.Player.prototype.pickup = pickup;


     var pickups = new Set();

    function pickup(pickup) {
        pickups.add(pickup);
        var test = Array.from(pickups).reduce((acc,e) => acc *= e.getPickupData().speed, 1)
        console.log("pickup speed: " + test);
        this.speed = test * this.baseSpeed;
    }


    function setVelocity(x, y) {
        this.body.velocity.setTo(x * this.speed, y * this.speed);
    }

    function update() {
        if (this.target) {
            this.updateHero();
        } else {
            this.updateRemote();
        }
    }

    function onUpdateFromServer(data) {
        if (this.stateQueue.length > this.maxQueueSize) {
            this.stateQueue.splice(this.minQueueSize, this.maxQueueSize - this.minQueueSize);
        }
        this.stateQueue.unshift(data);
    }

    function updateHero() {
        if (this.target) {
            this.rotation = this.game.math.angleBetween(this.x, this.y, this.target.x, this.target.y);
        }

        // Shields
        if (this.shieldsEnabled) {
            this.shield.x = this.x;
            this.shield.y = this.y;
            this.shield.rotation = this.rotation;
        }
    }

    function updateRemote() {
        if (this.stateQueue.length > this.minQueueSize) {
            var earliestQueue = this.stateQueue.pop();


            if (!this.previousStateTime) {
                this.previousStateTime = new Date().getTime();
            }

            var tweenTime = Math.abs(this.previousStateTime - (earliestQueue.timestamp + 10));
            this.game.add.tween(this)
                .to({
                        x: earliestQueue.x,
                        y: earliestQueue.y,
                        rotation: earliestQueue.rotation
                    }, tweenTime,
                    Phaser.Easing.Linear.None, true, 0);

            this.previousStateTime = earliestQueue.timestamp;
        }
    }

    function die(autoKill) {
        if (!this.dead) {
            this.dead = true;
            this.alpha = 0;

            // Explosion
            if (!autoKill) {
                this.showExplosion();
            }
        }
    }

    function wasHitBy(bullet, player) {
        if (!this.shieldsEnabled) {
            this.health -= 10;

            if (this.health <= 0) {
                this.die();
            } else {
                this.enableShield(0.3);
                this.showExplosion();
            }

            return true;
        }
    }

    function showExplosion() {
        this.explosion.reset(this.x, this.y);
        this.explosion.alpha = 0;
        this.explosion.scale.x = 0.2;
        this.explosion.scale.y = 0.2;
        this.game.add.tween(this.explosion)
            .to({
                alpha: 1,
                angle: "+30"
            }, 200, Phaser.Easing.Linear.NONE, true, 0).to({
                alpha: 0,
                angle: "+30"
            }, 300, Phaser.Easing.Linear.NONE, true, 0);
        this.game.add.tween(this.explosion.scale)
            .to({
                x: 1.5,
                y: 1.5
            }, 500, Phaser.Easing.Cubic.Out, true, 0);
    }

    function enableShield(duration) {
        this.shieldsEnabled = true;

        if (this.timerShield && !this.timerShield.expired) {
            this.timerShield.destroy();
        }

        this.timerShield = this.game.time.create(true);
        this.timerShield.add(Phaser.Timer.SECOND * duration, this.disableShield, this);
        this.timerShield.start();

        this.game.add.tween(this.shield)
            .to({
                alpha: 1
            }, 300, Phaser.Easing.Cubic.Out, true, 0);
    }

    function disableShield() {
        this.game.add.tween(this.shield)
            .to({
                    alpha: 0
                }, 300,
                Phaser.Easing.Linear.NONE,
                true,
                0, 6, true).onComplete.add(function() {
                this.shieldsEnabled = false;
            }, this);
    }

    function Player(game, x, y, target, id) {
        this.id = id;
            Phaser.Sprite.call(this, game, x, y, 'hero');
        if (target) {
            // Target: mouse
            this.target = target;

            // Follow pointer
            this.follow = false;

            // Minimum away
            this.minDistance = 10;

            // Speed
            this.baseSpeed = 400;
            this.speed = this.baseSpeed;

            // Lives
            this.lives = 3;

            // Shot delay
            this.shotDelay = 80;

            // Number of bullets per shot
            this.numBullets = 1000;
            this.timerBullet;

            this.shieldsEnabled = false;
            this.timerShield;
            this.shield = this.game.add.sprite(0, 0, 'shield');
            this.shield.anchor.setTo(0.5, 0.5);
            this.shield.alpha = 0

            // Scale
            //this.scale.setTo(1.2, 1.2);
        } else {

            //this.scale.setTo(0.5, 0.5);
            this.alpha = 0.8;
            this.x = x;
            this.y = y;

            // State queue
            this.stateQueue = [];
            this.minQueueSize = 10;
            this.maxQueueSize = 30;
            this.previousStateTime = 0;
        }

        // Explosion
        this.explosion = this.game.add.sprite(0, 0, 'explosion');
        this.explosion.anchor.setTo(0.5, 0.5);
        this.explosion.alpha = 0;

        this.health = 100;
        // Anchor
        this.anchor.setTo(0.5, 0.5);
        // Rotate 90s so it's facing up
        this.rotation = -Math.PI / 2;

        this.game.physics.enable(this, Phaser.Physics.ARCADE);
    };
}

