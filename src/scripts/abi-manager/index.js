'use strict'

const ABIS = require('./contracts.js')
const { Networks ,CheckNetwork } = require('./networks.js')
const DEF_NETWORK = 'ropsten';
const DEF_GASPRICE = '20000000000'
const DEF_MANAGER_NAME = "BAS_Manager_Simple"

/**
 * Contract Manager
 */
class AbiManager {
	constructor(network,opts){
		if(typeof network !== 'string'){
			this.network = CheckNetwork(DEF_NETWORK)
		}else{
			this.network = CheckNetwork(network)
		}
		if(this.network == null)throw `not support network :${network}`

		this.Addresses = Networks[this.network]
		if(typeof opts === 'object' && Array.isArray(opts)){
			for(var i = 0;i < opts.length;i++){
				if(typeof opts[i] === 'object' && Object.keys(opts[i]).length ==1 ){
					let _key = Object.keys(opts[i])[0];
					let _addr = opts[i][_key]
					this.Addresses[_key] = _addr
				}
			}
		}
	}

	networkChanged(network) {
		if(!CheckNetwork(network))
			throw `not support network :${network}`
		this.network = CheckNetwork(network)
		this.Addresses = Networks[this.network]
	}

	getManagerContract(){
		let _mgr = {
			abi: ABIS[DEF_MANAGER_NAME] 
		}

		if(this.addresses[DEF_MANAGER_NAME]){
			_mgr.address = this.Addresses[DEF_MANAGER_NAME]
		}else{
			throw 'not set manager contract address.'
		}
		return _mgr
	}

	getContract(name) {
		if(typeof ABIS[name] == undefined)
			throw 'contract abi not defined.'

		if(this.Addresses[name])
			throw 'contract address not defined.'

		return {
			abi:ABIS[name],
			address:this.Addresses[name]
		}
	}
}

module.exports = AbiManager