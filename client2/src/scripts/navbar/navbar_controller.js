angular.module('app.navbar')
.controller('NavbarController', function($scope, Game, players, User) {

  $scope.connectedPlayers = [];
  $scope.game = Game;
  $scope.User = User;
  $scope.$on('newPlayers', function(evt, players) {
    $scope.connectedPlayers = players;
  });

})
