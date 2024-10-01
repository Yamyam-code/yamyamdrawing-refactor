function onReturn(cPushArray, cStep, ctx, canvas) {
  if (cStep.current >= 0 && cPushArray.length > 0) {
    const img = new Image();
    const url = cPushArray[cStep.current];
    img.src = url;
    img.onload = function () {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      cPushArray.pop();
    };
    cStep.current--;
  } else {
    console.error('No more images in the array or invalid step');
  }
}

function onReset(ctx, canvas, cPushArray, backColor, cStep) {
  ctx.save();
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
  backColor.value = '#ffffff';
  cPushArray.splice(0, cPushArray.length);
  cStep.current = -1;
}

function onDelete(ctx, canvas, cPushArray, backColor, cStep) {
  let tf = confirm('내용을 삭제하시겠습니까?');
  if (tf) {
    onReset(ctx, canvas, cPushArray, backColor, cStep);
  }
}

function onImg(event, ctx, inputImage, canvas) {
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

export { onReturn, onReset, onDelete, onImg, onSave };
