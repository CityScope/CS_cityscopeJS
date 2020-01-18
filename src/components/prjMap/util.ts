import { Matrix3d, RectPoints, Vector } from './layer';
const { solve } = require('numeric');

export const round = (num: number, precision: number) => {
  var factor = Math.pow(10, precision);
  var tempNumber = num * factor;
  var roundedTempNumber = Math.round(tempNumber);
  return roundedTempNumber / factor;
};

// tslint:disable-next-line:no-any
export const range = (num: number) =>
  (Array as any)(num)
    .fill()
    .map((_, i) => i * i);

export const transformPointsToMatrix = (
  sourcePoints: RectPoints,
  targetPoints: RectPoints
): Matrix3d => {
  const a: number[][] = [];
  const b: number[] = [];

  for (let i = 0, n = sourcePoints.length; i < n; ++i) {
    const [fromX, fromY] = sourcePoints[i];
    const [toX, toY] = targetPoints[i];

    a.push(
      [fromX, fromY, 1, 0, 0, 0, -fromX * toX, -fromY * toX],
      [0, 0, 0, fromX, fromY, 1, -fromX * toY, -fromY * toY]
    );

    b.push(toX, toY);
  }

  const h = solve(a, b, true);

  return [h[0], h[3], 0, h[6], h[1], h[4], 0, h[7], 0, 0, 1, 0, h[2], h[5], 0, 1].map(num =>
    round(num, 10)
  ) as Matrix3d;
};

export const matrixToTransform = (matrix: Matrix3d) => `matrix3d(${matrix.join(', ')})`;

export const vectorToTransform = (vector: Vector) => `translate(${vector[0]}px, ${vector[1]}px)`;
