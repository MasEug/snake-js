class Snake {
  constructor() {
    this.body = [{x:10, y:12}];
    this.direction ="right"
  }

  move() {
    const head = this.body[0];

    let newX = head.x;
    let newY = head.y;

    switch(this.direction) {
      case 'up': newY--;break;
      case 'down': newY++;break;
      case 'left': newX--;break;
      case 'right': newX++;break;
    }

    this.body.unshift({x: newX, y: newY})
  }

  changeDirection(newDirection) {
    const oppositeDirections = {up: 'down', down: 'up', left: 'right', right: 'left'};

    if (newDirection !== oppositeDirections[this.direction]) {
      this.direction = newDirection
    }
  }

  checkCollision(boardSize) {
    const head = this.body[0];

    if (head.x < 0 || head.y < 0 || head.x >= boardSize || head.y >= boardSize) {
      return true;
    }

    for (let i=1; i<this.body.length; i++) {
      if (head.x === this.body[i].x && head.y === this.body[i].y) {
        return true;
      }
    }

    return false;
  }

  eat(food) {
    const head = this.body[0];

    if (head.x === food.x && head.y === food.y) {
      return true
    }

    return false
  }
}

class Food {
  constructor(boardSize) {
    this.boardSize = boardSize;
    this.respawn();
  }

  respawn() {
    do {
      this.x = Math.floor(Math.random() * this.boardSize);
      this.y = Math.floor(Math.random() * this.boardSize);
    } while (snake.body.some(res => res.x === this.x && res.y === this.y))
  }
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = canvas.width = 500;
const CANVAS_HEIGHT = canvas.height = 500;
const BOARD_SIZE = 20;
const CEIL_SIZE = CANVAS_WIDTH / BOARD_SIZE;

let snake = new Snake();
let food = new Food(BOARD_SIZE);

let direction = {x: 0, y: -1};
let lastTime = 0;
let SNAKE_SPEED = 2;
let gameIsRunning = true;

function main(currentTime) {
  if (!gameIsRunning) return;

  const delta = (currentTime - lastTime) / 1000;

  if (delta >= 1 / SNAKE_SPEED) {
    lastTime = currentTime;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    snake.move();

    if (snake.checkCollision(BOARD_SIZE)) {
      alert("GAME OVER (((")
      restartGame();
      return;
    }

    if (snake.eat(food)) {
      food.respawn()
    } else {
      snake.body.pop()
    }

    // Draw food
    ctx.fillStyle = "grey";
    ctx.fillRect(food.x * CEIL_SIZE, food.y * CEIL_SIZE, CEIL_SIZE, CEIL_SIZE);

    // Draw snake
    ctx.fillStyle = "purple";
    snake.body.forEach((segment) => {
      ctx.fillRect(segment.x * CEIL_SIZE, segment.y * CEIL_SIZE, CEIL_SIZE, CEIL_SIZE);
    });
  }

  requestAnimationFrame(main);
}

function restartGame() {
  snake = new Snake();
  food = new Food(BOARD_SIZE);

  gameIsRunning = true;
  lastTime = 0;

  requestAnimationFrame(main)
}

window.addEventListener('keydown', e => {
  switch(e.key) {
    case 'ArrowDown': snake.changeDirection('down');break;
    case 'ArrowUp': snake.changeDirection('up');break;
    case 'ArrowLeft': snake.changeDirection('left');break;
    case 'ArrowRight': snake.changeDirection('right');break;
    default: snake.direction('right');
  }
})

restartGame();
