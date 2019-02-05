const config = require('./config.js');

const awaitTimeout = 60000;

const setOptionsForPage = async (page) => {
  await page.setRequestInterception(true);
  page.on('request', (request) => {//here we block any fonts and images, to not slowdown
    if (["stylesheet", "font", "image", "media"].indexOf(request.resourceType()) !== -1 || request.url().indexOf('.faces') !== -1) {
      if (config.loadOptimizations) return request.abort();
      request.continue();
    } else {
      request.continue();
    }
  });
  page.setDefaultNavigationTimeout(awaitTimeout);
  //await page.authenticate({username:"vpn",password:"vpn"});
  //await page.setExtraHTTPHeaders({'Proxy-Authorization': 'Basic' + Buffer.from('vpn:vpn').toString('base64')});
};

module.exports = {setOptionsForPage, awaitTimeout};