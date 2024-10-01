import { onDelete, onImg, onReset, onReturn, onSave } from './js/buttonFunc.js';
import {
  angleBetween,
  distanceBetween,
  lineWidthChange,
  onBColorChange,
  onColorChange,
  settingsChange,
} from './js/utils.js';

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
let cStep = { current: -1 };

let lastPoint;
let isPainting = false;
let isKeyDown = false;

onReset(ctx, canvas, cPushArray, backColor, cStep);

const settings = {
  isDrawing: false,
  isBrushing: false,
  isSquare: false,
  isTriangle: false,
  isCircle: false,
  isErasing: false,
};

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
    ctx.globalAlpha = '0.02';
    ctx.lineWidth = 0;
    ctx.globalCompositeOperation = 'source-over';
    let currentPoint = { x: event.offsetX, y: event.offsetY };
    let dist = distanceBetween(lastPoint, currentPoint);
    let angle = angleBetween(lastPoint, currentPoint);
    for (let i = 0; i < dist; i += 3) {
      const x = event.offsetX + Math.sin(angle) * i - 25;
      const y = event.offsetY + Math.cos(angle) * i - 25;
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
    cStep.current++;
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

function onKeyboard(event) {
  console.log(event.keyCode);
  switch (event.keyCode) {
    case 81:
      settingsChange(settings, 'isDrawing', 'drawing');
      break;
    case 87:
      settingsChange(settings, 'isBrushing', 'brush');
      break;
    case 69:
      settingsChange(settings, 'isErasing', 'eraser');
      break;
    case 65:
      settingsChange(settings, 'isSquare', 'square');
      break;
    case 83:
      settingsChange(settings, 'isTriangle', 'triangle');
      break;
    case 68:
      settingsChange(settings, 'isCircle', 'circle');
      break;
    case 17 && 90:
      onReturn(cPushArray, cStep, ctx, canvas);
      break;
    case 46:
      onDelete(ctx, canvas, cPushArray, backColor, cStep);
      break;
  }
}

canvas.addEventListener('mousemove', onMouseMove);
canvas.addEventListener('mousedown', onMouseDown);
addEventListener('mouseup', onMouseUp);
canvas.addEventListener('touchmove', (event) => {
  event.preventDefault();
  onMouseMove(touchXY(event));
});
canvas.addEventListener('touchstart', (event) => {
  onMouseDown(touchXY(event));
});
addEventListener('touchend', onMouseUp);

lineWidth.addEventListener('change', (event) => {
  lineWidthChange(event, ctx);
});
color.addEventListener('change', (event) => {
  onColorChange(event, ctx);
});
backColor.addEventListener('change', (event) => {
  onBColorChange(event, ctx);
});

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
returnButton.addEventListener('click', () => {
  onReturn(cPushArray, cStep, ctx, canvas);
});
resetBtn.addEventListener('click', () => {
  onDelete(ctx, canvas, cPushArray, backColor, cStep);
});

inputImage.addEventListener('change', (event) => {
  onImg(event, ctx, inputImage, canvas);
});
save.addEventListener('click', onSave);

addEventListener('keydown', (event) => {
  if (!isKeyDown) {
    isKeyDown = true;
    onKeyboard(event);
  }
});
addEventListener('keyup', () => {
  isKeyDown = false;
});
