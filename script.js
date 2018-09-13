var myCanvas = document.getElementById("canvas");
var context = myCanvas.getContext("2d");
var tileSheet = new Image();
var behindBlocks = [];
var hiddenBlocks = [];
bombs = 12;

//making the flooded array
var hasFlooded = new Array(10);
for(let i=0;i<10;i++){
  hasFlooded[i] = new Array(10);
  for(let j=0;j<10;j++){
    hasFlooded[i][j] = false;
  }
}

function getMousePos(canvas, evt){
  var rect = canvas.getBoundingClientRect();
  return{
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function isOnGrid(x, y){
  if(x<0||x>9){
    return false;
  }
  if(y<0||y>9){
    return false;
  }
  return true;
}

function floodFill(x,y){
  if(!isOnGrid(x, y)){
    return;
  }
  if(behindBlocks[y][x] != 10 && hasFlooded[y][x] == false){
    hasFlooded[y][x] = true;
    switch(behindBlocks[y][x]){
      case 1:
        context.drawImage(tileSheet,16,0,sw,sh,x*30,y*30,30,30);
        break;
      case 2:
        context.drawImage(tileSheet,32,0,sw,sh,x*30,y*30,30,30);
        break;
      case 3:
        context.drawImage(tileSheet,48,0,sw,sh,x*30,y*30,30,30);
        break;
      case 4:
        context.drawImage(tileSheet,64,0,sw,sh,x*30,y*30,30,30);
        break;
      case 5:
        context.drawImage(tileSheet,80,0,sw,sh,x*30,y*30,30,30);
        break;
      case 0:
        context.drawImage(tileSheet,0,0,sw,sh,x*30,y*30,30,30);
        floodFill(x-1,y-1); //top-left
        floodFill(x,y-1); //top
        floodFill(x+1,y-1); //top-right
        floodFill(x-1,y); //left
        floodFill(x-1,y+1); //down-left
        floodFill(x,y+1); //down
        floodFill(x+1,y+1); //down-right
        floodFill(x+1,y); //right
        break;
      }

  }
  else{
    return;
  }
}

function drawRevealedSquare(x,y,number){
  switch(number){
    case 10:
      context.drawImage(tileSheet,0,16,sw,sh,x*30,y*30,30,30);
      break;
    case 1:
      context.drawImage(tileSheet,16,0,sw,sh,x*30,y*30,30,30);
      break;
    case 2:
      context.drawImage(tileSheet,32,0,sw,sh,x*30,y*30,30,30);
      break;
    case 3:
      context.drawImage(tileSheet,48,0,sw,sh,x*30,y*30,30,30);
      break;
    case 4:
      context.drawImage(tileSheet,64,0,sw,sh,x*30,y*30,30,30);
      break;
    case 5:
      context.drawImage(tileSheet,80,0,sw,sh,x*30,y*30,30,30);
      break;
    case 6:
      context.drawImage(tileSheet,96,0,sw,sh,x*30,y*30,30,30);
      break;
    case 7:
      context.drawImage(tileSheet,112,0,sw,sh,x*30,y*30,30,30);
      break;
    case 8:
      context.drawImage(tileSheet,128,0,sw,sh,x*30,y*30,30,30);
      break;
    case 0:
      floodFill(x,y);
      break;
  }
}

function revealCurrentSquare(x,y){
  var behindClickedSquare = behindBlocks[y][x];
  drawRevealedSquare(x,y,behindClickedSquare);
}

class EmptySquare{
  constructor(newX,newY){
    this.x = newX;
    this.y = newY;
    context.drawImage(tileSheet,80,16,sw,sh,this.x,this.y,30,30);

    addEventListener('mousedown',(evt)=>{
      var mouseX = getMousePos(canvas,evt).x;
      var mouseY = getMousePos(canvas,evt).y;
      if((mouseX > this.x && mouseX < this.x+30) &&
        (mouseY > this.y && mouseY < this.y+30))
        {
          //check if the current square has a bomb behind interval
          revealCurrentSquare(this.x/30,this.y/30);
        }
     });
  }
}

tileSheet.src = "Assets/spritesheet.png";
tileSheet.addEventListener('load',()=>{
  sw = tileSheet.width/9;
  sh = tileSheet.height/6;
  w = sw;
  h = sh;
  x = 0;
  y = 0;
  setup();
})

function setup(){
  //making empty grid
  behindBlocks = new Array(10);
  hiddenBlocks = new Array(10);
  for(let i=0;i<behindBlocks.length;i++){
    behindBlocks[i] = new Array(10);
    hiddenBlocks[i] = new Array(10);
  }

  for(var newY = 0; newY <300; newY = newY+30){
    for(var newX = 0; newX <300; newX = newX+30){
      behindBlocks[newY/30][newX/30] = 0;
      hiddenBlocks[newY/30][newX/30] = new EmptySquare(newX,newY);
    }
  }
  //place bombs and numbers
  for(var j=0; j<bombs; j++){
    randomX = Math.floor(Math.random()*10);
    randomY = Math.floor(Math.random()*10);
    if(behindBlocks[randomY][randomX]==10){
      randomX--;
      if(randomX<0){
        randomX+=2;
      }
    }
    behindBlocks[randomY][randomX] = 10;

    if(randomX == 0 && randomY == 0){
      behindBlocks[randomY][randomX+1] += 1 // right
      behindBlocks[randomY+1][randomX] += 1 // down
      behindBlocks[randomY+1][randomX+1] += 1 //down-right
    }
    else if(randomX == 0 && randomY == 9){
      behindBlocks[randomY-1][randomX] += 1 // top
      behindBlocks[randomY-1][randomX+1] += 1 //top-right
      behindBlocks[randomY][randomX+1] += 1 // right
    }
    else if(randomX == 0){
      behindBlocks[randomY-1][randomX] += 1 // top
      behindBlocks[randomY-1][randomX+1] += 1 //top-right
      behindBlocks[randomY][randomX+1] += 1 // right
      behindBlocks[randomY+1][randomX] += 1 // down
      behindBlocks[randomY+1][randomX+1] += 1 //down-right
    }
    else if(randomX == 9 && randomY == 0){
      behindBlocks[randomY][randomX-1] += 1 // left
      behindBlocks[randomY+1][randomX-1] += 1 // down-left
      behindBlocks[randomY+1][randomX] += 1 // down
    }
    else if(randomX == 9 && randomY == 9){
      behindBlocks[randomY][randomX-1] += 1 // left
      behindBlocks[randomY-1][randomX-1] += 1 // top-left
      behindBlocks[randomY-1][randomX] += 1 // top
    }
    else if(randomX == 9){
      behindBlocks[randomY][randomX-1] += 1 // left
      behindBlocks[randomY-1][randomX-1] += 1 // top-left
      behindBlocks[randomY-1][randomX] += 1 // top
      behindBlocks[randomY+1][randomX-1] += 1 // down-left
      behindBlocks[randomY+1][randomX] += 1 // down
    }
    else if(randomY == 0){
      behindBlocks[randomY][randomX-1] += 1 // left
      behindBlocks[randomY][randomX+1] += 1 // right
      behindBlocks[randomY+1][randomX-1] += 1 // down-left
      behindBlocks[randomY+1][randomX] += 1 // down
      behindBlocks[randomY+1][randomX+1] += 1 //down-right
    }
    else if(randomY == 9){
      behindBlocks[randomY-1][randomX-1] += 1 // top-left
      behindBlocks[randomY-1][randomX] += 1 // top
      behindBlocks[randomY-1][randomX+1] += 1 //top-right
      behindBlocks[randomY][randomX-1] += 1 // left
      behindBlocks[randomY][randomX+1] += 1 // right
    }
    else{
      behindBlocks[randomY-1][randomX-1] += 1 // top-left
      behindBlocks[randomY-1][randomX] += 1 // top
      behindBlocks[randomY-1][randomX+1] += 1 //top-right
      behindBlocks[randomY][randomX-1] += 1 // left
      behindBlocks[randomY][randomX+1] += 1 // right
      behindBlocks[randomY+1][randomX-1] += 1 // down-left
      behindBlocks[randomY+1][randomX] += 1 // down
      behindBlocks[randomY+1][randomX+1] += 1 //down-right
    }
  }

  //cleaning up
  for(var k=0;k<10;k++){
    for(let l=0;l<10;l++){
      if(behindBlocks[k][l]>10){
        behindBlocks[k][l] = 10;
      }
    }
  }
}
