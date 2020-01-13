const { BrowerInfo, BindDAppInfo} = require('./dapp/index.js')
const { InfuraHandler } = require('./infura')
const { CheckNetwork, GetNetwork, GetChainId } = require('./bas-networks')

const AbiManager = require('./abi-manager')


if(!window || !window.navigator || !window.navigator.userAgent){
  throw 'DApp runtime error: no window or navigator'
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
  chainId : 1,
  state: -1,
  load: async () => {
    BindDAppInfo(DApp)
    DApp.runtime = new BrowerInfo()
    DApp.Web3 = require('web3')

    DApp.IFAPI = {};
    DApp.MMAPI = {};

    try{
      DApp.runtime.infuraHandler = new InfuraHandler();
      DApp.runtime.abiManager = new AbiManager(CheckNetwork(DApp.chainId));

      if(DApp.runtime.hasMetaMask()){
        //const accounts = await ethereum.send('eth_requestAccounts');
        console.log('hasMetaMask')
        await DApp.bindEthereumEvents()
        await DApp.initMetaMaskWeb3(DApp.runtime)
        window.web3 = DApp.web3 = new DApp.Web3(window.web3.currentProvider)
        let _currentChainId = parseInt(ethereum.chainId);
        DApp.setChainId(_currentChainId);
      }else{

        let providerUrl = DApp.runtime.infuraHandler.getProviderUrl(
          'http',DApp.runtime.abiManager.network
        )
        window.web3 = DApp.web3 = new DApp.Web3(new DApp.Web3.providers.HttpProvider(providerUrl))
      }
    }catch(e){
      DApp.runtime.setLastError(e)
      throw `DApp init Error:${e.message}`
    }

    //return DApp.initWeb3();
  },
  //init MetaMaskProvider
  initMetaMaskWeb3:async (runtime)=>{
    //See https://metamask.github.io/metamask-docs/API_Reference/Ethereum_Provider#ethereum.autorefreshonnetworkchange
    return ethereum.enable().then(accounts =>{
      if(accounts&&accounts.length){
        runtime.infuraHandler.setFrom(accounts[0])
      }
    })
  },
  bindEthereumEvents: async ()=>{
    window.ethereum.on('accountsChanged',accounts => {
      console.log(accounts)
    })
    window.ethereum.on('chainChanged',chainId =>{
      DApp.chainId = chainId;
      console.log(chainId)
    })

  },
  setChainId:(chainId) =>{
    DApp.chainId = chainId

  },

  //
  initWeb3: async ()=> {
    try{
      DApp.runtime.abiManager = new AbiManager();
      if(DApp.runtime.hasMetaMask()){
        DApp.web3 = new DApp.Web3(new DApp.Web3.providers.HttpProvider(providerUrl))
        const _accounts = await ethereum.send('eth_requestAccounts')
        if(_accounts&&_accounts.length){
          DApp.runtime.infuraHandler.setFrom(_accounts[0])
        }

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