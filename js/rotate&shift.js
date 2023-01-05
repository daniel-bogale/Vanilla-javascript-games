import { copyBrick, occupiedPlaces } from "./game.js";

export const MainBoxWidth = 10;
export const MainBoxHeight = 20;
export const NextBoxHeight = 6;
export let rotate = 0;

export function rotated(num=0) {
  if(num === -1) rotate--;
  rotate = 0;
}

export function rotateBrick(bri) {
  let width;
  rotate++;

  width = NextBoxHeight;

  if (rotate === 4) rotate = 0;
  let prevX;

  switch (rotate) {
    case 0:
      bri.forEach((element, index) => {
        element.x = copyBrick[index].x;
        element.y = copyBrick[index].y;
      });

      break;

    case 1:
      bri.forEach((element) => {
        prevX = element.x;
        element.x = width - element.y + 1;
        element.y = prevX;
      });
      // console.log(bri);
      break;
    case 2:
      bri.forEach((element) => {
        prevX = element.x;
        element.x = width - element.y + 1;
        element.y = prevX;
      });

      break;
    case 3:
      bri.forEach((element) => {
        prevX = element.x;
        element.x = width - element.y + 1;
        element.y = prevX;
      });

      break;
  }

  return bri;
}

export function shiftBrick(bri, pos) {
  let copyBri = JSON.parse(JSON.stringify(bri));
  copyBri.forEach((element) => {
    element.x += pos[0];
  });

  copyBri.forEach((element) => {
    element.y += pos[1];
  });
  // console.log("copy",copyBri);

  return copyBri;
}

export function checkBorderPass(bri, border = "side") {
  let rightMostBrick = bri.reduce((total, element) => {
    if (element.x > total) return element.x;
    return total;
  }, -Infinity);

  let leftMostBrick = bri.reduce((total, element) => {
    if (element.x < total) return element.x;
    return total;
  }, Infinity);

  // console.log( alreadyOcupied(bri));
  // console.log(alreadyOcupied(bri, "right"));

  // alreadyOcupied(bri);

  let lowerMostBrick = bri.reduce((total, element) => {
    if (element.y > total) return element.y;
    return total;
  }, -Infinity);

  if (border === "side") {
   
      if (rightMostBrick > MainBoxWidth ) return rightMostBrick - MainBoxWidth;
      //here i said leftMostBrick+1 because the grid starts from 1;
      if (leftMostBrick < 1 ) return -(leftMostBrick + 1);
    
  } 
  else if (border === "bottom") {
    if (lowerMostBrick > MainBoxHeight) return lowerMostBrick - MainBoxHeight;
  }

  return 0;
}

export function alreadyOcupied(bri) {
  let briCopy = JSON.parse(JSON.stringify(bri));
  let ocupied = false;
  for (let i = 0; i < briCopy.length; i++) {
    let occupiedElem;
    if (occupiedPlaces.length) {
      occupiedElem = occupiedPlaces.find((element) => {
        // console.log(element.x,"=", briCopy[i].x ,element.x === briCopy[i].x , "   " , element.y , " = " , briCopy[i].y);
        return element.x === briCopy[i].x && element.y === briCopy[i].y;
      });
    }
    if (occupiedElem) {
      ocupied = true;
      break;
    }
  }

  return ocupied;
}
