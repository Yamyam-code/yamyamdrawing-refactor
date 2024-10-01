function angleBetween(point1, point2) {
  return Math.atan2(point2.x - point1.x, point2.y - point1.y);
}

function distanceBetween(point1, point2) {
  return Math.sqrt(
    Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
  );
}

function touchXY(event) {
  const offset = event.target.getBoundingClientRect();
  const XY = {
    offsetX: event.touches[0].clientX - offset.x,
    offsetY: event.touches[0].clientY - offset.y,
  };
  return XY;
}

function settingsChange(settings, setting, name) {
  for (const key in settings) {
    if (key === setting && settings[key] === false) {
      settings[key] = true;
    } else {
      settings[key] = false;
    }
  }
  const tools = document.querySelectorAll('.tool');
  tools.forEach((tool) => {
    if (tool.id === name && tool.style.backgroundColor !== 'gray') {
      tool.style.backgroundColor = 'gray';
    } else {
      tool.style.backgroundColor = '#171717';
    }
  });
}

function lineWidthChange(event, ctx) {
  ctx.lineWidth = event.target.value;
}

function onColorChange(event, ctx) {
  ctx.strokeStyle = event.target.value;
  ctx.fillStyle = event.target.value;
}

function onBColorChange(event, ctx) {
  ctx.save();
  ctx.fillStyle = event.target.value;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

export {
  angleBetween,
  distanceBetween,
  touchXY,
  settingsChange,
  lineWidthChange,
  onColorChange,
  onBColorChange,
};
