window.onload = function () {
  let ourGame;

  const startButton = document.getElementById("start-button");
  const restartButton = document.getElementById("restart-button");

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
};
