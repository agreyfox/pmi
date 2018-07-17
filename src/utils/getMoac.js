import Chain3 from 'chain3'
/*
 * 1. Check for injected web3 (mist/metamask)
 * 2. If metamask/mist create a new web3 instance and pass on result
 * 3. Get networkId - Now we can check the user is connected to the right network to use our dApp
 * 4. Get user account from metamask
 * 5. Get user balance
 */
window.ChainServer = 'http://118.193.95.138:8545'
let getMoac = new Promise(function (resolve, reject) {
  if (typeof window.chain3 !== 'undefined') {
    window.chain3 = new Chain3(window.chain3.currentProvider)
  } else {
    // set the provider you want from Chain3.providers
    window.chain3 = new Chain3(new Chain3.providers.HttpProvider(window.ChainServer))
  }
  if (typeof window.chain3 !== 'undefined') {
    resolve({
      isInjected: window.chain3.isConnected(),
      instance () {
        return window.chain3
      }
    })
  } else {
    // web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545')) GANACHE FALLBACK
    reject(new Error('Unable to connect to chian3 world'))
  }
})
  .then(result => {
    return new Promise(function (resolve, reject) {
      result.instance().version.getNetwork((err, networkId) => {
        if (err) {
          reject(new Error('Unable to retrieve network ID'))
        } else {
          // Assign the networkId property to our result and resolve promise
          result = Object.assign({}, result, {
            networkId
          })
          resolve(result)
        }
      })
    })
  })
  .then(result => {
    return new Promise(function (resolve, reject) {
      // Retrieve coinbase
      result.instance().mc.getCoinbase((err, coinbase) => {
        if (err) {
          reject(new Error('Unable to retrieve coinbase'))
        } else {
          result = Object.assign({}, result, {
            coinbase
          })
          resolve(result)
        }
      })
    })
  })
  .then(result => {
    return new Promise(function (resolve, reject) {
      // Retrieve balance for coinbase
      result.instance().mc.getBalance(result.coinbase, (err, balance) => {
        if (err) {
          reject(new Error('Unable to retrieve balance for address: ' + result.coinbase))
        } else {
          result = Object.assign({}, result, {
            balance
          })
          resolve(result)
        }
      })
    })
  })

export default getMoac
