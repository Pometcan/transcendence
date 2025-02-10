class Game2D {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.paddleWidth = 30;
    this.paddleHeight = 100;
    this.paddleTopWidth = 100;
    this.paddleTopHeight = 30;
    this.p1_y = 50; // Left Paddle (Magenta)
    this.p2_y = 50; // Right Paddle (Cyan)
    this.p3_x = 50; // Top Paddle (Yellow)
    this.p4_x = 50; // Bottom Paddle (Lime)
    this.ball_x = 50;
    this.ball_y = 50;
    this.p1_score = 0; // Left Score
    this.p2_score = 0; // Right Score
    this.p3_score = 0; // Top Score
    this.p4_score = 0; // Bottom Score
    this.ball_speed = 1;
    this.isSingleplayer = false;
    this.isFourPlayer = false;
    this.ball_dx = 1; // Ball direction in x-axis (-1 for left, 1 for right)
    this.ball_dy = 1; // Ball direction in y-axis (-1 for up, 1 for down)
    this.draw();
    this.gameLoop = null;
    this.p1_targetY = this.p1_y; // Target Y for smooth movement (Left)
    this.p2_targetY = this.p2_y;  // Target Y for smooth movement (Right)
    this.p3_targetX = this.p3_x; // Target X for smooth movement (Top)
    this.p4_targetX = this.p4_x; // Target X for smooth movement (Bottom)
    this.keys = this.keysload()
    this.maxScore = 10;
    this.gameEnded = false;
    this.currentMap = 'normal'; // Default map is normal
  }

  keysload(){
    return {
      'w': false, // P1 Up (Left Paddle)
      's': false, // P1 Down (Left Paddle)
      'ArrowUp': false, // P2 Up (Right Paddle)
      'ArrowDown': false, // P2 Down (Right Paddle)
      'v': false, // P3 Left (Top Paddle) - Changed from 'a' to 'v'
      'b': false, // P3 Right (Top Paddle) - Changed from 'd' to 'b'
      'j': false, // P4 Left (Bottom Paddle)
      'l': false  // P4 Right (Bottom Paddle)
    }
  }

}
