const Settings = require('./settings.js')
const { CheckNetwork } = require('../bas-networks')

class InfuraHandler {
	constructor(opts) {
		let settKeys = Object.keys(Settings)

		if(typeof opts === 'string') { //
			for(var i =0 ;i<settKeys.length;i++){
				let _key = settKeys[i]
				this[_key] = settKeys[_key]
			}
			this['from'] = opts
		}else if(typeof opts === 'object'){
			for(var i =0 ;i<settKeys.length;i++){
				let _key = settKeys[i]
				this[_key] = HasKey(opts,_key) ? opts[_key] : settKeys[_key]
			}
		}
	}


	getProviderUrl(type,network) {
		if(!CheckNetwork(network))
			throw `not support network ${network}`
		let _providerUrl = null;
		switch(type) {
			case "http":
				return buildHttpProvide.call(this,network)
			case "https":
				return buildHttpsProvide.call(this.network)
			case "wss":
				return buildWssProvide.call(this,network)
			default:
				throw 'type need in http,https or wss'
		}
	}

	getContractOpts(_from,_gasPrice){
		return {
			from: _from || this.from,
			gasPrice: _gasPrice || this.gasPrice
		}
	}

	setFrom(from){
		if(from)this.from = from
	}

	setGasPrice(gasPrice){
		if(gasPrice)this.gasPrice = gasPrice
	}
}

function buildHttpProvide(network){
	let _projectId = this.projectId
	return `${InfuraHandler.HttpSchema}://${network}.infura.io/v3/${_projectId}`
}

function buildHttpsProvide(network){
	let _projectId = this.projectId
	if(!this.insec)throw 'no secret defined.'
	let _secret = this.insec
	return `${InfuraHandler.HttpSchema}://:${_secret}@${network}.infura.io/v3/${_projectId}`
}

function buildWssProvide(network){
	let _projectId = this.projectId
	return `${InfuraHandler.WssSchema}://:${network}.infura.io/ws/v3/${_projectId}`
}

const HasKey = (obj,key) => Object.prototype.hasOwnProperty.call(obj,key)

InfuraHandler.HttpSchema = "https"
InfuraHandler.WssSchema = "wss"

module.exports = {
	HasKey,
	InfuraHandler
}