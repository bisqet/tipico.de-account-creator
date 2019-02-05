const puppeteer = require('puppeteer');
const {randomWidth, randomHeight, randomMobile} = require('./getRandomViewport.js');

const {neededToUseProxies, isTestingMode} = require('./config.js');
const launchPuppeteer = async (proxy) => {
  const itWillBeMobile = randomMobile();
  const options = {
    headless: !isTestingMode,
    ignoreHTTPSErrors: true,
    args: [
      '--no-sandbox',
      '--incognito',
      '--disable-setuid-sandbox',
      '--disable-infobars',
      '--window-position=0,0',
      '--ignore-certifcate-errors',
      '--ignore-certifcate-errors-spki-list',
      '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"',
      `${neededToUseProxies ? `--proxy-server=${proxy.ipAddress}:${proxy.port}` : ""}`
    ],
    defaultViewport: {
      width: randomWidth(),
      height: randomHeight(),
      deviceScaleFactor: 1,
      isMobile: itWillBeMobile,
      hasTouch: itWillBeMobile,
      isLandscape: false
    }
  };
  return await puppeteer.launch(options);
};

module.exports = launchPuppeteer;