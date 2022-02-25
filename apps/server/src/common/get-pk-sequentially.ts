function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

export function getSequentialPk(tableName: string) {
  const shortTableName = `${tableName
    .split('_')
    .map((char) => char['0'])
    .join('')
    .toUpperCase()}`;

  const timestamp = +new Date();

  const fillingLetterCount =
    20 - shortTableName.length + timestamp.toString().length;

  const fillingLetter = Array(fillingLetterCount)
    .fill(0)
    .map(() => getRandomInt(0, 10))
    .join('');

  return `${shortTableName}${timestamp}${fillingLetter}`;
}
