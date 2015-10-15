module.exports = (function(Game) {

    Game.Prefabs.PickupSpeedUp = SpeedUp;

    Game.Prefabs.PickupSpeedUp.prototype = Object.create(Game.Prefabs.Pickup.prototype);
    Game.Prefabs.PickupSpeedUp.constructor = Game.Prefabs.PickupSpeedUp;

    function SpeedUp(game, x, y) {
        Game.Prefabs.Pickup.call(this, game, x, y, {
            speed: 1.5,
            length: -1
        }, 'pickup_speed_up');
    }
});
