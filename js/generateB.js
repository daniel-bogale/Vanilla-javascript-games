export function generateBrick() {
  const bricks = [
    [
      { x: 3, y: 2 },
      { x: 3, y: 3 },
      { x: 3, y: 4 },
      { x: 4, y: 4 },
    ],
    [
      { x: 4, y: 2 },
      { x: 4, y: 3 },
      { x: 4, y: 4 },
      { x: 3, y: 4 },
    ],
    [
      { x: 2, y: 3 },
      { x: 3, y: 3 },
      { x: 4, y: 3 },
      { x: 5, y: 3 },
    ],
    [
      { x: 3, y: 3 },
      { x: 4, y: 3 },
      { x: 3, y: 4 },
      { x: 4, y: 4 },
    ],
    [
      { x: 3, y: 2 },
      { x: 3, y: 3 },
      { x: 3, y: 4 },
      { x: 4, y: 3 },
    ],
    [
      { x: 3, y: 2 },
      { x: 3, y: 3 },
      { x: 4, y: 4 },
      { x: 4, y: 3 },
    ],
    [
      { x: 4, y: 2 },
      { x: 4, y: 3 },
      { x: 3, y: 4 },
      { x: 3, y: 3 },
    ],
  ];

  let randNo = Math.floor(Math.random() * bricks.length);

  return bricks[randNo];
  // return bricks[2];
}
