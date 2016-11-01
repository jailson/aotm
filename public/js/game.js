App.Game = function Game() {
    var self = this;
    var Graphics = App.systems.Graphics;
    var AR = App.systems.AR;

    var systems = [
        Graphics,
        AR
    ];

    systems.forEach((system) => {
        system.init({});
    });

    // Graphics must be the first to be initialized and the last to be updated
    systems = systems.reverse();

    var clock = new THREE.Clock();
    var deltaTime;
    var gameLoop = () => {
        var deltaTime = clock.getDelta();
        systems.forEach((system) => {
            system.update({ entities: App.entities, deltaTime: deltaTime });
        });

        if (self.isRunning !== false) {
            requestAnimationFrame(gameLoop);
        }
    }

    // Start the game loop
    requestAnimationFrame(gameLoop);

    // Lose condition
    this.isRunning = true;
    this.endGame = () => {
        self.isRunning = false;
    };

    return this;
};

App.game = new App.Game();
