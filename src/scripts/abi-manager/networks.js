/**
 *     ____  ___   _____
 *    / __ )/   | / ___/
 *   / __  / /| | \__ \
 *  / /_/ / ___ |___/ /
 * /_____/_/  |_/____/
 *
 * Copyright (c) 2020 BAS,orchid2ev
 * E-mail :bas-fonter@gmail.com
 * git@bas:BASChain/bas-portal.git
 * '1': Ethereum Main Network
 * '2': Morden Test network
 * '3': Ropsten Test Network
 * '4': Rinkeby Test Network
 * '5': Goerli Test Network
 * '42': Kovan Test Network
 */
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