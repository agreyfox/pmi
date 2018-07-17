import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import getWeb3 from '../utils/getWeb3'
import getMoac from '../utils/getMoac'
import pollWeb3 from '../utils/pollWeb3'
// import getContract from '../utils/getContract'
import Networks from '../utils/constants/network'
import { rejects } from 'assert'
import {
  addresses,
  ABIes,
  PMIABI,
  PMIABIMOAC
} from '../utils/constants/pmiContract'
import { EventBus } from '../EventBus.js'
var VueCookie = require('vue-cookie')
// Tell Vue to use the plugin
Vue.use(VueCookie)
Vue.use(Vuex)
export const store = new Vuex.Store({
  strict: true,
  state,
  getters: {
    Web3: function (state) {
      return state.web3
    },
    Network: function (state) {
      return Networks[state.web3.networkId]
    },
    PmiContract: function (state) {
      return state.contractInstance
    },
    isInited: function (state) {
      return state.isInitiated
    },
    getAccountInfo: (state) => (id) => {
      var instance = null
      if (id === 0) {
        instance = state.systems.eth
        if (instance.ready && instance) {
          instance.instance().eth.getCoinbase((err, coinbase) => {
            if (err) {
              EventBus.$emit('ethinfo', {result: false, msg: 'query 查询失败'})
            } else {
              instance.instance().eth.getBalance(coinbase, (err, balance) => {
                if (err) {
                  EventBus.$emit('ethinfo', {result: false, msg: 'balance 查询失败'})
                } else {
                  EventBus.$emit('ethinfo', {result: true, msg: '查询成功', balance: balance, coinbase: coinbase})
                }
              })
            }
          })
        }
      } else if (id === 1) {
        console.log('query moac coinbase')
        instance = state.systems.moac
        if (instance.ready && instance) {
          console.log(instance)
          instance.instance().mc.getBalance(state.systems.moac.coinbase, (err, balance) => {
            if (err) {
              EventBus.$emit('moacinfo', {result: false, msg: 'balance 查询失败'})
            } else {
              state.systems.moac.balance = balance.toNumber()
              EventBus.$emit('moacinfo', {result: true, msg: '查询成功', balance: balance.toNumber(), coinbase: state.systems.moac.coinbase})
            }
          })
        }
      } else if (id === 2) {
        console.log('query eos coinbase')
      }
    },
    dapps: function (state) {
      return state.dapps
    }
  },
  mutations: {
    registerWeb3Instance: function (state, payload) {
      // console.log('registerWeb3instance Mutation being executed', payload)
      let result = payload
      let web3Copy = state.web3
      web3Copy.coinbase = result.coinbase
      web3Copy.networkId = result.networkId
      web3Copy.balance = parseInt(result.balance, 10)
      web3Copy.isInjected = result.injectedWeb3
      web3Copy.web3Instance = result.web3
      state.web3 = web3Copy
      // console.log('Web3 部件已准备，来自插件:' + state.web3.isInjected)
      pollWeb3()
    },
    pollWeb3Instance: function (state, payload) {
      // console.log('pollWeb3Instance mutation being executed', payload)
      state.web3.coinbase = payload.coinbase
      state.web3.balance = parseInt(payload.balance, 100)
    },
    registerContractInstance: function (state, payload) {
      console.log('PmiContract instance updated ')
      state.contractInstance = () => payload
    },
    saveDappsInfo: function (state, payload) {
      if (payload.dapps === 0) {
        state.systems.eth.instance = payload.instance
        state.systems.eth.init = true
        state.systems.eth.ready = true
        // console.log(payload)
        // window.setTimeout(function () {
        EventBus.$emit('init', {has: true, msg: 'Eth done'})
        // }, 2000)
      } else if (payload.dapps === 1) {
        state.systems.moac.ready = true
        state.systems.moac.instance = payload.instance
        state.systems.moac.init = true
        // window.setTimeout(function () {
        EventBus.$emit('init', {has: true, msg: 'Moac done'})
        // }, 2000)
      } else if (payload.dapps === 2) {
        state.systems.eos.ready = true
        state.systems.eos.instance = payload.instance
        state.systems.eos.init = true
        EventBus.$emit('init', {has: true, msg: 'EOS done'})
      } else {
        console.log('Dapps Type is unidentified!')
      }
    },
    setCoinbase: function (state, payload) {
      if (payload.id === 0) {
        state.systems.eth.coinbase = payload.coinbase
      } else if (payload.id === 1) {
        state.systems.moac.coinbase = payload.coinbase
      } else if (payload.id === 2) {
        state.systems.eos.coinbase = payload.coinbase
      }
    },
    setDapps: function (state, xsign) {
      console.log('Now set the dapps engine:' + xsign)
      if (xsign === 0) {
        state.dapps.instance = state.systems.eth.instance
        state.dapps.ready = state.systems.eth.ready
        state.dapps.coinbase = state.systems.eth.coinbase
        state.dapps.balance = state.systems.eth.balance
        state.dapps.Network = ''
        switch (state.dapps.instance().version.network) {
          case '1':
            state.dapps.Network = 'Main'
            break
          case '2':
            state.dapps.Network = 'Morden'
            break
          case '3':
            state.dapps.Network = 'Ropsten'
            break
          case '4':
            state.dapps.Network = 'Rinkeby'
            break
          case '42':
            state.dapps.Network = 'Kovan'
            break
          default:
            state.dapps.Network = 'Unknown'
        }
        state.dapps.address = addresses[0]
        state.dapps.ABI = ABIes[0]
        state.dapps.PMIABI = PMIABI
        // pmi contract infor
        if (state.systems.eth.ready) {
          EventBus.$emit('contract', {result: true, msg: 'Eth OK'})
        } else {
          EventBus.$emit('contract', {result: false, msg: '无法获得智能合约信息'})
        }
      } else if (xsign === 1) {
        state.dapps.instance = state.systems.moac.instance
        state.dapps.ready = state.systems.moac.ready
        // state.dapps.coinbase = state.systems.moac.coinbase
        // state.dapps.balance = state.systems.eth.balance
        state.dapps.Network = ''
        switch (state.dapps.instance().version.network) {
          case '101':
            state.dapps.Network = 'TestNet'
            break
          case '99':
            state.dapps.Network = 'Main'
            break
          default:
            state.dapps.Network = 'Unknown'
        }
        state.dapps.address = addresses[1]
        state.dapps.ABI = ABIes[1]
        state.dapps.PMIABI = PMIABIMOAC
        // pmi contract infor
        if (state.systems.moac.ready) {
          EventBus.$emit('contract', {result: true, msg: 'moac ok'})
        } else {
          EventBus.$emit('contract', {result: false, msg: '无法获得智能合约信息'})
        }
      } else if (xsign === 2) {
        state.dapps.coinbase = state.systems.eos.coinbase
      }
    }
  },
  actions: {
    initEth: function ({commit}, payload) {
      getWeb3.then(result => {
        if (result === rejects) {
          console.log('no mist/metamask')
          EventBus.$emit('init', {has: false, msg: '没有找到相关插件，请安装metamask 或使用mist'})
        } else {
          commit('saveDappsInfo', {instance: result.web3, dapps: 0})
        }
      }).catch(e => {
        console.log(e)
      })
    },
    initMoac: function ({commit}, payload) {
      // var Web3 = require('web3')
      // var Chain3 = require('chain3')
      getMoac.then(result => {
        if (!result.isInjected) {
          console.log('no moac node server ')
          EventBus.$emit('init', {has: false, msg: '未能连接moac主干，请检查网络是否连接'})
        } else {
          commit('saveDappsInfo', {instance: result.instance,
            dapps: 1,
            coinbase: '',
            networkId: result.networkId,
            balance: 0
          })
        }
      }).catch(e => {
        console.log(e)
      })
    },
    initEos: function ({commit}, payload) {
      // var Web3 = require('web3')
      // var Chain3 = require('chain3')
      getWeb3.then(result => {
        console.log(result)
        if (result === rejects) {
          console.log('no mist/metamask')
        } else {
          commit('saveDappsInfo', {instance: result.web3Instance, dapps: 3})
          // commit('registerWeb3Instance', result)
        }
      }).catch(e => {
        console.log(e)
      })
    },
    getContract: function ({commit}, payload) {
      if (payload.type === 0) {
        if (state.systems.eth.ready) {
          let web3 = state.systems.eth.instance
          let pmiContract = web3.eth.contract(ABIes[0])
          let pmiContractInstance = pmiContract.at(addresses[0])
          // casinoContractInstance = () => casinoContractInstance
          commit({instance: web3,
            ready: true,
            contract: pmiContractInstance,
            coinbase: null,
            balance: null,
            networkId: null})
        } else {
          console.log('No agent')
        }
      }
    },
    pollWeb3: function ({
      commit
    }, payload) {
      // console.log('pollWeb3 action being executed')
      commit('pollWeb3Instance', payload)
    },
    registerWeb3: function ({
      commit
    }) {
      console.log('before getweb3 call')
      // console.log('registerWeb3 Action being executed')
      getWeb3.then(result => {
        // console.log('committing result to registerWeb3Instance mutation')
        commit('registerWeb3Instance', result)
      }).catch(e => {
        console.log('error in action registerWeb3', e)
      })
    }
    /* getContractInstance: function ({
      commit
    }) {
      getContract.then(result => {
        commit('registerContractInstance', result)
      }).catch(e => console.log(e))
    } */
  }
})
