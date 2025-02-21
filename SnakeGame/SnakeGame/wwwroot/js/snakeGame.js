const snakeSprite = new Image();
snakeSprite.src = '/images/snake-graphics.png'; 
snakeSprite.onload = () => {
  console.log("Sprite sheet loaded!");
};

const spriteMap = {
    // Κεφαλή
    headUp:    { x: 192, y: 0,   w: 64, h: 64 },
    headRight: { x: 256, y: 0,   w: 64, h: 64 },
    headDown:  { x: 256, y: 64,  w: 64, h: 64 },
    headLeft:  { x: 192, y: 64,  w: 64, h: 64 },
  
    // Σώμα (ευθεία)
    bodyHorizontal: { x: 64,  y: 0,   w: 64, h: 64 },
    bodyVertical:   { x: 128, y: 64,  w: 64, h: 64 },
  
    // Γωνίες σώματος
    bodyCornerLD: { x: 128, y: 0,   w: 64, h: 64 },  
    bodyCornerTL: { x: 128, y: 128, w: 64, h: 64 }, 
    bodyCornerRU: { x: 0,   y: 64,  w: 64, h: 64 },  
    bodyCornerDR: { x: 0,   y: 0,   w: 64, h: 64 },  
  
    // Ουρά
    tailUp:    { x: 192, y: 128, w: 64, h: 64 },
    tailRight: { x: 256, y: 128, w: 64, h: 64 },
    tailDown:  { x: 256, y: 192, w: 64, h: 64 },
    tailLeft:  { x: 192, y: 192, w: 64, h: 64 },
  
    // Μήλο
    apple:     { x: 0,   y: 192, w: 64, h: 64 }
  };
  
export function initialize(canvasId, dotNetHelper) {
  const canvas = document.getElementById(canvasId);
  canvas.focus();
  canvas.addEventListener('keydown', (event) => {
    let newDirection;
    switch (event.key) {
      case "ArrowRight":
        newDirection = 0;
        break;
      case "ArrowDown":
        newDirection = 1;
        break;
      case "ArrowLeft":
        newDirection = 2;
        break;
      case "ArrowUp":
        newDirection = 3;
        break;
      default:
        return;
    }
    dotNetHelper.invokeMethodAsync('ChangeDirection', newDirection);
  });
}

export function clearCanvas(canvasId) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

export function drawSegment(canvasId, segmentType, orientation, dx, dy, cellSize) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");

  let spriteKey;
  if (segmentType === 'apple') {
    spriteKey = 'apple';
  } else {
    spriteKey = segmentType + orientation; 
  }

  const sprite = spriteMap[spriteKey];
  if (!sprite) {
    ctx.fillStyle = 'green';
    ctx.fillRect(dx, dy, cellSize, cellSize);
    return;
  }

  if (!snakeSprite.complete) {
    ctx.fillStyle = 'green';
    ctx.fillRect(dx, dy, cellSize, cellSize);
    return;
  }

  ctx.drawImage(
    snakeSprite,
    sprite.x, sprite.y, sprite.w, sprite.h,
    dx, dy,
    cellSize, cellSize
  );
}

export function drawSnake(canvasId, snake, level, defaultDirection) {
  for (let i = 0; i < snake.segments.length; i++) {
    const segment = snake.segments[i];
    const segx = segment.x;
    const segy = segment.y;
    const tilex = segx * level.tilewidth;
    const tiley = segy * level.tileheight;
    
    let segmentType = '';
    let orientation = '';
    
    if (i === 0) {
      segmentType = 'head';
      if (snake.segments.length === 1) {
        switch(defaultDirection) {
          case 0: orientation = 'Right'; break;
          case 1: orientation = 'Down'; break;
          case 2: orientation = 'Left'; break;
          case 3: orientation = 'Up'; break;
          default: orientation = 'Right'; break;
        }
      } else {
        const nextSegment = snake.segments[i + 1];
        if (segy < nextSegment.y) {
          orientation = 'Up';
        } else if (segx > nextSegment.x) {
          orientation = 'Right';
        } else if (segy > nextSegment.y) {
          orientation = 'Down';
        } else if (segx < nextSegment.x) {
          orientation = 'Left';
        }
      }
    } else if (i === snake.segments.length - 1) {
      segmentType = 'tail';
      const prevSegment = snake.segments[i - 1];
      if (prevSegment.y < segy) {
        orientation = 'Up';
      } else if (prevSegment.x > segx) {
        orientation = 'Right';
      } else if (prevSegment.y > segy) {
        orientation = 'Down';
      } else if (prevSegment.x < segx) {
        orientation = 'Left';
      }
    } else {
      segmentType = 'body';
      const prevSegment = snake.segments[i - 1];
      const nextSegment = snake.segments[i + 1];
      
      if (prevSegment.x === nextSegment.x) {
        orientation = 'Vertical';
      } else if (prevSegment.y === nextSegment.y) {
        orientation = 'Horizontal';
      } else {
        if ((prevSegment.x < segx && nextSegment.y > segy) ||
            (nextSegment.x < segx && prevSegment.y > segy)) {
          orientation = 'CornerLD';
        } else if ((prevSegment.y < segy && nextSegment.x < segx) ||
                   (nextSegment.y < segy && prevSegment.x < segx)) {
          orientation = 'CornerTL';
        } else if ((prevSegment.x > segx && nextSegment.y < segy) ||
                   (nextSegment.x > segx && prevSegment.y < segy)) {
          orientation = 'CornerRU';
        } else if ((prevSegment.y > segy && nextSegment.x > segx) ||
                   (nextSegment.y > segy && prevSegment.x > segx)) {
          orientation = 'CornerDR';
        }
      }
    }
    
    drawSegment(canvasId, segmentType, orientation, tilex, tiley, level.tilewidth);
  }
}

export function focusCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    canvas.focus();
  }
  
export function alert(message) {
  window.alert(message);
}
