const Networks = {
	ropsten:{
		"BAS_Token":"0x3058A7Ed6a0E15691F9e309cbe982A820928e055",
		"BAS_Manager_Simple":"0x70BACAb31f1897dAFECa711475Fa81Fe49e5e04C"
	},
	mainnet:{
		"BAS_Token":"",
		"BAS_Manager_Simple":""
	}	
}

function CheckNetwork(network){
	if(typeof network == undefined)
		return null

	switch (network) {
		case "1":
			return "mainnet"
		case "mainnet":
			return "mainnet"
		case "3":
			return "ropsten"
		case "ropsten":
			return "ropsten"
		default:
			return null;	
	}
}

module.exports = { Networks , CheckNetwork }