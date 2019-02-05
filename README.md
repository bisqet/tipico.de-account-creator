# How to
1. run `npm i`;
2. change credentials to needed by changing credentials.js;
3. run `npm start`;
4. ...profit.
### If wanna use same credentials for different script
1. change `credentialsRelativePath` to your credentials file path in `config.js`
### If wanna use same proxies for different script
1. change `proxieslistRelativePath` to your proxieslist file path in `config.js`
### If wanna increase speed of creating accounts by not loading images/stylesheets/fonts/media files
1. change `loadOptimizations` to `true` in `config.js`
### If wanna view exactly what script do
1. change `isTestingMode` to `true` in `config.js`
### If wanna to use same good proxy few times
1. change `PROXY_REUSE_COUNT` to number how much times needed in `config.js`(to use one proxy in a row if this proxy is good)
### If wanna not to use proxy
1. change `neededToUseProxies` to `false` in `config.js`
### If wanna to optimize proxieslist
1. change `proxiesListOptimization` to `false` in `config.js`
(this will delete blocked by site proxies from proxieslist )
### If wanna to debug script
1. run `npm run debug`;