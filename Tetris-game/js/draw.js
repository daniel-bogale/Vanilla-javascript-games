import { MainBoxHeight, MainBoxWidth } from "./rotate&shift.js";

export function drawBrickBlock(box, anyBricks) {
  anyBricks.forEach((brick) => {
    {
      if (brick.y < 1) return;
      const brickElement = document.createElement("div");
      brickElement.style.gridRowStart = brick.y;
      brickElement.style.gridColumnStart = brick.x;
      brickElement.classList.add("brick");
      box.appendChild(brickElement);
    }
  });
}

export function drawLine(box, row, column) {
  for (let i = 1; i <= column; i++) {
    for (let j = 1; j <= row; j++) {
      const boxElement = document.createElement("div");
      boxElement.style.gridRowStart = i;
      boxElement.style.gridColumnStart = j;
      boxElement.classList.add("box");
      box.appendChild(boxElement);
    }
  }
}

export function generateRandomColor() {
  // return `rgb(${Math.floor(Math.random() * 256)},${Math.floor(
  //   Math.random() * 256
  // )},${Math.floor(Math.random() * 256)})`;
  let randomHue = Math.floor(Math.random() * 210);
  
  while((randomHue>10 && randomHue< 95)|| (randomHue>220 && randomHue< 255)|| randomHue> 290 ||  Math.round(randomHue/10) === 20){
    if( Math.round(randomHue/10) === 20){
      // console.log(randomHue);
    }
    randomHue = Math.floor(Math.random() * 360);
  }
  // console.log(randomHue);

  
  return `hsl(${randomHue}, 100%, 50%)`;
}
