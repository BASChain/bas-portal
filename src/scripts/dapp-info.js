const { DApp, BrowerInfo} = require('./dapp/index.js')


if(!window || !window.navigator || !window.navigator.userAgent){
  throw 'DApp runtime error: no window or navigator'
}
DApp.runtime = new BrowerInfo()


if(!window.Web3){
  global.Web3 = window.Web3 = DApp.Web3 = require('web3')
}else {
  DApp.Web3 = require('web3')
}

if(DApp.runtime.hasMetaMask()){

}else {
  const { InfuraHandler } = require('./infura')
  DApp.runtime.infuraHandler = new InfuraHandler();
}



global.DApp = DApp