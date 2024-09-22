export const clearNullElementsFromArray = (objectsArray) =>
  objectsArray.filter((arrayElement) => arrayElement !== null);

export const wait = (ms: number) =>{
  return new Promise<void>(resolve => setTimeout(() => resolve(), ms))
}
