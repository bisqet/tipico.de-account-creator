const config = require('./config.js');//simple config file
const proxies = require('./proxies.js');//random proxy list including 8k free anonymous proxy + VPN endpoints. only ~50% working but each launch it optimize itself.
/*
* proxies = [{
* "ipAddress":String,
* "port":Number,
* "country":String, // short like "us", "ru", etc
* "source":String,   // source where proxy was got.
* "anonymityLevel": "elite" or "anonymous"
* },..]
*/

const launchPuppeteer = require('./launchPuppeteer.js');
const {setOptionsForPage} = require('./setOptionsForPage.js');
const {humanLikeClick, humanLikeType, humanLikeSelect, check, randomDelayBetweenActions} = require('./humanLikeActions.js');
const {checkForAccessErrors, checkForDupeAcc} = require('./checkForErrors.js');

const startSigningUp = async (config, proxies, credentials) => {
  if (!credentials) credentials = config.credentials;
  credentials.current = 0;
  while (credentials.current !== credentials.length) {
    let credential = credentials[credentials.current];
    let currentProxy = undefined;
    if (config.neededToUseProxies) currentProxy = proxies.next();//set current proxy for this cycle if needed
    const browser = await launchPuppeteer(currentProxy);//launch puppeteer for each cycle - easier to set proxy for each iteration.
    const incognito = await browser.createIncognitoBrowserContext();//tested, better solution - fewer problems with destroying full browser instance than using incognito instances only.

    await main(incognito, config, credential)//main function only takes incognito instance without browser to protect from closing browser.
      .then(async ({result}) => {
        credentials.current++;
        if (result.success) {
          console.info(`successfully signed up account with email: ${result.credential.email}`)
        } else {
          console.warn(`account with email: ${result.credential.email} was not successfully created due to error: ${result.error}`);
        }
        await browser.close();
      })
      .catch(async (err) => {// all non standard scenarios go here (like proxy errors and other errors)
        if (err.message.search(/proxy|ERR_CONNECTION_RESET|EMPTY_RESPONSE|Navigation Timeout|WEBSOCKET|browser has disconnected/i) === -1) console.warn(err);//not warn if problem caused by proxy
        await browser.close();
      })
  }
};

const main = async (incognito, {credentialsSelectors, registrationUrl}, credential) => {
  const result = {
    credential,
    success: true,
    error: ""
  };//initial values for result
  let pageRegistration = await incognito.newPage();//let because maybe need to close page

  await setOptionsForPage(pageRegistration);

  await pageRegistration.goto(registrationUrl);
  const error = checkForAccessErrors(pageRegistration, await pageRegistration.content());
  if (error) {

    throw new Error(error);
  }
  await pageRegistration.waitForSelector('.user-section');
  if (config.isTestingMode) await pageRegistration.addScriptTag({path: "./mouseEmulator.js"});
  if (config.loadOptimizations) await pageRegistration.evaluate(() => document.querySelector('.user-section').remove());// here we delete element which block us to access to needed elements when no stylesheet
  await fillAllFields(pageRegistration, credential, credentialsSelectors);
  await fillAllFields(pageRegistration, credential, credentialsSelectors);//if proxy is slow it will broke mouse focus so some fields may not be filled. we return to do so
  await fillAllFields(pageRegistration, credential, credentialsSelectors);//Here is last field typed. Here three functions because they cover maximum slow proxy which will change focus and broke ability to type three times.
  await humanLikeClick(pageRegistration, config.submitSelector);
  await pageRegistration.waitForRequest(request => {
    return request.url().indexOf('regconfirm?AccountId') !== -1;
  })
    .catch(async () => {
      if (!await checkForDupeAcc(pageRegistration)) {
        throw new Error('registration was unsuccessful');
      }
      result.error = "Account duplicated";
      result.success = false;
    });
  return {result};
};
const fillAllFields = async (pageRegistration, credential, credentialsSelectors) => {
  for (let fieldName in credential) {
    if (!credential.hasOwnProperty(fieldName)) continue;
    let fieldSelector = typeof credentialsSelectors[fieldName] === 'object' ? credentialsSelectors[fieldName][credential[fieldName]] : credentialsSelectors[fieldName];
    await pageRegistration.waitForSelector(fieldSelector);//waiting for selector we need
    let value = credential[fieldName];
    let {nodeName, type, neededToType, neededToCheck} = await pageRegistration.evaluate(({fieldSelector, value}) => {
      const el = document.querySelector(fieldSelector);
      const neededToType = el.value !== value;
      if (neededToType && el.type !== ("radio" || "checkbox")) el.value = "";
      return {
        nodeName: el.nodeName,
        type: el.type,
        neededToType: neededToType,
        neededToCheck: !el.checked
      }
    }, {fieldSelector, value});


    if (nodeName === 'SELECT' && neededToType) {
      await humanLikeSelect(pageRegistration, fieldSelector, value);
      await randomDelayBetweenActions(pageRegistration);
      continue;
    }
    if (nodeName === "INPUT" && (type === "radio" || type === "checkbox")) {
      if (!neededToCheck) continue;
      await check(pageRegistration, fieldSelector);
      await randomDelayBetweenActions(pageRegistration);
      continue;
    }
    if (nodeName === "INPUT" && neededToType) {
      await humanLikeType(pageRegistration, fieldSelector, value);
      await randomDelayBetweenActions(pageRegistration);
    }
  }
};
if (!module.parent) {
  startSigningUp(config, proxies)//.then(console.info('tipico.de script ended work'));
} //if function is required by another module -- DON'T LAUNCH
const mainWrapper = async (credentials) => {// wrappers for more elegant tests also
  return await startSigningUp(config, proxies, credentials);
};
module.exports = mainWrapper;

