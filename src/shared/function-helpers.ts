export const clearNullElementsFromArray = (objectsArray) =>
  objectsArray.filter((arrayElement) => arrayElement !== null);

export const formatStringToMovieTitle = (text: string) => {
  const conjunctions = [
    "for",
    "of",
    "on",
    "and",
    "nor",
    "but",
    "or",
    "yet",
    "so",
    "a",
    "in",
    "the",
  ];
  let formattedString: string = "";

  const wordWithCapitalLetter = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const wordsArray = text.split(" ");

  wordsArray.forEach((word, index) => {
    if (index !== 0 && conjunctions.includes(word.toLowerCase())) {
      formattedString = formattedString + word.toLowerCase();
    } else {
      formattedString = formattedString + wordWithCapitalLetter(word) + "";
    }

    if (wordsArray[index + 1]) {
      formattedString = formattedString + " ";
    }
  });

  return formattedString;
};
/**
 * @description Sets a timeout and once its completed resolves the promise
 * @param Amount of time in miliseconds
 * @returns {Promise}
 */
export const wait = (ms: number) => {
  return new Promise<void>((resolve) => setTimeout(() => resolve(), ms));
};

export const takeScreenshot = async ({ page }) =>
  await page.screenshot({
    path: "screenshot.jpg",
  });
