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
    this.ball_x = 50;
    this.ball_y = 50;
    this.p1_score = 0; // Left Score
    this.p2_score = 0; // Right Score
    this.ball_speed = 1;
    this.ball_speed_max = 5;
    this.ball_speed_acceleration = 1.1;
    this.isSingleplayer = false;
    this.isFourPlayer = false;
    this.ball_dx = 1; // Ball direction in x-axis (-1 for left, 1 for right)
    this.ball_dy = 1; // Ball direction in y-axis (-1 for up, 1 for down)
    this.draw();
    this.gameLoop = null;
    this.p1_targetY = this.p1_y; // Target Y for smooth movement (Left)
    this.p2_targetY = this.p2_y;  // Target Y for smooth movement (Right)
    this.keys = this.keysload()
    this.maxScore = 5;
    this.gameEnded = false;
    this.currentMap = 'normal'; // Default map is normal
  }

  keysload(){
    return {
      'w': false, // P1 Up (Left Paddle)
      's': false, // P1 Down (Left Paddle)
      'ArrowUp': false, // P2 Up (Right Paddle)
      'ArrowDown': false, // P2 Down (Right Paddle)
    }
  }

  updatePaddles(p1, p2) {
    const canvasHeight = this.canvas.height;
    const paddleHeight = this.paddleHeight;
    const speedMultiplier = 2.5; // Paddle speed multiplier
    if(p1 !== undefined){
      this.p1_targetY = Math.max(0, Math.min(100, p1));
    }
    if(p2 !== undefined){
        this.p2_targetY = Math.max(0, Math.min(100, p2));
    }
  }

  updatePaddlePositions(){
    const speed = 0.2; // Smoothing speed for paddles
    if(this.p1_y !== this.p1_targetY)
    {
      this.p1_y += (this.p1_targetY - this.p1_y) * speed;
      if (Math.abs(this.p1_targetY - this.p1_y) < 0.1) {
        this.p1_y = this.p1_targetY;
      }
    }
    if(this.p2_y !== this.p2_targetY)
    {
      this.p2_y += (this.p2_targetY - this.p2_y) * speed;
      if (Math.abs(this.p2_targetY - this.p2_y) < 0.1) {
        this.p2_y = this.p2_targetY;
      }
    }
  }

  movePaddles(){
    const speedMultiplier = 2.5;
    if(this.keys['w'])
      this.updatePaddles(this.p1_targetY - 2 * speedMultiplier, undefined, undefined, undefined);
    if(this.keys['s'])
      this.updatePaddles(this.p1_targetY + 2* speedMultiplier, undefined, undefined, undefined);
    if(this.keys['ArrowUp'])
      this.updatePaddles(undefined, this.p2_targetY - 2* speedMultiplier, undefined, undefined);
    if(this.keys['ArrowDown'])
      this.updatePaddles(undefined, this.p2_targetY + 2* speedMultiplier, undefined, undefined);
  }

  updateSingleplayer() {
    this.movePaddles();
    this.updatePaddlePositions();
    this.updateBallPosition();
    this.handleCollisions();
    this.draw();
    this.checkGameEnd();
  }

  updateMultiplayer(p1, p2)
  {
    if (p1 !== undefined)
      this.p1_targetY = p1;
    if (p2 !== undefined)
      this.p2_targetY = p2;
    this.updatePaddlePositions();
    this.draw();
  }

  updateBall(ball_x, ball_y, p1_score, p2_score, ball_speed) {
    this.ball_x = ball_x;
    this.ball_y = ball_y;
    this.p1_score = p1_score;
    this.p2_score = p2_score;
    this.ball_speed = ball_speed;
    this.updateScoreDisplay();
    this.draw();
  }

  handleCollisions(){
    const ballX = this.canvas.width * (this.ball_x / 100);
    const ballY = this.canvas.height * (this.ball_y / 100);

    if (ballY + 10 > this.canvas.height || ballY - 10 < 0)
      this.ball_dy *= -1;

    const p1Y = (this.canvas.height - this.paddleHeight) * (this.p1_y / 100);
    if (ballX - 10 <= 20 + this.paddleWidth &&
      ballY + 10 >= p1Y &&
      ballY - 10 <= p1Y + this.paddleHeight &&
      this.ball_dx < 0) {
      this.ball_dx *= -1;
      if (this.ball_speed_max > this.ball_speed)
      this.ball_speed *= this.ball_speed_acceleration;
      this.ball_dx = Math.abs(this.ball_dx); // Ensure that the ball goes to the right.
    }

    const p2Y = (this.canvas.height - this.paddleHeight) * (this.p2_y / 100);
    if (ballX + 10 >= this.canvas.width - 20 - this.paddleWidth &&
      ballY + 10 >= p2Y &&
      ballY - 10 <= p2Y + this.paddleHeight &&
      this.ball_dx > 0  ) {
      this.ball_dx *= -1;
      if (this.ball_speed_max > this.ball_speed)
      this.ball_speed *= this.ball_speed_acceleration;
      this.ball_dx = - Math.abs(this.ball_dx); //Ensure that the ball goes to the left.
    }

    // Collision with map patterns
    this.handleMapPatternCollision(ballX, ballY);


      // Ball scoring for 2 player mode (left and right walls)
    if (!this.isFourPlayer) {
      if (ballX < 0) {
        this.p2_score++;
          this.resetBall();
      } else if (ballX > this.canvas.width) {
        this.p1_score++;
        this.resetBall();
      }
    } else {
        const cornerScoreRange = 150; // Define the range for corner scoring in pixels from top/bottom
        if (ballX < 0) {
            if (ballY < cornerScoreRange || ballY > this.canvas.height - cornerScoreRange) {
                this.p2_score++; // Right player scores on left corners
                this.resetBall();
            } else {
                this.ball_dx *= -1; // Bounce off left wall if not in corner score zone
            }
        } else if (ballX > this.canvas.width) {
            if (ballY < cornerScoreRange || ballY > this.canvas.height - cornerScoreRange) {
                this.p1_score++; // Left player scores on right corners
                this.resetBall();
            } else {
                this.ball_dx *= -1; // Bounce off right wall if not in corner score zone
            }
        }
    }
    this.updateScoreDisplay();
  }

  handleMapPatternCollision(ballX, ballY) {
      const canvasWidth = this.canvas.width;
      const canvasHeight = this.canvas.height;

      if (this.currentMap === 'map1') { // Heart Pattern
          const heart = this.getHeartPath(canvasWidth / 2, canvasHeight / 2, 100);
          if (this.isPointInPath(ballX, ballY, heart)) {
              this.ball_dx *= -1;
              this.ball_dy *= -1;
              this.ball_speed *= 1.1;
          }
      } else if (this.currentMap === 'map2') { // Star Pattern
          const star = this.getStarPath(canvasWidth / 2, canvasHeight / 2, 80, 40);
          if (this.isPointInPath(ballX, ballY, star)) {
              this.ball_dx *= -1;
              this.ball_dy *= -1;
              this.ball_speed *= 1.1;
          }
      } else if (this.currentMap === 'map3') { // Circle Pattern
          const centerX = canvasWidth / 2;
          const centerY = canvasHeight / 2;
          const radius = 60;
          if (Math.sqrt((ballX - centerX) ** 2 + (ballY - centerY) ** 2) <= radius + 10) { // +10 for ball radius
              const angle = Math.atan2(ballY - centerY, ballX - centerX);
              const ballAngle = Math.atan2(this.ball_dy, this.ball_dx);
              const diffAngle = angle - ballAngle;

              if (Math.abs(diffAngle) > Math.PI / 2 && Math.abs(diffAngle) < 3 * Math.PI / 2) {
                  this.ball_dx *= -1;
              } else {
                  this.ball_dy *= -1;
              }
              this.ball_speed *= 1.1;
          }
      }
  }

  isPointInPath(x, y, path) {
      this.ctx.beginPath();
      this.ctx.moveTo(path[0][0], path[0][1]);
      for (let i = 1; i < path.length; i++) {
          this.ctx.lineTo(path[i][0], path[i][1]);
      }
      this.ctx.closePath();
      return this.ctx.isPointInPath(x, y);
  }
  getHeartPath(centerX, centerY, size) {
      const path = [];
      const topCurveHeight = size * 0.3;
      path.push([centerX, centerY + size * 0.25]);
      path.push([centerX - size / 2, centerY - topCurveHeight]);
      path.push([centerX - size, centerY + size / 4]);
      path.push([centerX, centerY + size]);
      path.push([centerX + size, centerY + size / 4]);
      path.push([centerX + size / 2, centerY - topCurveHeight]);
      path.push([centerX, centerY + size * 0.25]);
      return path;
  }

  getStarPath(centerX, centerY, outerRadius, innerRadius) {
      const points = 5;
      const path = [];
      for (let i = 0; i < 2 * points; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = (i * Math.PI) / points;
          path.push([centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle)]);
      }
      return path;
  }


  resetBall(){
      this.ball_x = 50;
      // Start from top for custom maps, center otherwise
      this.ball_y = ['map1', 'map2', 'map3'].includes(this.currentMap) ? 10 : 50;
      this.ball_speed = 1;
      this.ball_dx = Math.random() > 0.5 ? 1 : -1;
      this.ball_dy = Math.random() > 0.5 ? 1 : -1;
  }

   updateBallPosition(){
      const speedMultiplier = this.isSingleplayer ? 0.5 : 1;
       this.ball_x += this.ball_dx * this.ball_speed * speedMultiplier;
      this.ball_y += this.ball_dy * this.ball_speed * speedMultiplier;
  }

  updateScoreDisplay(){
      if (!this.isFourPlayer) {
          document.getElementById('scores').textContent = `P1: ${this.p1_score} | P2: ${this.p2_score}`;
      } else {
          document.getElementById('scores').textContent = `Sol Köşe: ${this.p1_score} | Sağ Köşe: ${this.p2_score}`;
      }
  }
   checkGameEnd() {
          if (this.isSingleplayer && !this.gameEnded) {
              if (this.p1_score >= this.maxScore || this.p2_score >= this.maxScore || (this.isFourPlayer && (this.p1_score >= this.maxScore || this.p2_score >= this.maxScore))) {
                  this.gameEnded = true;
                  this.stopGameLoop();
                  let winnerText = "Oyun Bitti! ";
                  if (!this.isFourPlayer) {
                      winnerText += `${this.p1_score > this.p2_score ? 'P1 Kazandı' : 'P2 Kazandı'}`;
                  } else {
                      winnerText += `${this.p1_score > this.p2_score ? 'Sol Köşe Kazandı' : 'Sağ Köşe Kazandı'}`;
                  }

                  statusDiv.textContent = winnerText;
                  if (isTournamentMode) {
                      handleTournamentMatchEnd(this.p1_score > this.p2_score ? currentP1Index : currentP2Index);
                  }
              }
          }
   }

  drawMapPatterns(mapType) {
      if (mapType === 'normal') return; // Do not draw patterns for normal map

      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'; // Semi-transparent white for patterns
      const canvasWidth = this.canvas.width;
      const canvasHeight = this.canvas.height;

      if (mapType === 'map1') { // Heart
          const heartPath = this.getHeartPath(canvasWidth / 2, canvasHeight / 2, 100);
          this.ctx.beginPath();
          this.ctx.moveTo(heartPath[0][0], heartPath[0][1]);
          for (let i = 1; i < heartPath.length; i++) {
              this.ctx.lineTo(heartPath[i][0], heartPath[i][1]);
          }
          this.ctx.closePath();
          this.ctx.fill();

      } else if (mapType === 'map2') { // Star
          const starPath = this.getStarPath(canvasWidth / 2, canvasHeight / 2, 80, 40);
          this.ctx.beginPath();
          this.ctx.moveTo(starPath[0][0], starPath[0][1]);
          for (let i = 1; i < starPath.length; i++) {
              this.ctx.lineTo(starPath[i][0], starPath[i][1]);
          }
          this.ctx.closePath();
          this.ctx.fill();
      } else if (mapType === 'map3') { // Circle
          this.ctx.beginPath();
          this.ctx.arc(canvasWidth / 2, canvasHeight / 2, 60, 0, Math.PI * 2);
          this.ctx.closePath();
          this.ctx.fill();
      }
  }


  draw() {
      this.ctx.fillStyle = '#1a1a1a';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      this.drawMapPatterns(this.currentMap); // Draw map patterns

      // Left Paddle (P1)
      this.ctx.fillStyle = 'magenta';
      const p1Y = (this.canvas.height - this.paddleHeight) * (this.p1_y / 100);
      this.ctx.fillRect(
          20,
          p1Y,
          this.paddleWidth,
          this.paddleHeight
      );

       // Right Paddle (P2)
      this.ctx.fillStyle = 'cyan';
      const p2Y = (this.canvas.height - this.paddleHeight) * (this.p2_y / 100);
      this.ctx.fillRect(
          this.canvas.width - 20 - this.paddleWidth,
          p2Y,
          this.paddleWidth,
          this.paddleHeight
      );

      if (this.isFourPlayer) {
          // Top Paddle (P3) - Yellow
          this.ctx.fillStyle = 'yellow';
          const p3X = (this.canvas.width - this.paddleTopWidth) * (this.p3_x / 100);
          this.ctx.fillRect(
              p3X,
              20,
              this.paddleTopWidth,
              this.paddleTopHeight
          );

          // Bottom Paddle (P4) - Lime
          this.ctx.fillStyle = 'lime';
          const p4X = (this.canvas.width - this.paddleTopWidth) * (this.p4_x / 100);
          this.ctx.fillRect(
              p4X,
              this.canvas.height - 20 - this.paddleTopHeight,
              this.paddleTopWidth,
              this.paddleTopHeight
          );
      }

      // Ball
      this.ctx.beginPath();
      const ballX = this.canvas.width * (this.ball_x / 100);
      const ballY = this.canvas.height * (this.ball_y / 100);
      this.ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
      this.ctx.fillStyle = 'white';
      this.ctx.fill();
      this.ctx.closePath();
  }
  startGameLoop() {
       this.gameLoop = setInterval(() => {
           this.updatePaddlePositions(); // Update paddle positions for smooth movement in every frame
           if (isMultiplayer) {
               this.draw(); // For multiplayer, only draw (positions are updated by server)
           } else {
               this.updateSingleplayer(); // For singleplayer, update game logic and draw
           }
          }, 1000 / 60);
  }


   stopGameLoop() {
          clearInterval(this.gameLoop);
      }
}

}
