export function getRandomTextNumber() {
  const random =
    Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  return random;
}
