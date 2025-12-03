class Game {
  constructor() {
    // DOM elements for the three main screens
    this.startScreen = document.getElementById("game-intro");
    this.gameContainer = document.getElementById("game-container");
    this.gameScreen = document.getElementById("game-screen");
    this.endScreen = document.getElementById("game-end");

    // Score
    this.score = 0;
    this.scoreElement = document.getElementById("score");
    this.finalScoreElement = document.getElementById("final-score");

    // Level (derived from difficulty)
    this.level = 1;
    this.levelElement = document.getElementById("level");

    // Lives system (player health)
    this.lives = 3;
    this.livesElement = document.getElementById("lives");

    // Core game objects
    this.player = null;
    this.enemies = [];
    this.bullets = [];

    // Game state flags and counters
    this.gameIsOver = false;
    this.frames = 0; // frame counter used for timing
    this.difficulty = 0; // difficulty level (increases over time)

    // Interval id for the game loop
    this.gameInterval = null;

    // Game area dimensions
    this.width = 500;
    this.height = 600;
  }

  // Called once when the player clicks "Start Game"
  start() {
    // Hide start and end screens, show the game container
    this.startScreen.style.display = "none";
    this.endScreen.style.display = "none";
    this.gameContainer.style.display = "flex";

    // Make sure the game screen has the correct size
    this.gameScreen.style.width = `${this.width}px`;
    this.gameScreen.style.height = `${this.height}px`;

    // Create a new player instance
    this.player = new Player(this.gameScreen);

    // Reset arrays and counters in case we restart the game
    this.enemies = [];
    this.bullets = [];
    this.frames = 0;
    this.gameIsOver = false;

    // Reset difficulty, level and score
    this.difficulty = 0;
    this.level = 1;
    this.levelElement.innerText = this.level;

    this.score = 0;
    this.scoreElement.innerText = this.score;

    this.lives = 3;
    this.livesElement.innerText = this.lives;

    // Start the game loop at 60 FPS
    this.gameInterval = setInterval(() => {
      this.gameLoop();
    }, 1000 / 60);
  }

  // Main loop: runs every frame
  gameLoop() {
    // If the game is over, stop the loop and show the Game Over screen
    if (this.gameIsOver) {
      clearInterval(this.gameInterval);
      this.gameOver();
      return;
    }

    // Increase frame counter (used for timing logic)
    this.frames++;

    // Increase difficulty every 600 frames (+/- 10 seconds)
    if (this.frames % 600 === 0) {
      this.difficulty++;

      // Level is difficulty + 1 (level 1 = base difficulty)
      this.level = this.difficulty + 1;
      this.levelElement.innerText = this.level;
    }

    // Calculate dynamic spawn interval based on difficulty
    // Base interval is 90 frames, but it gets smaller over time
    const baseSpawnInterval = 90;
    const minSpawnInterval = 40;
    const spawnInterval = Math.max(
      minSpawnInterval,
      baseSpawnInterval - this.difficulty * 5
    );

    // Spawn a new enemy every 'spawnInterval' frames
    if (this.frames % spawnInterval === 0) {
      const speedBoost = this.difficulty * 0.3;
      const newEnemy = new Enemy(this.gameScreen, speedBoost);
      this.enemies.push(newEnemy);
    }

    // Update positions, check collisions, remove off-screen objects, etc.
    this.update();
  }

  // Update all game entities and handle collisions
  update() {
    // Move player
    this.player.move();

    // Move enemies and check collision with player or bottom of the screen
    for (let i = 0; i < this.enemies.length; i++) {
      const enemy = this.enemies[i];
      enemy.move();

      // Collision: enemy hits the player = game over
      if (enemy.didCollide(this.player)) {
        // Remove the enemy that hit the player
        enemy.remove();
        this.enemies.splice(i, 1);
        i--;

        // Decrease player lives
        this.lives--;
        this.livesElement.innerText = this.lives;

        // If no lives left = Game Over
        if (this.lives <= 0) {
          this.gameIsOver = true; // stop checking further and game will end
        }

        // Skip to next enemy
        continue;
      }

      // Enemy goes off the screen (bottom) = remove it and add score
      if (enemy.top > this.height) {
        enemy.remove();
        this.enemies.splice(i, 1);
        i--; // adjust index after removal

        // Enemy reached the bottom without hitting the player = +1 point
        this.score += 1;
        this.scoreElement.innerText = this.score;
      }
    }

    // Move bullets and remove those that leave the top of the screen
    for (let i = 0; i < this.bullets.length; i++) {
      const bullet = this.bullets[i];
      bullet.move();

      if (bullet.top < -20) {
        bullet.remove();
        this.bullets.splice(i, 1);
        i--; // adjust index after removal
      }
    }

    // Check collisions between bullets and enemies
    // Nested loops: for each bullet, check all enemies
    for (let i = 0; i < this.bullets.length; i++) {
      const bullet = this.bullets[i];

      for (let j = 0; j < this.enemies.length; j++) {
        const enemy = this.enemies[j];

        // Use the Bullet method didHit
        if (bullet.didHit(enemy)) {
          // Remove from DOM
          bullet.remove();
          enemy.remove();

          // Remove from arrays
          this.bullets.splice(i, 1);
          this.enemies.splice(j, 1);

          // Enemy destroyed by a bullet = +2 points
          this.score += 2;
          this.scoreElement.innerText = this.score;

          // Adjust bullet index since we removed the current bullet
          i--;

          // Break out of the enemy loop for this bullet
          break;
        }
      }
    }
  }

  // Called when the game ends (player hit by an enemy)
  gameOver() {
    // Hide the game container and show the Game Over screen
    this.gameContainer.style.display = "none";
    this.endScreen.style.display = "flex";

    // Update final score text
    this.finalScoreElement.innerText = this.score;
  }
}
