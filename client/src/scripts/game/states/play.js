module.exports = function(Game) {
    var g = Game;
    var showDebug = true;
    Game.States.Play = function(game) {}

    Game.States.Play.prototype = {
        inputManager: new InputManager(),
        create: createGame,
        render: render,
        update: update,
        updateRemoteServer: updateRemoteServer,
        addPlayers: addPlayers,
        addPlayer: addPlayer,
        removePlayers: removePlayers,
        shutdown: shutdown,
        goToMenu: goToMenu,
        initGame: initGame,
        playGame: playGame,
        generateEnemies: generateEnemies,
        setVelocity: setVelocity,
        onKeyPress: onKeyPress,
        onKeyDown: onKeyDown,
        onKeyUp: onKeyUp,
        stopShooting: stopShooting,
        startShooting: startShooting,
        shootBullet: shootBullet,
        checkCollisions: checkCollisions,
        updateScore: updateScore,
        killEnemy: killEnemy,
        killHero: killHero,
        hitARemotePlayer: hitARemotePlayer,
        shootLaser: shootLaser,
        gameOver: gameOver,
        forEachEnemy: forEachEnemy,
        pauseGame: pauseGame,
        pickup: pickup,
        generatePickups:  generatePickups
    }

    var spritesToBodyDebug = [];

    function debug(sprite) {
        spritesToBodyDebug.push(sprite);
    }

    var spriteToShowInfo = undefined;

    function render() {
        if (showDebug) {
            if (typeof spriteToShowInfo !== 'undefined') {
                this.game.debug.bodyInfo(spriteToShowInfo, 32, 32);
            }
             spritesToBodyDebug.forEach(x => this.game.debug.body(x));
        }
    }

    function updateRemoteServer() {
        var game = this.game;

        g.socket.emit('updatePlayer', {
            x: this.hero.x,
            y: this.hero.y,
            xRel: this.hero.x / (Game.width === 0 ? 1 : Game.width),
            yRel: this.hero.y / (Game.height === 0 ? 1 : Game.height),
            health: this.hero.health,
            rotation: this.hero.rotation,
            timestamp: new Date().getTime()
        });

        this.updateRemoteServerTimer = this.game.time.events
            .add(
                20, // Every 100 miliseconds
                this.updateRemoteServer,
                this);
    }

    function addPlayer(x, y, id) {
        // We ALWAYS have us as a player
        var player = new Game.Prefabs.Player(this.game, this.game.width / 2, 100, null, id);
        this.game.add.existing(player);
        return player;
    }

    function update() {
        if (!Game.paused) {
            // this.updatePlayer();

            this.addPlayers();
            this.removePlayers();
            // Run game loop thingy
            this.checkCollisions();

            this.fpsText.setText(this.game.time.fps + ' FPS');
        }
    }

    function removePlayers() {
        while (g.toRemove.length !== 0) {
            var toRemove = g.toRemove.shift();
            this.game.world.removeChild(toRemove, true);
        }
    }

    function shutdown() {
        this.bullets.destroy();
        this.forEachEnemy(function(enemy) {
            enemy.destroy();
        });
        this.lasers.destroy();
        // this.updatePlayers.timer.pause();
        Game.paused = true;
    }

    function goToMenu() {
        Game.backgroundX = this.background.tilePosition.x;
        Game.backgroundY = this.background.tilePosition.y;

        this.game.state.start('MainMenu');
    }

    function initGame() {
        // Generate enemies
        //this.enemiesGenerator = this.game.time.events
        //.add(2000, this.generateEnemies, this);


        this.generateEnemies();
        this.generatePickups()

        // Generate enemies laser
        // this.lasersGenerator = this.game.time.events
        // .add(1000, this.shootLaser, this);

        // Generate server updates
        this.updateRemoteServerTimer = this.game.time.events
            .add(200, this.updateRemoteServer, this);

        // Show UI
        // this.game.add.tween(this.livesGroup)
        //   .to({alpha:1}, 600, Phaser.Easing.Exponential.Out, true);
        // this.game.add.tween(this.scoreText)
        //   .to({alpha:1}, 600, Phaser.Easing.Exponential.Out, true);

        // Play
        this.playGame();
    }

    function playGame() {
        if (Game.paused) {
            Game.paused = false;

            this.hero.follow = true;
            this.hero.body.collideWorldBounds = true;

            // NEED TO UPDATE THIS
            // this.enemiesGenerator.timer.resume();

            this.lasers.forEach(function(laser) {
                laser.resume();
            }, this);

            this.game.input.x = this.hero.x;
            this.game.input.y = this.hero.y;

        }
    }

    function generatePickups() {
        var pickup = new Game.Prefabs.PickupSpeedUp(this.game, this.game.width / 2, this.game.height / 2);
        this.game.add.existing(pickup);
        debug(pickup);
        this.pickups.push(pickup);

        var pickup2 = new Game.Prefabs.PickupSpeedUp(this.game, this.game.width / 3, this.game.height / 2);
        this.game.add.existing(pickup2);
        debug(pickup2);
        this.pickups.push(pickup2);

         var pickup3 = new Game.Prefabs.PickupSpeedDown(this.game, this.game.width / 4, this.game.height / 3);
        this.game.add.existing(pickup3);
        debug(pickup3);
        this.pickups.push(pickup3);
    }

    function generateEnemies() {
        var levelEnemies = this.levelData.enemies[0]
        var enemy = this.game.add.existing(
            new Game.Prefabs.Enemy(this.game, 0, 0, levelEnemies)
        );

        //enemy.x = enemy ? enemy.x : this.game.rnd.integerInRange(enemy.width, game.width - enemy.width);
        //enemy.y = -(this.game.height + enemy.height / 2 + i * (enemy.height));
        enemy.x = this.game.width / 3;
        enemy.y = this.game.height / 3;

        //this.game.debug.bodyInfo(enemy, 32, 32);
        //this.game.debug.body(enemy);
        // var levelEnemies = this.levelData.enemies;
        // for (var i = 0; i < levelEnemies.length; i++) {

        //     var enemyGroup = this.enemyGroups[i]
        //       ,
        //     levelEnemy = levelEnemies[i];
        //     var enemies = enemyGroup.getFirstExists(false);

        //     if (!enemies) {
        //         enemies = new Game.Prefabs
        //         .Enemies(this.game,
        //         levelEnemy.count || 10,
        //         levelEnemy,
        //         this.hero,
        //         this.enemyGroups[i]);
        //     }
        //     // reset(fromY, toY, speed)
        //     enemies
        //     .reset(this.game.rnd.integerInRange(0, this.game.width),
        //     this.game.rnd.integerInRange(0, this.game.width));
        //}

        // Relaunch timer depending on level
        // this.enemiesGenerator = this.game.time.events
        // .add(
        // this.game.rnd.integerInRange(20, 50) * 500 / (this.level + 1),
        // this.generateEnemies, this);
    }

    function setVelocity() {
        var velocity = this.inputManager.getVelocity();
        this.hero.setVelocity(velocity.x, velocity.y);
    }

    function onKeyPress(event) {
        this.setVelocity();
    }

    function onKeyDown(event) {
        // console.log('onKeyDown', event.keyCode)
        switch (event.keyCode) {
            case Phaser.Keyboard.A:
                this.inputManager.onLeft(true);
                break;
            case Phaser.Keyboard.D:
                this.inputManager.onRight(true);
                break;
            case Phaser.Keyboard.W:
                this.inputManager.onUp(true);
                break;
            case Phaser.Keyboard.S:
                this.inputManager.onDown(true);
                break;
        }
        this.setVelocity();
    }

    function onKeyUp() {
        //console.log('onKeyUp', event.keyCode)
        switch (event.keyCode) {
            case Phaser.Keyboard.A:
                this.inputManager.onLeft(false);
                break;
            case Phaser.Keyboard.D:
                this.inputManager.onRight(false);
                break;
            case Phaser.Keyboard.W:
                this.inputManager.onUp(false);
                break;
            case Phaser.Keyboard.S:
                this.inputManager.onDown(false);
                break;
        }
        this.setVelocity();
    }

    function stopShooting() {
        //console.log('stop shooting: ', this.shootInterval);
        this.keepShooting = false;
        clearInterval(this.shootInterval);
    }

    function startShooting() {
        this.keepShooting = true;
        this.shootInterval = setInterval(this.shootBullet.bind(this), 10);
        // console.log('start shooting: ', this.shootInterval);
    }

    function shootBullet() {
        // Check delay time
        if (this.lastBulletShotAt === undefined)
            this.lastBulletShotAt = 0;
        if (this.game.time.now - this.lastBulletShotAt < this.hero.shotDelay) {
            return;
        }
        this.lastBulletShotAt = this.game.time.now;

        // Create bullets
        var bullet, bulletPosY;
        bullet = this.bullets.getFirstExists(false);
        if (bullet) {

            bullet.reset(this.hero.x, this.hero.y);
            // Shoot the darn thing
            bullet.shoot();

            this.game.socket.emit('shotbullet', {
                id: g.sid,
                y: bullet.y,
                x: bullet.x,
                rotation: bullet.rotation
            });
        }
    }

    function checkCollisions() {
        this.pickups.forEach(function(pickup) {
            this.game.physics.arcade.overlap(this.hero,
                pickup, this.pickup, null, this);
        }, this)


        //if (Game.multiplayer) {
        // g.remotePlayers.forEach(function(player) {
        this.game.physics.arcade.overlap(
            this.remoteBullets,
            this.hero, this.killHero,
            null, this);

        g.remotePlayers.forEach(function(remotePlayer) {
            this.game.physics.arcade.overlap(
                this.bullets, remotePlayer, this.hitARemotePlayer, null, this);
        }, this);

        // }, this);
        //} else {
        // Single player mode requires enemies
        var levelEnemies = this.enemyGroups;
        for (var i = 0; i < this.enemyGroupsCount; i++) {
            var enemies = levelEnemies[i];
            enemies.forEach(function(enemy) {
                this.game.physics.arcade.overlap(this.bullets, enemy, this.killEnemy, null, this);
            }, this);

            enemies.forEach(function(enemy) {
                this.game.physics.arcade.overlap(this.hero, enemy, this.killHero, null, this);
            }, this);
        }

        this.game.physics.arcade.overlap(this.hero, this.lasers, this.killHero, null, this);
        this.game.physics.arcade.overlap(this.hero, this.bonus, this.activeBonus, null, this);
        // }
    }

    function addPlayers() {
        while (g.toAdd.length !== 0) {
            var data = g.toAdd.shift();
            if (data) {
                var toAdd =
                    this.addPlayer(data.x, data.y, data.id);
                g.remotePlayers.push(toAdd);
            }
        }
    }

    function updateScore(enemy) {
        this.score += enemy.desc ? enemy.desc.maxHealth : 1;
        this.scoreText.setText('Score: ' + this.score + '');
    }

    function killEnemy(bullet, enemy) {
        if (!enemy.dead && enemy.checkWorldBounds) {
            enemy.die();
            bullet.kill();
            this.updateScore(enemy);
        }
    }

    function pickup(hero, pickup) {
        console.log('pickup');
        hero.pickup(pickup);
        pickup.destroy();
    }

    function killHero(hero, enemy) {
        if (enemy instanceof Game.Prefabs.Laser ||
            (enemy instanceof Game.Prefabs.Enemy &&
                !enemy.dead &&
                enemy.checkWorldBounds)) {
            this.hero.lives--;
            this.screenFlash.flash();

            if (this.hero.lives < 1) {
                this.gameOver();
            } else {
                this.hero.enableShield(2);
                this.game.add.tween(this.livesNum).to({
                    alpha: 0,
                    y: 8
                }, 200, Phaser.Easing.Exponential.Out, true).onComplete.add(function() {
                    this.livesNum.frame = this.hero.lives + 1;
                    this.livesNum.y = -2;
                    this.game.add.tween(this.livesNum).to({
                        alpha: 1,
                        y: 3
                    }, 200, Phaser.Easing.Exponential.Out, true);
                }, this);
            }

        } else if (enemy instanceof Game.Prefabs.Bullet) {

            var bullet = enemy,
                player = bullet.player;

            bullet.kill();

            if (this.hero.wasHitBy(bullet, player)) {
                // Shot by a player
                this.screenFlash.flash();

                // Notify server
                this.game.socket.emit('playerHit', {
                    shooter: player.id,
                    victim: g.sid,
                    health: this.hero.health
                });
            }

            if (this.hero.health < 0) {
                this.gameOver();
            }

            // bullet.die();
            // } else {
            // enemy.die(true);
        }
    }

    function createGame() {
        var game = this.game;

        // game.stage.backgroundColor = '#2d2d2d';

        game.physics.startSystem(Phaser.Physics.ARCADE);

        // game.physics.arcade.gravity.y = 100;

        // var sprite = game.add.sprite(150, 100, 'atari');

        // game.physics.arcade.enable(sprite);

        // sprite.body.velocity.set(-100, -100);
        // sprite.body.bounce.set(1);
        // sprite.body.collideWorldBounds = true;

        //     game.debug.bodyInfo(sprite, 32, 32);
        //     game.debug.body(sprite);
        //     game.debug.body(sprite, 'red', false);
        //    game.debug.spriteBounds(sprite, 'pink', false);
        //     return;


        this.level = Game.currentLevel || 0;
        this.levelData = Game.Levels[this.level];
        this.points = 0;






        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        // Background
        this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'background' + this.level);
        this.background.autoScroll(1, 15);
        this.background.tilePosition.x = Game.backgroundX;
        this.background.tilePosition.y = Game.backgroundY;
        this.game.add.tween(this.background)
            .to({
                    alpha: 0.3
                },
                5000,
                Phaser.Easing.Linear.NONE,
                true, 0, Number.POSITIVE_INFINITY, true);

        // FPS
        this.game.time.advancedTiming = true;
        this.fpsText = this.game.add.text(
            100, (this.game.height - 26), '', {
                font: '16px Arial',
                fill: '#ffffff'
            }
        );

        this.pickups = [];

        // Enemy Lasers
        this.lasers = game.add.group();
        // Enemies
        // this.enemies        = game.add.group();
        this.enemyGroups = {};
        //= game.add.group();
        this.enemyGroupsCount = 0;
        var levelEnemies = this.levelData.enemies;
        for (var i = 0; i <= levelEnemies.length; i++) {
            this.enemyGroups[i] = game.add.group();
            this.enemyGroupsCount++;
        };

        this.score = 0;
        // This player's bullets
        this.bullets = game.add.group();
        // Other bullets
        this.remoteBullets = game.add.group();
        // We have other players
        g.remotePlayers = game.remotePlayers || [];

        // Setup shooting
        this.game.input.onDown.add(this.startShooting, this);
        this.game.input.onUp.add(this.stopShooting, this);
        this.game.input.keyboard.enabled = true;
        this.game.input.keyboard.addCallbacks(this, this.onKeyDown, this.onKeyUp, this.onKeyPress);


        g.sio = g.socket;

        // We ALWAYS have us as a player
        g.hero = this.hero = new Game.Prefabs.Player(this.game,
            this.game.width / 2,
            this.game.height + 60 + 20,
            this.game.input,
            true, g.sio);

        this.game.add.existing(this.hero);
        debug(this.hero);


        // this.game.add.tween(this.hero)
        // .to({
        //   y: this.game.height - (this.hero.height + 20)
        // }, 1500, Phaser.Easing.Exponential.Out, true);

        // Display lives
        this.livesGroup = this.game.add.group();
        this.livesGroup.add(this.game.add.sprite(0, 0, 'lives'));
        this.livesGroup.add(this.game.add.sprite(20, 3, 'num', 0));
        this.livesNum = this.game.add.sprite(35, 3, 'num', this.hero.lives + 1);
        this.livesGroup.add(this.livesNum);
        this.livesGroup.x = this.game.width - 55;
        this.livesGroup.y = 5;
        this.livesGroup.alpha = 0;

        // Add bullets
        for (var i = 0; i < this.hero.numBullets; i++) {
            var bullet = new Game.Prefabs.Bullet(this.game, 0, 0, this.hero);
            this.bullets.add(bullet);
        }

        // Score
        this.score = 0;
        this.scoreText = this.game.add.bitmapText(10, this.game.height - 27, 'architectsDaughter', 'Score: 0', 16);
        this.scoreText.alpha = 0;

        // Juicy
        this.juicy = this.game.plugins.add(Phaser.Plugin.Juicy);
        this.screenFlash = this.juicy.createScreenFlash();
        this.add.existing(this.screenFlash);

        this.game_music = game.add.audio('game_music');
        // this.game_music.play();

        // Enter play mode after init state
        this.timerInit = this.game.time.create(true);
        this.timerInit.add(Phaser.Timer.SECOND * 1.5, this.initGame, this);
        this.timerInit.start();

        var gamePlay = this;
        var gamePlayer = _.extend(this.hero, {
            id: g.sid,
            name: 'You joined'
        })
        gamePlay.game.scope
            .$emit('game:newPlayer', gamePlayer);

        if (Game.multiplayer) {
            // Helpers
            var removePlayer = function(player, map) {
                g.remotePlayers.splice(g.remotePlayers.indexOf(player), 1);
                Game.toRemove.push(player);
                gamePlay.game.scope.$emit('game:removePlayer', {
                    player: player,
                    mapId: map
                });
            }

            // Handlers
            this.game.socket.on('gameUpdated:add', function(data) {
                console.log('gameUpdated:add');
                var allPlayers = data.allPlayers,
                    newPlayers = [];

                for (var i = 0; i < allPlayers.length; i++) {
                    var playerInQuestion = allPlayers[i];

                    if (playerInQuestion.id === g.hero.id) {
                        // Nope, we're already added
                    } else if (Game.playerById(playerInQuestion.id)) {
                        // Nope, we already know about 'em
                    } else {
                        g.toAdd.push(playerInQuestion);
                        gamePlay.game.scope.$emit('game:newPlayer', playerInQuestion);
                    }
                }
            });

            this.game.socket.on('gameUpdated:remove', function(data) {
                var allPlayers = g.remotePlayers,
                    newPlayerList = data.allPlayers,
                    newPlayers = [];

                var mapId = data.map;

                for (var i = 0; i < allPlayers.length; i++) {
                    var playerInQuestion = allPlayers[i];

                    if (playerInQuestion.id === g.hero.id) {
                        // Nope, we're already added
                    } else {
                        var found = false;
                        for (var i = 0; i < newPlayerList.length; i++) {
                            if (newPlayerList[i].id === playerInQuestion.id) {
                                // The player is in the new player list
                                // so we don't have to remove them
                                found = true;
                            }
                        }
                        if (!found) {
                            // We can remove this player
                            removePlayer(playerInQuestion, mapId);
                        }
                    }
                }
            });

            this.game.socket.on('updatePlayers', function(data) {
                var playersData = data.game.players;

                for (var i = 0; i < playersData.length; i++) {
                    var playerData = playersData[i];
                    var player;

                    if (playerData.id !== g.sid) {
                        player = Game.playerById(playerData.id);
                        if (player) {
                            player.onUpdateFromServer(playerData);
                        }
                    }

                }
            });

            this.game.socket.on('bulletShot', function(data) {
                var player = Game.playerById(data.id);

                if (player) {
                    bullet = gamePlay.remoteBullets.getFirstExists(false);
                    if (!bullet) {
                        bullet = new Game.Prefabs.Bullet(this.game, data.x, data.y, player);
                        gamePlay.remoteBullets.add(bullet);
                    }
                    // Shoot the darn thing
                    bullet.shoot();

                    bullet.reset(data.x, data.y);
                }
            });

            this.game.socket.on('playerHit', function(data) {
                if (data.victim === g.sid) {
                    // We were hit
                    if (data.victimHealth === 0) {
                        gamePlay.gameOver();
                    }
                } else {
                    var player = Game.playerById(data.victim);
                    if (player) {
                        if (data.victimHealth <= 0) {
                            player.die();
                        }
                    }
                }
            });

            this.game.socket.on('gameOver', function(data) {
                var winnerId = data.winner.id;
                if (winnerId === g.sid) {
                    // WE WON!
                    Game.winner = true;
                } else {
                    // We LOST :(
                    Game.winner = false;
                }
                gamePlay.gameOver();
            });

            g.socket.emit('newPlayer', {
                mapId: Game.mapId,
                health: this.hero.health
            });
        }
    }

    function InputManager() {
        var game = this.game;
        var self = this;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isDown = {
            LEFT: false,
            RIGHT: false,
            UP: false,
            DOWN: false
        }

        return {
            onLeft: onLeft,
            onUp: onUp,
            onDown: onDown,
            onRight: onRight,
            getVelocity: getVelocity
        }

        function onLeft(pressed) {
            self.isDown.LEFT = pressed;
            self.velocityX = pressed ? -1 : self.isDown.RIGHT ? 1 : 0;
        }

        function onRight(pressed) {
            self.isDown.RIGHT = pressed;
            self.velocityX = pressed ? 1 : self.isDown.LEFT ? -1 : 0;
        }

        function onUp(pressed) {
            self.isDown.UP = pressed;
            self.velocityY = pressed ? -1 : self.isDown.DOWN ? 1 : 0;

        }

        function onDown(pressed) {
            self.isDown.RIGHT = pressed;
            self.velocityY = pressed ? 1 : self.isDown.UP ? -1 : 0;
        }

        function getVelocity() {
            var multiplier = 1;
            if (self.velocityX !== 0 && self.velocityY != 0) {
                multiplier = 1 / Math.SQRT2;
            }
            return {
                x: self.velocityX * multiplier,
                y: self.velocityY * multiplier
            }
        }
    }

    function hitARemotePlayer(player, bullet) {
        if (!player.shieldsEnabled) {
            player.showExplosion();
        }
        bullet.kill();
    }

    function gameOver() {
        // this.game.input.onDown.add(this.shootBullet, this);
        this.game.input.onDown.removeAll();

        this.gameover = true;

        this.juicy.shake(20, 5);

        this.game.add.tween(this.hero)
            .to({
                alpha: 0
            }, 500, Phaser.Easing.Exponential.Out, true);

        this.scoreText.alpha = 0;
        this.livesGroup.alpha = 0;

        this.pauseGame();

        // Clean up socket
        this.game.socket.removeAllListeners();

        // Show the gameover panel
        this.state.start('GameOver');
    }

    function shootLaser() {
        var laser = this.lasers.getFirstExists(false);

        if (!laser) {
            laser = new Game.Prefabs.Laser(this.game, 0, 0);
            this.lasers.add(laser);
        }
        laser.reset(
            this.game.width + laser.width / 2,
            this.game.rnd.integerInRange(20, this.game.height));
        laser.reload(100 + (this.level + 1) * 30);

        // Relaunch bullet timer depending on level
        this.lasersGenerator = this.game.time.events
            .add(
                this.game.rnd.integerInRange(12, 20) * 250 / (this.level + 1),
                this.shootLaser, this);
    }

    function forEachEnemy(fn) {
        var levelEnemies = this.enemyGroups;
        for (var i = 0; i < this.enemyGroupsCount; i++) {
            var enemies = levelEnemies[i];
            enemies.forEach(fn, this);
        }
    }

    function pauseGame() {
        if (!Game.paused) {
            Game.paused = true;
            this.hero.follow = false;

            if (Game.multiplayer) {} else {
                this.enemiesGenerator.timer.pause();

                this.forEachEnemy(function(group) {
                    group.callAll('pause');
                });

                this.lasers.forEach(function(laser) {
                    laser.pause();
                }, this);
            }

            if (!this.gameover) {
                // this.pausePanel.show();
            }
        }
    }
}
