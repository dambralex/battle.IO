var canvas, ctx, sprites,
    width,
    height,
    nb_img,
    nb_act,
    
    dx = 150,
    dy = 150,
    sw, sh, sx, sy, tickCount, flagRES,

    rightKey = false,
    leftKey = false,
    upKey = false,
    downKey = false,
    mouseX = dx, mouseY = dy, click = false ;

var chemin = 'anim/test/';

    /*pour la lecture des images : 
      U   = 0
      UL  = 1
      UR  = 2
      L   = 3
      R   = 4
      DL  = 5
      DR  = 6
      D   = 7
    */
function clearCanvas() {
  ctx.clearRect(0,0,1000,800);
}
function drawSprites() {

  if (dx < mouseX){
    if(dy < mouseY){
      sy = 6 * sh;
      if (click == true){
        dx += 1;
        dy += 1;
      }
    }
    else if (dy == mouseY){
      sy = 4 * sh;
      if (click == true){
        dx += 1;
      }
    }
    else if(dy > mouseY){
      sy = 2 * sh;
      if (click == true){
        dx += 1;
        dy -= 1;
      }
    }
  }
  else if(dx > mouseX){
    if(dy < mouseY){
      sy = 5 * sh;
      if (click == true){
        dx -= 1;
        dy += 1;
      }
    }
    else if (dy == mouseY){
      sy = 3 * sh;
      if (click == true){
        dx += -1;
      }
    }
    else if(dy > mouseY){
      sy = 1 * sh;
      if (click == true){
        dx -= 1;
        dy -= 1;
      }
    }
  }
  else if (dx == mouseX){
    if(dy < mouseY){
      sy = 7 * sh;
      if (click == true){
        dy += 1;
      }
    } 
    else if(dy > mouseY){
      sy = 0 * sh;
      if (click == true){
        dy -= 1;
      }
    }
  }

  //console.log("sx :  "+ sx + " | sy : "+ sy);
  ctx.drawImage(sprites,sx,sy,sw,sh,dx,dy,sw,sh);
  ctx.strokeRect(dx,dy,sw,sh);
  if (click == false ) {
    sx = 0;
    flagRES = 1;
  }
  if (click == true ) {
    
    flagRES = 0;
  }
}
function loop() {
  tickCount +=1;
  clearCanvas();
  
  if (tickCount%30 == 0) {
    update();
  }
  drawSprites();
  if (tickCount >59) tickCount = 0;

  // console.log (click);

  console.log(width + " | " + height + " | " + nb_img + " | " + nb_act + " | " + dx + " | " + dy + " | " + sw + " | " + sh + " | " + sx + " | " + sy + " | " + tickCount);
}

//codabibi
function update(){

    if (sx < 406 && flagRES == 0){
      sx += 58;
    }

    else{
      sx = 0;
    }
}

function mouseDown(e) {
  click = true;
  console.log (mouseX + " | " + mouseY);
}
function mouseUp(e) {
  click = false;
}
function mouseMove(e) {
  mouseX = e.offsetX;
  mouseY = e.offsetY;
}

(function init() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  sprites = new Image();
  load(animation, 0);
  setInterval(loop, 1000/60);
  document.addEventListener('mousedown', mouseDown, false);
  document.addEventListener('mouseup', mouseUp, false);
  document.addEventListener('mousemove', mouseMove, false);

})();

/*function changeSprite(nb){
  if (nb == 0){
    sprites.src = 'anim/walk/png/walk_All.png';
  }
}
*/
function load(objet, type){
sprites.src = chemin + objet[type].lien;
  width = objet[type].width;
  height = objet[type].height;
  nb_img = objet[type].nb_img;
  nb_act = objet[type].nb_act;


  sw = Math.round(width/(nb_img+1));
  sh = Math.round(height/(nb_act));
  sx = 0;
  sy = 0;
  tickCount = 0;
  flagRES = 0;
}