import Web3 from 'web3'
import {
  address,
  ABI
} from './constants/pmiContract'
import state from '../store/state'
let getContract = new Promise(function (resolve, reject) {
  if (state.systems.eth.ready) {
    let web3 = new Web3(window.web3.currentProvider)
    let pmiContract = web3.eth.contract(ABI)
    let pmiContractInstance = pmiContract.at(address)
    // casinoContractInstance = () => casinoContractInstance
    resolve(pmiContractInstance)
  } else {
    reject(new Error('No agent'))
  }
})

export default getContract
