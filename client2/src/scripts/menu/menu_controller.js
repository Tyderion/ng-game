angular.module('app.menu')
.controller('MenuController', function(mySocket, $scope, Room, User, $state) {
  console.log('menu2')
  $scope.$on('map:update', function(evt, mapId) {
    ctrl.rooms = Room.getRooms();
  });

  var ctrl = this;
  $scope.username = User.getCurrentUser().username;

  ctrl.createId = function() {
    return new Date().getTime().toString();
  };

  $scope.startGame = function() {
    $scope.storeUsername();
    $state.go('game.play', {
      id: ctrl.createId()
    })
  }


  $scope.storeUsername = function() {
    console.log('store username')
  	User.setCurrentUser({
  		username: $scope.username
  	});
  }

});
