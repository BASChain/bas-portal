const { DAppInfo, BrowerInfo} = require('./dapp/index.js')
if(!window || !window.navigator || !window.navigator.userAgent){
  throw 'DApp runtime error: no window or navigator'
}
DAppInfo.runtime = new BrowerInfo()

global.DAppInfo = DAppInfo