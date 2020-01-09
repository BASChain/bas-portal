const { DApp, BrowerInfo} = require('./dapp/index.js')
const AbiManager = require('./abi-manager')

if(!window || !window.navigator || !window.navigator.userAgent){
  throw 'DApp runtime error: no window or navigator'
}
DApp.runtime = new BrowerInfo()

if(!window.Web3){
  global.Web3 = window.Web3 = DApp.Web3 = require('web3')
}else {
  DApp.Web3 = require('web3')
}


try{
  DApp.IFAPI = {};
  DApp.MMAPI = {};
  if(DApp.runtime.hasMetaMask()){

  }else {
    const { InfuraHandler } = require('./infura')
    DApp.runtime.infuraHandler = new InfuraHandler();
    DApp.runtime.abiManager = new AbiManager();

    let providerUrl = DApp.runtime.infuraHandler.getProviderUrl(
      'http',DApp.runtime.abiManager.network
    )
    DApp.web3 = new DApp.Web3(new DApp.Web3.providers.HttpProvider(providerUrl))
    let _mgr = DApp.runtime.abiManager.getManagerContract();

    let s = DApp.web3.eth.getGasPrice();
/*    IFAPI.IFAPI.ManagerInst = new DApp.web3.eth.Contract(
      _mgr.abi,_mgr.address,)*/

  }
}catch(e){
  console.log(e.message)
  throw 'DApp initial fail.'
}


global.DApp = DApp