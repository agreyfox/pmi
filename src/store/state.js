let state = {
  dapps: {
    instance: null,
    ready: false,
    contract: null,
    coinbase: null,
    balance: null,
    networkId: null
  },
  systems: {
    eth: {
      ready: false,
      instance: null,
      init: false
    },
    moac: {
      ready: false,
      instance: null,
      init: false
    },
    eos: {
      ready: false,
      instance: null,
      init: false
    }
  },
  web3: {
    isInjected: false,
    web3Instance: null,
    networkId: null,
    coinbase: null,
    balance: null,
    error: null
  },
  // rig Contract instance
  contractInstance: null
}
export default state
