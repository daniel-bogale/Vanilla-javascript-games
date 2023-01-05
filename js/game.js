"use strict";
import {
  rotateBrick,
  rotated,
  MainBoxHeight,
  MainBoxWidth,
  NextBoxHeight,
  shiftBrick,
  checkBorderPass,
  alreadyOcupied,
  rotate,
} from "./rotate&shift.js";
import { generateBrick } from "./generateB.js";
import { generateRandomColor, drawBrickBlock, drawLine } from "./draw.js";

const nextTetrisBox = document.getElementById("next-tertis-field");
const mainGameBox = document.getElementById("main-game-field");

const highScorerNameLabel = document.querySelector(".high-scorer-name");
const highScoreLabel = document.querySelector(".high-score");
const scoreLabel = document.querySelector(".score");

drawLine(nextTetrisBox, NextBoxHeight, NextBoxHeight);
drawLine(mainGameBox, MainBoxWidth, MainBoxHeight);

const FRAME_SPEED = 3;

const drawOnMain = drawBrickBlock.bind(null, mainGameBox);
const drawOnNext = drawBrickBlock.bind(null, nextTetrisBox);
let generatedBrick = generateBrick();
let nextBrick = generateBrick();
let pos = [2, -4];
let gameOver = false;
let colr = generateRandomColor();

let nextColor = generateRandomColor();

export let occupiedPlaces = [];
// copy object first --> stringify then parse it back

export let copyBrick = JSON.parse(JSON.stringify(generatedBrick));

drawOnNext(nextBrick);

drawOnMain(shiftBrick(generatedBrick, pos));

changeColor();
changeColor("next");

let lastRenderTime = 0;

let score = 0;

let currentHighScore = { name: "Dani Bogale", highScore: 0 };

if (localStorage.getItem("tetrisHighScore") !== null) {
  // console.log("here");
  currentHighScore = JSON.parse(localStorage.getItem("tetrisHighScore"));
} else {
  localStorage.setItem("tetrisHighScore", JSON.stringify(currentHighScore));
}
setHighScore();

function main(currentTime) {
  let firstRowConstElem = occupiedPlaces.find((elem) => elem.y === 1);
  if (firstRowConstElem) gameOver = true;

  if (gameOver) {
    window.removeEventListener("keydown", eventFunction);
    let previousHighScore = JSON.parse(
      localStorage.getItem("tetrisHighScore")
    ).highScore;
    if (score > previousHighScore) {
      const person = prompt("Write your name") || "somebody";
      currentHighScore = { name: person, highScore: score };
      localStorage.setItem("tetrisHighScore", JSON.stringify(currentHighScore));
      setHighScore();
    }
    setTimeout(() => {
      if (confirm("you losse. Press ok to restart.")) {
        window.location.reload(false);
      }
    }, 500);
    return;
  }
  window.requestAnimationFrame(main);
  if (currentTime - lastRenderTime < (1 / FRAME_SPEED) * 1000) return;
  lastRenderTime = currentTime;

  pos[1] += 1;
  let underBox = checkBorderPass(shiftBrick(generatedBrick, pos), "bottom");
  // console.log(underBox);
  positionBri(shiftBrick(generatedBrick, pos));

  // clear the previous bricks
  let occupied = document.querySelectorAll("#main-game-field>.brick");

  occupied.forEach((element) => {
    mainGameBox.removeChild(element);
  });
  drawOnMain(shiftBrick(generatedBrick, pos));
  changeColor();
  
  // console.log(underBox > 0 || elementAboveConstantBrick());
  if (underBox > 0 || elementAboveConstantBrick()) {
    makeBrickConstantAndChangeBrick();
  }
  
  if (rowWinCheck().length) {
    let theRow = rowWinCheck();

    let theUpperRow = theRow.reduce((total, elem) => {
      // console.log(elem , "<" , total , "...", elem<total);
      if (elem < total) return elem;
      else return total;
    }, +Infinity);

    // console.log(score);
    score += theRow.length * 10 + (theRow.length - 1) * 5;

    scoreLabel.innerHTML = score;

    clearRow(theRow,theRow.length);
    shiftAllRowsGravity(theUpperRow, theRow.length);
  }
  
}

requestAnimationFrame(main);

function clearRow(theRow,length) {
  theRow.forEach((elem) => {
    const row = document.querySelectorAll(`.row${elem}`);
    row.forEach((elem) => {
      elem.remove();
    });
    let toBeRemovedIndex = [];
    occupiedPlaces.forEach((element, index) => {
      if (element.y === elem) {
        toBeRemovedIndex.push(index);
      }
    });

    let removed = 0;
    toBeRemovedIndex.forEach((element) => {
      occupiedPlaces.splice(element - removed, 1);
      removed++;
    });
  });
  occupiedPlaces.forEach(elem=> {
    elem.y += length;
  })
}


function shiftAllRowsGravity(rowStart, length) {
  const constElem = document.querySelectorAll(".constant_brick");

  console.log(...occupiedPlaces);

  // for (let i = rowStart; i > rowStart - length; i--) {
  //   console.log(i);
  //   occupiedPlaces.forEach((element) => {
  //     if (element.y === i) {
  //       console.log(element);
  //       element.y++;
  //     }
  //   });
  // }
  

  constElem.forEach((element) => {
    if (element.style.gridRowStart > rowStart) {
      return;
    }

    setTimeout(() => {
      element.classList.remove(`row${element.style.gridRowStart}`);
      
      element.style.gridRowStart = +element.style.gridRowStart + length;
      element.classList.add(`row${element.style.gridRowStart}`)
    }, 100);
  });
}

