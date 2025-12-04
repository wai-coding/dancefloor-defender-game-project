window.onload = function () {
  let ourGame;

  const startButton = document.getElementById("start-button");
  const restartButton = document.getElementById("restart-button");
  const gameScreenElement = document.getElementById("game-screen");

  // Elements that share the same background (light/dark)
  const introGameArea = document.getElementById("intro-game-area");
  const endGameArea = document.getElementById("end-game-area");

  // All theme toggle buttons (one in each screen)
  const themeButtons = document.querySelectorAll(".theme-toggle");

  // Paths for light and dark backgrounds
  const LIGHT_BG = "./images/background-light.png";
  const DARK_BG = "./images/background-dark.png";

  // State: false = light mode (default), true = dark mode
  let isDarkMode = false;

  // Apply current theme to all relevant elements
  function applyTheme() {
    const bgUrl = isDarkMode ? `url("${DARK_BG}")` : `url("${LIGHT_BG}")`;

    // Update backgrounds on intro, game, and end screens
    if (introGameArea) introGameArea.style.backgroundImage = bgUrl;
    if (gameScreenElement) gameScreenElement.style.backgroundImage = bgUrl;
    if (endGameArea) endGameArea.style.backgroundImage = bgUrl;

    // Update button text according to current mode
    themeButtons.forEach((btn) => {
      btn.textContent = isDarkMode
        ? "TURN ON THE LIGHTS"
        : "TURN OFF THE LIGHTS";
    });
  }

  // Attach click listeners to all theme buttons
  themeButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      isDarkMode = !isDarkMode; // toggle state
      applyTheme();
      // Remove focus from the buttom. (Fixes the space bar clicking the buttom problem)
      btn.blur();
    });
  });

  // Initial theme (light) – ensures button text is correct on load
  applyTheme();

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
