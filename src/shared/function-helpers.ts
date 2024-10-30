export const clearNullElementsFromArray = (objectsArray) =>
  objectsArray.filter((arrayElement) => arrayElement !== null);

/**
 * @description Sets a timeout and once its completed resolves the promise
 * @param Amount of time in miliseconds
 * @returns {Promise}
 */
export const wait = (ms: number) =>{
  return new Promise<void>(resolve => setTimeout(() => resolve(), ms))
}
