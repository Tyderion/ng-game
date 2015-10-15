module.exports = (function(Game) {

    Game.Prefabs.Pickup = Pickup;
    Game.Prefabs.Pickup.prototype = Object.create(Phaser.Sprite.prototype);
    Game.Prefabs.Pickup.constructor = Game.Prefabs.Pickup;

    function Pickup(game, x, y, data, texture) {
        this.getPickupData = function() {
            return data;
        }
        this.game = game;
        Phaser.Sprite.call(this, game, x, y, texture);

        this.anchor.setTo(0.5, 0.5);
        this.scale.setTo(0.1, 0.1);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);

        this.angle = -Math.PI / 2;
    }
});
