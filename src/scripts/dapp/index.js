'use strict'

const DAppInfo = require('./info.json')
const BrowerInfo = require('./check-runtime.js')
const { CheckNetwork, GetNetwork, GetChainId } = require('../bas-networks')

BrowerInfo.prototype.CheckNetwork = CheckNetwork
BrowerInfo.prototype.GetNetwork = GetNetwork
BrowerInfo.prototype.GetChainId = GetChainId

function BindDAppInfo(DApp){
  if(typeof DApp === 'object'){
    let keys = Object.keys(DAppInfo)
    keys.forEach(key =>{
      DApp[key] = DAppInfo[key]
      return key
    })
  }
}

module.exports = {
  BrowerInfo,
  BindDAppInfo
}