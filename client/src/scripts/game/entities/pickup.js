module.exports = (function(Game) {

    Game.Prefabs.Pickup = Pickup;
    Game.Prefabs.Pickup.prototype = Object.create(Phaser.Sprite.prototype);
    Game.Prefabs.Pickup.constructor = Game.Prefabs.Pickup;

    var DEFAULT_PICKUP_DATA = {
        speed: 1,
        duration: -1,
        damage: 1
    }

    function prepareData(data) {
       return _.merge(_.clone(DEFAULT_PICKUP_DATA), data)
    }

    function Pickup(game, x, y, data, texture) {
        var fullData = prepareData(data);
        this.getPickupData = function() {
            return fullData;
        }
        this.game = game;
        Phaser.Sprite.call(this, game, x, y, texture);

        this.anchor.setTo(0.5, 0.5);
        this.scale.setTo(0.1, 0.1);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);

        this.angle = -Math.PI / 2;
    }
});
