const { BrowerInfo, BindDAppInfo} = require('./dapp/index.js')
const { InfuraHandler } = require('./infura')
const AbiManager = require('./abi-manager')


if(!window || !window.navigator || !window.navigator.userAgent){
  throw 'DApp runtime error: no window or navigator'
}

DAppInfo.runtime = new BrowerInfo()

if(!window.Web3){
  global.Web3 = window.Web3 = DApp.Web3 = require('web3')
}else {
  DApp.Web3 = require('web3')
}

global.promisity = (inner) =>
  new Promise((resolve,reject) => {
    inner((err,data) => {
      if(!err){
        resolve(data)
      }else{
        reject(err)
      }
    })
  });


const DApp = {
  state: -1,
  load: async () =>{
    try{
      BindDAppInfo(DApp)

      DApp.IFAPI = {};
      DApp.MMAPI = {};
      DApp.runtime.infuraHandler = new InfuraHandler();
      DApp.runtime.abiManager = new AbiManager();
      let providerUrl = DApp.runtime.infuraHandler.getProviderUrl(
        'http',DApp.runtime.abiManager.network
      )


      if(DApp.runtime.hasMetaMask()){
        DApp.web3 = new DApp.Web3(new DApp.Web3.providers.HttpProvider(providerUrl))

      }else {

        DApp.web3 = new DApp.Web3(new DApp.Web3.providers.HttpProvider(providerUrl))
        let _mgr = DApp.runtime.abiManager.getManagerContract();

        DApp.web3.eth.getGasPrice().then((gasPrice)=>{
          console.log(gasPrice);
          DApp.runtime.infuraHandler.setGasPrice(gasPrice)
          let opts = DApp.runtime.infuraHandler.getContractOpts()
          DApp.IFAPI.ManagerInst = new DApp.web3.eth.Contract(
          _mgr.abi,_mgr.address,opts)
        });

      }
    }catch(e){
      console.log(e.message)
      throw 'DApp initial fail.'
    }
  }
}




global.DApp = DApp
DApp.load();