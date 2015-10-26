module.exports = (function(Game) {

 Game.Prefabs.Pickup.createPickup('PickupSpeedUp', {
            speed: 1.5
        }, 'pickup_speed_up');

 Game.Prefabs.Pickup.createPickup('PickupSpeedDown', {
            speed: 0.7
        }, 'pickup_speed_down');

});
