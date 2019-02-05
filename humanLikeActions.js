const randomClickCoords = async (page, selector) => {
  await elementIntoView(page, selector);//to get coords into viewport
  const coords = await page.evaluate(selector => {
    const rect = document.querySelector(selector).getBoundingClientRect();
    return {xTop: rect.x, yTop: rect.y, yBottom: rect.y + rect.height - 1, xBottom: rect.x + rect.width - 1}
  }, selector);
  return {x: getRandomInteger(coords.xTop, coords.xBottom), y: getRandomInteger(coords.yTop, coords.yBottom)}
};
const randomClickOnElement = async (page, selector) => {
  const {x, y} = await randomClickCoords(page, selector);
  return await page.mouse.click(x, y, {delay: randomClickDelay()});
};
const elementIntoView = async (page, selector) => {
  if (!selector) return;
  await page.evaluate((selector) => {
    document.querySelector(selector).scrollIntoViewIfNeeded(true);
  }, selector);
};
const getRandomDelayBetweenActions = () => {
  return getRandomInteger(100, 500);//to avoid very fast account creation time
};
const getRandomInteger = (min, max) => {
  return min + Math.random() * (max - min + 1);
};
const randomTypeSpeed = () => {
  return getRandomInteger(50, 300);//average type speed delay
};

const randomDelayBetweenActions = async (page) => {
  await page.waitFor(getRandomDelayBetweenActions())
};
const randomClickDelay = () => {
  return getRandomInteger(50, 300);//average mousedown and mouseup delay
};
const humanLikeClick = async (page, selector) => {
  return await randomClickOnElement(page, selector);
};

const check = async (page, selector) => {
  return await page.click(selector, randomClickDelay());
};
const humanLikeType = async (page, selector, value) => {
  await randomClickOnElement(page, selector);
  await page.type(selector, value.toString(), {delay: randomTypeSpeed()});
  return await page.click('body', randomClickDelay());//unfocus field
};
const humanLikeSelect = async (page, selector, value) => {
  await randomClickOnElement(page, selector);
  await page.select(selector, value);
  return await page.click('body', randomClickDelay());//unfocus field
};


module.exports = {humanLikeClick, humanLikeSelect, humanLikeType, check, randomDelayBetweenActions};