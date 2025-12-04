window.onload = function () {
  let ourGame;

  const startButton = document.getElementById("start-button");
  const restartButton = document.getElementById("restart-button");
  const gameScreenElement = document.getElementById("game-screen");

  // Start game
  startButton.addEventListener("click", function () {
    ourGame = new Game();
    ourGame.start();
  });

  // Restart game by reloading the page
  restartButton.addEventListener("click", function () {
    window.location.reload();
  });

  // Keyboard controls
  window.addEventListener("keydown", function (event) {
    // Prevent errors if keys are pressed before the game starts
    if (!ourGame || !ourGame.player) return;

    // Horizontal movement (LEFT and RIGHT arrows)
    if (event.code === "ArrowLeft") {
      ourGame.player.speedX = -5;
    }

    if (event.code === "ArrowRight") {
      ourGame.player.speedX = 5;
    }

    // Shooting (SPACE) - create a new Bullet
    if (event.code === "Space") {
      const bulletLeft = ourGame.player.left + ourGame.player.width / 2 - 3; // center bullet
      const bulletTop = ourGame.player.top - 10; // start above the player

      const newBullet = new Bullet(ourGame.gameScreen, bulletLeft, bulletTop);
      ourGame.bullets.push(newBullet);
    }
  });

  window.addEventListener("keyup", function (event) {
    if (!ourGame || !ourGame.player) return;

    if (event.code === "ArrowLeft" || event.code === "ArrowRight") {
      ourGame.player.speedX = 0;
    }
  });

  // TOUCH CONTROLS (Mobile)
  if (gameScreenElement) {
    // Touch start: decide action based on horizontal position of the finger
    gameScreenElement.addEventListener("touchstart", function (event) {
      if (!ourGame || !ourGame.player) return;

      const touch = event.touches[0];
      const rect = gameScreenElement.getBoundingClientRect();

      // X position of the touch relative to the game-screen
      const relativeX = touch.clientX - rect.left;
      const third = rect.width / 3;

      if (relativeX < third) {
        // Left third = move left
        ourGame.player.speedX = -5;
      } else if (relativeX > 2 * third) {
        // Right third = move right
        ourGame.player.speedX = 5;
      } else {
        // Middle third = shoot
        const bulletLeft = ourGame.player.left + ourGame.player.width / 2 - 3; // center bullet
        const bulletTop = ourGame.player.top - 10; // above player

        const newBullet = new Bullet(ourGame.gameScreen, bulletLeft, bulletTop);
        ourGame.bullets.push(newBullet);
      }
    });

    // Touch end: stop horizontal movement
    gameScreenElement.addEventListener("touchend", function (event) {
      if (!ourGame || !ourGame.player) return;
      ourGame.player.speedX = 0;
    });
  }
};