// change brick
function changeBricks() {
  generatedBrick = nextBrick;
  nextBrick = generateBrick();
  copyBrick = generatedBrick;
  // rotate++
  rotated();

  let occupied = document.querySelectorAll("#next-tertis-field>.brick");
  occupied.forEach((element) => {
    nextTetrisBox.removeChild(element);
  });
  pos[0] = 2;
  pos[1] = -2;
}

function positionBri(bri) {
  let underBox = checkBorderPass(bri, "bottom");

  let sideShifted = checkBorderPass(bri);

  pos[1] -= underBox;

  pos[0] -= sideShifted;
}

function changeColor(box = "main") {
  if (box === "next") {
    let nextBrick = document.querySelectorAll("#next-tertis-field>.brick");

    nextBrick.forEach((element) => {
      element.style.backgroundColor = nextColor;
    });
  } else if (box === "main") {
    let bricks = document.querySelectorAll("#main-game-field>.brick");

    bricks.forEach((element) => {
      element.style.backgroundColor = colr;
    });
  }
}
function makeBrickConstant() {
  let ocupied = document.querySelectorAll("#main-game-field>.brick");

  ocupied.forEach((element) => {
    element.classList.add("constant_brick");
    element.classList.add(`row${element.style.gridRowStart}`);
    element.style.backgroundColor = "hsl(200, 100%, 50%)";
    element.classList.remove("brick");
    occupiedPlaces.push({
      x: +element.style.gridColumnStart,
      y: +element.style.gridRowStart,
    });
  });
}
function elementAboveConstantBrick() {
  let ocupied = document.querySelectorAll("#main-game-field>.brick");
  let belowElementY = 0;
  let belowElementX = 0;
  let bool = false;
  for (let i = 0; i < ocupied.length; i++) {
    belowElementY = +ocupied[i].style.gridRowStart + 1;
    belowElementX = +ocupied[i].style.gridColumnStart;

    for (let j = 0; j < occupiedPlaces.length; j++) {
      if (occupiedPlaces[j].x !== belowElementX) continue;
      if (occupiedPlaces[j].y === belowElementY) {
        bool = true;
        break;
      }
    }
    if (bool) break;
  }
  return bool ? true : false;
}
// function thereIsBrickAside() {}

function makeBrickConstantAndChangeBrick() {
  makeBrickConstant();
  changeBricks();
  drawOnNext(nextBrick);
  colr = nextColor;
  nextColor = generateRandomColor();
  changeColor("next");
}

function rowWinCheck() {
  let occupiedRows = [];
  occupiedPlaces.forEach((elem) => {
    occupiedRows.push(elem.y);
  });
  let occupiedRowsSet = [...new Set(occupiedRows)];
  let occupiedCount = new Array(occupiedRowsSet.length);
  occupiedCount.fill(0);

  occupiedRows.forEach((elem) => {
    occupiedCount[occupiedRowsSet.indexOf(elem)] += 1;
  });
  // console.log(occupiedRowsSet, occupiedCount);
  let output = [];
  occupiedCount.forEach((elem, index) => {
    if (elem === 10) {
      output.push(occupiedRowsSet[index]);
    }
  });
  // console.log(output);
  // console.log(occupiedCount);
  return output;
}

function setHighScore() {
  console.log(currentHighScore);
  highScorerNameLabel.innerHTML = currentHighScore.name;
  highScoreLabel.innerHTML = currentHighScore.highScore;
}

function eventFunction(e) {
  {
    if (
      e.key !== "ArrowUp" &&
      e.key !== "ArrowLeft" &&
      e.key !== "ArrowRight" &&
      e.key !== "ArrowDown"
    )
      return;

    let occupied = document.querySelectorAll("#main-game-field>.brick");
    occupied.forEach((element) => {
      mainGameBox.removeChild(element);
    });
    let copy = JSON.parse(JSON.stringify(generatedBrick));

    if (e.key === "ArrowUp") {
      let bol = alreadyOcupied(shiftBrick(rotateBrick(copy), pos));
      rotated(-1);
      if (!bol) {
        rotateBrick(generatedBrick);
      }
    }
    if (e.key === "ArrowRight") {
      pos[0] += 1;
      if (alreadyOcupied(shiftBrick(generatedBrick, pos))) {
        pos[0] -= 1;
      }
    }
    if (e.key === "ArrowLeft") {
      pos[0] -= 1;
      if (alreadyOcupied(shiftBrick(generatedBrick, pos))) {
        pos[0] += 1;
      }
    }

    if (e.key === "ArrowDown") {
      pos[1] += 1;
    }

    positionBri(shiftBrick(generatedBrick, pos));
    drawOnMain(shiftBrick(generatedBrick, pos));
    changeColor();
    if (elementAboveConstantBrick()) {
      makeBrickConstantAndChangeBrick();
    }
  }
}

window.addEventListener("keydown", eventFunction);
