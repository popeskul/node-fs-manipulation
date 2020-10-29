const generatePairs = (...numbers) => {
  const isEachNumber = numbers.every((n) => typeof n === 'number');
  const MAX_LENGTH = 100;

  if (numbers.length % 2 !== 0) {
    return 'Not enough of numbers';
  } else if (numbers.length > MAX_LENGTH) {
    return `Pairs must be up to ${MAX_LENGTH}`;
  } else if (!isEachNumber) {
    return 'Bad typeof value';
  } else {
    let resultPairs = [];

    for (let i = 0; i < numbers.length; i += 2) {
      const numbersDifference = numbers[i + 1] - numbers[i];

      if (numbers[i] >= numbers[i + 1]) {
        return (resultPairs = 'Ooops, you need [min, max]');
      } else if (numbersDifference > MAX_LENGTH) {
        return `Ooops, Range differences must be up to ${MAX_LENGTH}`;
      }

      resultPairs.push([numbers[i], numbers[i + 1]]);
    }

    return resultPairs;
  }
};

module.exports = generatePairs;
