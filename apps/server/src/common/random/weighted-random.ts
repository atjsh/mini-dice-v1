/**
 *
 * @param spec
 * @returns
 */
export function weightedRandom(spec: { [x: number]: number }): number {
  let sum = 0;
  const r = Math.random();
  for (const i in spec) {
    sum += spec[Number(i)];
    if (r <= sum) return Number(i);
  }
  return 0;
}
