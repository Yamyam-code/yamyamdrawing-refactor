const canvas = document.querySelector('canvas');
const main = document.querySelector('main');
const ctx = canvas.getContext('2d');
const lineWidth = document.getElementById('line_width');
const color = document.getElementById('text_color');
const backColor = document.getElementById('background_color');
const resetBtn = document.getElementById('reset');
const inputImage = document.getElementById('file');
const save = document.getElementById('save');
const drawing = document.getElementById('drawing');
const eraser = document.getElementById('eraser');
const brush = document.getElementById('brush');
const returnButton = document.getElementById('return_button');
const square = document.getElementById('square');
const triangle = document.getElementById('triangle');
const circle = document.getElementById('circle');
canvas.width = main.offsetWidth;
canvas.height = main.offsetHeight;
ctx.lineWidth = lineWidth.value;

ctx.lineCap = 'round';

let cPushArray = new Array();
cPushArray.splice(0, cPushArray.length);
let cStep = -1;

let isPainting = false;

const settings = {
  isDrawing: false,
  isBrushing: false,
  isSquare: false,
  isTriangle: false,
  isCircle: false,
  isErasing: false,
};

function settingsChange(setting, name) {
  for (const key in settings) {
    if (key === setting && settings[key] === false) {
      settings[key] = true;
    } else {
      settings[key] = false;
    }
  }
  const tools = document.querySelectorAll('.tool');
  tools.forEach((tool) => {
    if (tool.id === name) {
      tool.style.backgroundColor = 'gray';
    } else {
      tool.style.backgroundColor = '#171717';
    }
  });
}

onReset();

