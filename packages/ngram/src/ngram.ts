export const ngramCreator = (words: string, n: number) => {
  const grams: string[] = [];

  for (let i = 0; i <= words.length - n; i++) {
    grams.push(words.substr(i, n).toLowerCase());
  }

  return grams;
};
