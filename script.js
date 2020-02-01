var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

// ctx.beginPath();
// ctx.rect(20,40,50,50);
// ctx.fillStyle = "#FF0000";
// ctx.fill();
// ctx.closePath();
//
// ctx.beginPath();
// ctx.arc(240,60,20,0,Math.PI*2,false);
// ctx.fillStyle ="green";
// ctx.fill();
// ctx.closePath();
//
// ctx.beginPath();
// ctx.rect(160,10,100,40);
// ctx.strokeStyle = 'rgba(0,0,255,0.5)';
// ctx.stroke();
// ctx.closePath();

var x = (canvas.width/2) + Math.floor(Math.random()*21)-10;
var y = (canvas.height-30) + Math.floor(Math.random()*21)-10;
var dx = 2;
var dy = -2;
var ballRadius =10;
var paddleHeight = 10;
var paddleWidth = 70;
var paddleX = (canvas.width-paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 3;
var brickColumnCount= 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var score = 0;
var lives = 3;
var level = 1;
var maxLevel = 5;
var paused = false;
var ball = new Image();
ball.src = '';

var bricks = [];
initBricks();
function initBricks(){
for (c=0;c<brickColumnCount;c++){
  bricks[c] = [];
  for(r=0;r<brickRowCount;r++){
    bricks[c][r] = {x:0,y:0,status:1};
  }
 }
}

//For key down handling
document.addEventListener("keydown",keyDownHandler);
//For key up handling
document.addEventListener("keyup",keyUpHandler);

//we can use anything for argument usually it is used as 'e' (It is event passed by by listners)
function keyDownHandler(e){
  if(e.keyCode == 39){
    rightPressed = true;
  }
  else if (e.keyCode == 37){
    leftPressed = true;
  }
}

function keyUpHandler(e){
  if(e.keyCode == 39){
    rightPressed = false;
  }
  else if (e.keyCode == 37){
    leftPressed = false;
  }
}

function drawScore(){
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score,8,20);
}

function drawLives(){
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: " + lives,canvas.width-65,20);
}

function drawLevel(){
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Level: " + level,210,20);
}

function drawGamePaused(){
  ctx.beginPath();
  ctx.rect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.font = "16px Arial";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("Level " + (level - 1) + " Completed, Starting new level...",110,150);
  ctx.closePath();
}

function collisionDetection(){
  for(c=0;c<brickColumnCount;c++)
  {
    for(r=0;r<brickRowCount;r++){
      var b = bricks[c][r];
      //calculations
      if(b.status == 1){
        if(x > b.x && x < b.x + brickWidth && y > b.y &&  y < b.y + brickHeight ){
          dy = -dy;
          b.status = 0;
          score++;
          if(score == brickRowCount* brickColumnCount)          //brickRowCount* brickColumnCount
          {
            if(level == maxLevel){
            alert("YOU WIN THE GAME !!");
            document.location.reload();
          } else {
            level++;
            brickRowCount++;
            initBricks();
            score = 0;
            resetPositions();
            speedUp(1);
            paused = true;
            drawGamePaused();
            setTimeout(function(){paused = false;draw();},3000);
          }

          }
        }
      }
    }
  }

}

function drawBricks(){
  for(c=0;c<brickColumnCount;c++){
    for(r=0;r<brickRowCount;r++){
      if(bricks[c][r].status == 1) {
        var brickX = (c*(brickWidth+brickPadding))+ brickOffsetLeft;
        var brickY = (r*(brickHeight+brickPadding))+ brickOffsetTop;
        bricks[c][r].x=brickX;
        bricks[c][r].y=brickY;
        ctx.beginPath();
        ctx.rect(brickX,brickY,brickWidth,brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawBall(){
  //drawing ball
  ctx.beginPath();
  ctx.arc(x,y,ballRadius,0,Math.PI*2,false);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();

  //ctx.drawImage(ball,x,y,ballRadius,0,Math.PI*2,false);
}

function drawPaddle(){
  ctx.beginPath();
  ctx.rect(paddleX,canvas.height-paddleHeight,paddleWidth,paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function resetPositions(){
  x = (canvas.width/2) + Math.floor(Math.random()*21)-10;
  y = (canvas.height-30) +  Math.floor(Math.random()*21)-10;
  paddleX = (canvas.width - paddleWidth)/2;
}

function speedUp(speed){
  dx += speed;
  dy = -dy;
  dy -= speed;
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  drawLevel();
  collisionDetection();

  if(y + dy < ballRadius){
    dy = -dy;
  }
  else if (y + dy > canvas.height-ballRadius) {
    if(x > paddleX && x < paddleX + paddleWidth){
      dy = -dy;
    }
    else {
      lives--;
      if(!lives){
        alert("GAME OVER !! ");
        document.location.reload();
        //location = contains url and reload method reloads the page
      }
      else{
        resetPositions();
      }
    }
  }

  if(x + dx > canvas.width -ballRadius|| x + dx < ballRadius){
    dx = -dx;
  }

  if(rightPressed && paddleX < canvas.width-paddleWidth){
    paddleX += 7;
  }
  else if (leftPressed && paddleX > 0) {
    paddleX -=7;
  }
  x+=dx;
  y+=dy;
  if(!paused){
    requestAnimationFrame(draw);
  }
}

document.addEventListener("mousemove",mouseMoveHandler);
function mouseMoveHandler(e){
  var relativeX = e.clientX - canvas.offsetLeft;     // e.clientX is the mouse position and canvas.offsetLeft is left edge of the view port
  if(relativeX > paddleWidth/2 && relativeX < canvas.width - paddleWidth/2){
    paddleX = relativeX - paddleWidth/2;
  }
}
draw();
