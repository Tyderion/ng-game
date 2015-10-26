
angular.module('app', [
  'ui.router',
  require('./menu').name,
  require('./game').name,
  require('./user').name,
  require('./navbar').name,
  require('./overlay').name,
  require('./network').name,
])
.config(function($urlRouterProvider) {
  $urlRouterProvider
    .otherwise('/menu');
})
  // Game.States.GameOver = function(game) {

  // };

  // Game.States.GameOver.prototype.create = function() {
  //   if (Game.multiplayer) {
  //     // Gameover panel
  //     this.gameoverPanel = new Game.Prefabs.GameoverPanel(this.game);
  //     this.game.add.existing(this.gameoverPanel);

  //     this.gameoverPanel.show(Game.score);
  //   }
  // };
