
const {PROXY_REUSE_COUNT, proxiesListOptimization, proxieslistRelativePath} = require('./config.js');

const proxiesList = require(proxieslistRelativePath);

module.exports = {
  currentProxy: {
    reused: 0,
    id: 0,
    isGood: false
  },
  next() {
    if (this.currentProxy.reused === PROXY_REUSE_COUNT) {
      console.debug(`This proxy reused maximum(${PROXY_REUSE_COUNT}) number of times`);
      this.getNextProxyId();
      this.proxyIsNotUsed();
      this.proxyIsBad();
    }
    if (this.currentProxy.isGood) {
      this.currentProxy.reused++;
      this.proxyIsBad();
      console.debug(`Proxy reused.`);
      return proxiesList[this.currentProxy.id];
    }
    this.proxyIsNotUsed();
    console.debug(`Proxy changed. Current proxy id is: ${this.currentProxy.id}`);
    return proxiesList[this.getNextProxyId()];
  },
  proxyIsNotUsed() {
    this.currentProxy.reused = 0;
  },
  proxyIsGood() {
    this.currentProxy.isGood = true;
  },
  proxyIsBad() {
    this.currentProxy.isGood = false;
  },
  getNextProxyId() {
    this.currentProxy.id = proxiesList.length === this.currentProxy.id + 1 ? 0 : this.currentProxy.id + 1;
    return this.currentProxy.id;
  },

  /*proxyIsBlockedByVendor(){
    const fs = require('fs');
    if(!proxiesListOptimization)return;
    proxiesList.splice(this.currentProxy.id, 1);
    const proxieslistFormatted = `module.exports =${JSON.stringify(proxiesList)};`;
    fs.writeFileSync('./proxieslist.js', proxylistFormatted, "utf8");
    this.currentProxy--;
  }*/
};