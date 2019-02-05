//const {proxiesListOptimization} = require('./config.js');

const checkForAccessErrors = (page, content) => {
  /*if(proxiesListOptimization){
      require('./proxies.js').proxyIsBlockedByVendor();
  }*/
  if (content.includes('Access Denied')) return 'Access Denied';
};
const checkForDupeAcc = async (page) => {
  const usernameSelector = '.form.left.web-register-field-error.web-register-input-field-error>.rich-message>.rich-message-label';
  const usernameTakenText = "Username is taken, please choose another one.";
  let err = true;
  await page.waitForSelector(usernameSelector).catch(e => {
    err = false;
  });
  if (!err) return;
  return await page.evaluate((usernameSelector, usernameTakenText) => {
    if (!document.querySelector(usernameSelector)) return false;
    return document.querySelector(usernameSelector).textContent === usernameTakenText;
  }, usernameSelector, usernameTakenText)
};
module.exports = {checkForAccessErrors, checkForDupeAcc};