const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = canvas.width = 500;
const CANVAS_hEIGHT = canvas.height = 500;
const CEIL_SIZE = 20;

let food = {};
let snake = [{x:24, y:24}];
let direction = {x: 0, y: -1};
let lastTime = 0;
let level = 2;

function init() {
  drawFood();
  drawSnake();
  game();
}

function getRandom() {
  return Math.floor(Math.random() * 25)
}

function getNewCoords() {
  return {x: getRandom(), y: getRandom()}
}

function getCollisionFood(food) {
    return snake.filter(res => res.x === food.x && res.y === food.y).length > 0
}

function drawFood() {
  food = getNewCoords();
  
  while(getCollisionFood(food)) {
    food = getNewCoords();
  }
  
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * CEIL_SIZE, food.y * CEIL_SIZE, CEIL_SIZE, CEIL_SIZE);
}

function drawSnake() {
  snake.forEach((el, i) => {
    ctx.fillStyle = 'white';
    ctx.fillRect(el.x * CEIL_SIZE, el.y * CEIL_SIZE, CEIL_SIZE, CEIL_SIZE);
  })
}

function game(ctime) {
  requestAnimationFrame(game);
  
  if ((ctime - lastTime)/1000 < 1 / level) {
    return;
  }
  
  lastTime = ctime;
  
  moveSnake();
}

function getCollisionSnake() {
  let first = snake[0];

  return snake.filter((res, i) => {
    return i !== 0 && res.x === first.x && res.y === first.y
  }).length > 0
}

function moveSnake() {
  const first = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};
  const last = snake.at(-1);

  snake.unshift({x: first.x, y: first.y});
  ctx.fillRect(first.x * CEIL_SIZE, first.y * CEIL_SIZE, CEIL_SIZE, CEIL_SIZE);
  
  if (first.x === food.x && first.y === food.y) {

    const elem = food;

    drawFood();

    ctx.fillStyle = 'white';
    ctx.fillRect(elem.x * CEIL_SIZE, elem.y * CEIL_SIZE, CEIL_SIZE, CEIL_SIZE)

  } else {
    snake.pop();
    ctx.clearRect(last.x * CEIL_SIZE, last.y * CEIL_SIZE, CEIL_SIZE, CEIL_SIZE);
  }
  
  if (first.x < 0 || first.x > 24 || first.y < 0 || first.y > 24) {
    alert('Game over');
    direction = {x:0, y:0};
    snake = [{x:10, y:11}];
  }

  if (getCollisionSnake()) {
    alert('Game over');
    direction = {x:0, y:0};
    snake = [{x:10, y:11}];
  }
}

window.addEventListener('keydown', e => {
  switch(e.key) {
    case 'ArrowDown': direction = {x:0, y:1};break;
    case 'ArrowUp': direction = {x:0, y:-1};break;
    case 'ArrowLeft': direction = {x:-1, y:0};break;
    case 'ArrowRight': direction = {x:1, y:0};break;
    default: direction = {x:0, y:-1};
  }
})

init();
