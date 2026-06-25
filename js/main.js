document.addEventListener('DOMContentLoaded', function (){
    
    // Первый экран
    
    // Мальчик-взрослый

    let swapimg = document.querySelector('.titleboy')
    let origin = "./Pics/Title/boy.png";
    let hoverimg = "./Pics/Title/man.png";

swapimg.addEventListener('mouseenter', function(){
swapimg.src = hoverimg;
 })



 swapimg.addEventListener("mouseenter", function(){
 swapimg.src = hoverimg;
 });

 swapimg.addEventListener("mouseleave", function(){
    swapimg.src = origin
 });

 // Девочка-взрослая

let swapimg1 = document.querySelector('.titlegirl')
    let origin1 = "./Pics/Title/girl.png";
    let hoverimg1 = "./Pics/Title/woman.png";

swapimg1.addEventListener('mouseenter', function(){
swapimg1.src = hoverimg1;
 })



 swapimg1.addEventListener("mouseenter", function(){
 swapimg1.src = hoverimg1;
 });

 swapimg1.addEventListener("mouseleave", function(){
    swapimg1.src = origin1
 });

 // Логотип стирается

const logoWrap = document.querySelector('.logo');
    const canvas = document.querySelector('.logotype-canvas');

    if (logoWrap && canvas) {
        const ctx = canvas.getContext('2d');
        const logoImg = new Image();
        logoImg.src = './Pics/Title/logo.png';

        function drawLogo() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = 'source-over';
            ctx.drawImage(logoImg, 0, 0, canvas.width, canvas.height);
        }

        function resizeCanvas() {
            if (!logoImg.naturalWidth || !logoWrap.clientWidth) return;

            const logoWidth = logoWrap.clientWidth;
            const logoHeight = logoWidth * (logoImg.naturalHeight / logoImg.naturalWidth);

            logoWrap.style.height = logoHeight + 'px';

            canvas.width = logoWidth;
            canvas.height = logoHeight;
            drawLogo();
        }

        logoImg.onload = function () {
            resizeCanvas();
        };

        window.addEventListener('resize', resizeCanvas);

        let lastX = null;
let lastY = null;

canvas.addEventListener('mousemove', function (e) {

    const rect = canvas.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';

    if (lastX !== null && lastY !== null) {

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);

        ctx.lineWidth = 5; 
        ctx.lineCap = "round"; 

        ctx.stroke();
    }

    lastX = x;
    lastY = y;
});
    }

 // Игра в шарики

  const game = document.getElementById("game1");
  const girl = document.getElementById("girl");
  const ballCount = document.getElementById("ballCount");
  const gamePopup = document.getElementById("gamePopup");

  if (!game || !girl || !ballCount || !gamePopup) {
    console.log("Не найдены нужные элементы HTML");
    return;
  }

  const GAME_WIDTH = game.clientWidth;
  const GAME_HEIGHT = game.clientHeight;

  const MAX_BALLS = 5;
  const BALL_SPEED = 2.4;
  const SPAWN_DELAY = 900;

  const GRAVITY = 0.55;
  const JUMP_FORCE = 13.5;
  const FAST_DROP_FORCE = 1.1;
  const GROUND_Y = 18;
  const WIN_SCORE = 10;

  const ballImages = [
    "./Pics/Bicycle/ball1.png",
    "./Pics/Bicycle/ball2.png",
    "./Pics/Bicycle/ball3.png"
  ];

  const player = {
    x: 40,
    y: GROUND_Y,
    width: 95,
    height: 95,
    velocityY: 0,
    grounded: true
  };

  let score = 0;
  let balls = [];
  let gameStarted = false;
  let gameOver = false;
  let spawnInterval = null;

  function renderGirl() {
    girl.style.left = player.x + "px";
    girl.style.bottom = player.y + "px";
  }

  function jump() {
    if (player.grounded && !gameOver) {
      player.velocityY = JUMP_FORCE;
      player.grounded = false;
    }
  }

  function fastDrop() {
    if (!player.grounded && !gameOver) {
      player.velocityY -= FAST_DROP_FORCE;
    }
  }

  function startGame() {
    if (gameStarted || gameOver) return;
    gameStarted = true;

    spawnInterval = setInterval(() => {
      if (balls.length < MAX_BALLS && !gameOver) {
        createBall();
      }
    }, SPAWN_DELAY);
  }

  function createBall() {
    if (gameOver) return;

    const ball = document.createElement("div");
    ball.classList.add("ball");

    const randomImage = ballImages[Math.floor(Math.random() * ballImages.length)];
    ball.style.backgroundImage = `url("${randomImage}")`;

    const ballWidth = 38;
    const ballHeight = 55;

    const minY = 150;
    const maxY = 250;
    const randomY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

    const ballData = {
      el: ball,
      x: GAME_WIDTH + 20,
      y: randomY,
      width: ballWidth,
      height: ballHeight
    };

    ball.style.left = ballData.x + "px";
    ball.style.bottom = ballData.y + "px";

    game.appendChild(ball);
    balls.push(ballData);
  }

  function isColliding(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  function endGame() {
    gameOver = true;

    if (spawnInterval) {
      clearInterval(spawnInterval);
    }

    gamePopup.classList.add("show");
  }

  window.addEventListener("keydown", (e) => {
    if (gameOver) return;

    if (e.code === "ArrowUp") {
      e.preventDefault();
      startGame();
      jump();
    }

    if (e.code === "ArrowDown") {
      e.preventDefault();
      fastDrop();
    }
  });

  function updateGame() {
    if (gameOver) return;

    player.velocityY -= GRAVITY;
    player.y += player.velocityY;

    if (player.y <= GROUND_Y) {
      player.y = GROUND_Y;
      player.velocityY = 0;
      player.grounded = true;
    }

    renderGirl();

    const playerBox = {
      x: player.x,
      y: player.y,
      width: player.width,
      height: player.height
    };

    for (let i = balls.length - 1; i >= 0; i--) {
      const ball = balls[i];

      ball.x -= BALL_SPEED;
      ball.el.style.left = ball.x + "px";

      const ballBox = {
        x: ball.x,
        y: ball.y,
        width: ball.width,
        height: ball.height
      };

      if (isColliding(playerBox, ballBox)) {
        ball.el.remove();
        balls.splice(i, 1);

        score++;
        ballCount.textContent = score;

        if (score >= WIN_SCORE) {
          endGame();
          return;
        }

        continue;
      }

      if (ball.x + ball.width < 0) {
        ball.el.remove();
        balls.splice(i, 1);
      }
    }

    requestAnimationFrame(updateGame);
  }

  renderGirl();

  for (let i = 0; i < 3; i++) {
    createBall();
  }

  updateGame();

  
 })

