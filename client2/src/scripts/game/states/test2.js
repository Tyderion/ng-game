module.exports = function Test(Game) {
    function create() {
        if (Game.multiplayer) {
            this.gameoverPanel = new Game.Prefabs.GameOverPanel(this.game);
            this.game.add.existing(this.gameoverPanel);;
            // this.gameoverPanel.show(Game.score);;
        }
    }
};
