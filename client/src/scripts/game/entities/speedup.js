module.exports = (function(Game) {

    Game.Prefabs.PickupSpeedUp = PickupSpeedUp;

    Game.Prefabs.PickupSpeedUp.prototype = Object.create(Game.Prefabs.Pickup.prototype);
    Game.Prefabs.PickupSpeedUp.constructor = Game.Prefabs.PickupSpeedUp;

    function PickupSpeedUp(game, x, y) {
        Game.Prefabs.Pickup.call(this, game, x, y, {
            speed: 1.5
        }, 'pickup_speed_up');
    }


    Game.Prefabs.PickupSpeedDown = PickupSpeedDown;

    Game.Prefabs.PickupSpeedDown.prototype = Object.create(Game.Prefabs.Pickup.prototype);
    Game.Prefabs.PickupSpeedDown.constructor = Game.Prefabs.PickupSpeedDown;

    function PickupSpeedDown(game, x, y) {
        Game.Prefabs.Pickup.call(this, game, x, y, {
            speed: 0.7
        }, 'pickup_speed_down');
    }
});