function onMouseMove(event) {
  if (isPainting && settings.isErasing) {
    ctx.save();
    ctx.strokeStyle = backColor.value;
    ctx.lineWidth = lineWidth.value * 3;
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    ctx.restore();
  } else if (isPainting && settings.isDrawing) {
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
  } else if (isPainting && settings.isBrushing) {
    ctx.save();
    function distanceBetween(point1, point2) {
      return Math.sqrt(
        Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
      );
    }
    function angleBetween(point1, point2) {
      return Math.atan2(point2.x - point1.x, point2.y - point1.y);
    }
    ctx.globalAlpha = '0.02';
    ctx.lineWidth = 0;
    ctx.globalCompositeOperation = 'source-over';
    var currentPoint = { x: event.offsetX, y: event.offsetY };
    var dist = distanceBetween(lastPoint, currentPoint);
    var angle = angleBetween(lastPoint, currentPoint);
    for (var i = 0; i < dist; i += 3) {
      x = event.offsetX + Math.sin(angle) * i - 25;
      y = event.offsetY + Math.cos(angle) * i - 25;
      ctx.beginPath();
      ctx.arc(x + 25, y + 25, lineWidth.value * 5, false, Math.PI * 2, false);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    lastPoint = currentPoint;
    ctx.restore();
  }
  ctx.moveTo(event.offsetX, event.offsetY);
}

function onMouseDown(event) {
  isPainting = true;
  lastPoint = { x: event.offsetX, y: event.offsetY };

  if (
    settings.isDrawing ||
    settings.isErasing ||
    settings.isBrushing ||
    settings.isSquare ||
    settings.isTriangle ||
    settings.isCircle
  ) {
    cStep++;
    cPushArray.push(canvas.toDataURL());
  }
  if (settings.isSquare) {
    const LineWidth = ctx.lineWidth * 20;
    ctx.rect(
      event.offsetX - LineWidth / 2,
      event.offsetY - LineWidth / 2,
      LineWidth,
      LineWidth
    );
    ctx.stroke();
  } else if (settings.isTriangle) {
    const LineWidth = ctx.lineWidth * 20;
    const start = ((LineWidth / 2) * Math.sqrt(3)) / 20;
    const high = (LineWidth * Math.sqrt(3)) / 2;
    ctx.moveTo(event.offsetX, event.offsetY + start + LineWidth / 4);
    ctx.lineTo(
      event.offsetX + LineWidth / 2,
      event.offsetY + start + LineWidth / 4
    );
    ctx.lineTo(event.offsetX, event.offsetY - high + LineWidth / 4);
    ctx.lineTo(
      event.offsetX - LineWidth / 2,
      event.offsetY + start + LineWidth / 4
    );
    ctx.lineTo(event.offsetX, event.offsetY + start + LineWidth / 4);
    ctx.stroke();
  } else if (settings.isCircle) {
    const LineWidth = ctx.lineWidth * 10;
    ctx.beginPath();
    ctx.arc(event.offsetX, event.offsetY, LineWidth, 0, 2 * Math.PI, false);
    ctx.stroke();
  }
}

function onMouseUp() {
  isPainting = false;
  ctx.beginPath();
}

function lineWidthChange(event) {
  ctx.lineWidth = event.target.value;
}

function onColorChange(event) {
  ctx.strokeStyle = event.target.value;
  ctx.fillStyle = event.target.value;
}

function onBColorChange(event) {
  ctx.save();
  ctx.fillStyle = event.target.value;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

function onReset() {
  ctx.save();
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
  backColor.value = '#ffffff';
  cPushArray.splice(0, cPushArray.length);
  cStep = -1;
}

function onDelete() {
  let tf = confirm('내용을 삭제하시겠습니까?');
  if (tf) {
    onReset();
  }
}

function onImg(event) {
  const files = event.target.files[0];
  const url = URL.createObjectURL(files);
  const img = new Image();
  img.src = url;
  img.onload = function () {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    inputImage.value = null;
  };
}

function onSave() {
  const url = canvas.toDataURL();
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Art.png';
  a.click();
}

function onReturn() {
  if (cStep >= 0) {
    const img = new Image();
    const url = cPushArray[cStep];
    img.src = url;
    img.onload = function () {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      cStep--;
      cPushArray.pop();
    };
  }
}

function onKeyboard(event) {
  switch (event.keyCode) {
    case 81:
      settingsChange('isDrawing', 'drawing');
      break;
    case 87:
      settingsChange('isBrushing', 'brush');
      break;
    case 69:
      settingsChange('isErasing', 'eraser');
      break;
    case 65:
      settingsChange('isSquare', 'square');
      break;
    case 83:
      settingsChange('isTriangle', 'triangle');
      break;
    case 68:
      settingsChange('isCircle', 'circle');
      break;
    case 17 && 90:
      onReturn();
      break;
    case 46:
      onDelete();
      break;
  }
}

canvas.addEventListener('mousemove', onMouseMove);
canvas.addEventListener('mousedown', onMouseDown);
addEventListener('mouseup', onMouseUp);
canvas.addEventListener('touchmove', (event) => {
  event.preventDefault();
  onMouseMove(event);
});
canvas.addEventListener('touchstart', (event) => {
  event.preventDefault();
  onMouseDown(event);
});
addEventListener('touchend', (event) => {
  event.preventDefault();
  onMouseUp();
});
lineWidth.addEventListener('change', lineWidthChange);
color.addEventListener('change', onColorChange);
backColor.addEventListener('change', onBColorChange);
resetBtn.addEventListener('click', onDelete);
inputImage.addEventListener('change', onImg);
save.addEventListener('click', onSave);
drawing.addEventListener('click', () => {
  settingsChange('isDrawing', 'drawing');
});
brush.addEventListener('click', () => {
  settingsChange('isBrushing', 'brush');
});
eraser.addEventListener('click', () => {
  settingsChange('isErasing', 'eraser');
});
square.addEventListener('click', () => {
  settingsChange('isSquare', 'square');
});
triangle.addEventListener('click', () => {
  settingsChange('isTriangle', 'triangle');
});
circle.addEventListener('click', () => {
  settingsChange('isCircle', 'circle');
});
returnButton.addEventListener('click', onReturn);
addEventListener('keydown', onKeyboard);
