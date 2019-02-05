const config ={
  credentialsRelativePath : "./credentials.js",//add ability to use same credentials for different scripts
  proxieslistRelativePath : "./proxieslist.js",//add ability to use same proxies for different scripts
};
const {credentials, credentialsSelectors, submitSelector} = require(config.credentialsRelativePath);

module.exports = {
  ...config,
  registrationUrl: "https://www.tipico.de/en/registration/",
  PROXY_REUSE_COUNT: 1,
  neededToUseProxies: true,
  isTestingMode: false,
  //proxiesListOptimization:true,//TODO: proxiesListOptimization
  loadOptimizations: false, // This allow not to download images, stylesheets, videos, fonts to not slowdown
  credentials,
  credentialsSelectors,
  submitSelector
};