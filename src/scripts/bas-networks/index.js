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
 *
 */
const Networks = [
  {chainId:1,name:"mainnet"},
  {chainId:3,name:"ropsten"},
  {chainId:4,name:"rinkeby"},
  {chainId:5,name:"goerili"},
  {chainId:42,name:"kovan"},
]

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

function GetNetwork(chainId){
  let nt = Networks.filter(item => item.chainId == parseInt(chainId))
  return nt.length > 0 ? nt[0].name : chainId;
}

function GetChainId(network) {
  let nt = Networks.filter(item => item.name == network.toLowerCase())
  if(nt.length > 0){
    return nt[0].chainId
  }else{
    //throw `not fund network ${network} chainId `
    return network
  }
}

module.exports = {
  CheckNetwork, GetNetwork, GetChainId
}