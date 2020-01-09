'use strict'

const DApp = require('./info.json')
const BrowerInfo = require('./check-runtime.js')
const { CheckNetwork, GetNetwork, GetChainId } = require('../bas-networks')

BrowerInfo.prototype.CheckNetwork = CheckNetwork
BrowerInfo.prototype.GetNetwork = GetNetwork
BrowerInfo.prototype.GetChainId = GetChainId

module.exports = {
  DApp,
  BrowerInfo
}