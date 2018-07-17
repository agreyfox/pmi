<template>
    <v-stepper v-model="e1">
      <v-stepper-header>
        <v-stepper-step :complete="e1 > 1" step="1">设置</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="e1 > 2" step="2">选择</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="3">完成</v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card color="blue lighten-1" class="mb-5" height="200px">
              <v-progress-circular v-show="checkingweb3" indeterminate color="primary"></v-progress-circular>
              <div v-show="checkingweb3"> 检查系统部件... <br/> </div>
              <div v-show='!checkingweb3'>
                <dir v-if="hasWeb3">
                  <br/>
                  <strong>您已安装metamask 插件</strong><br/>
                  <strong>coinbase</strong>: {{coinbase}}<br/>
                  <strong>token</strong>: {{balance}} <br/><br>
                    您可以继续使用本系统在以太坊上发送永久信息．您也可以切换metamask 账户.
                </dir>
                <div v-else>
                  {{msg}}
                </div>
              </div>
          </v-card>
          <v-btn color="primary" @click.native='gotoPage(2)'>下一步</v-btn>
        </v-stepper-content>
        <v-stepper-content step="2">
          <v-card color="deep-orange darken-3" class="mb-5" height="300px">
              <v-progress-circular v-if="checkingchain3" indeterminate color="primary"></v-progress-circular>
              <div v-if="checkingchain3"> 检查墨客moac部件...</div>
              <v-container v-show='!checkingchain3'>
                <div v-if="haschain3">
                      <v-flex> <strong>连接入Moac网络成功</strong></v-flex>
                      <v-flex v-if='!needinput'>
                        <span>为您创建的墨客地址为:</span> <br/>
                        <strong>钱包:</strong>: {{coinbase}} <br/>
                        <strong>密钥{{privatekey}}</strong> <br/>
                        <span>请从您现有墨客钱包充点墨客到这个钱包吧</span>
                        <v-spacer></v-spacer>
                        <v-btn @click.native='changeAddr'>手工输入我的墨客钱包信息</v-btn>
                      </v-flex>
                      <v-flex v-else>
                         <span>请输入您的Moac地址，这个发送永久信息必须的，所有的永久信息将和这个地址相关．</span>
                        <v-text-field
                          id="newaddress"
                          name="moacaddress"
                          label="输入moac钱包地址"
                          v-model="moacaddr"
                        ></v-text-field>
                         <v-text-field
                          v-model="password"
                          :append-icon="e1 ? 'visibility' : 'visibility_off'"
                          :append-icon-cb="() => (see = !see)"
                          :type="see ? 'password' : 'text'"
                          name="inputp"
                          label="输入你的账户的私钥"
                          hint="通过钱包可以查看自己的私钥，本系统只会用于信息发布"
                          min="8"
                          counter
                        ></v-text-field>
                        <v-btn @click.native='newAddr'>确定</v-btn>
                      </v-flex>
                </div>
                <div v-else>
                    <span>没有发现moac链！</span>
                </div>
            </v-container>
          </v-card>
          <v-btn color="primary" @click.native='gotoPage(3)'>继续</v-btn>
          <v-btn flat @click.native='gotoPage(1)'>前一步</v-btn>
        </v-stepper-content>
        <v-stepper-content step="3">
          <v-card color="blue-grey darken-1" class="mb-5" height="200px">
            <v-container>
              <v-layout>
                EOS Connection Under-Construction...
              </v-layout>
            </v-container>
          </v-card>
          <v-btn color="primary" @click.native="starPage">开始</v-btn>
          <v-btn flat @click.native="gotoPage(2)">前一步</v-btn>
        </v-stepper-content>
      </v-stepper-items>
  </v-stepper>
</template>
<script>
/* eslint-disable */
import { EventBus } from '../EventBus.js'
export default {
 name: 'App',
  data () {
    return {
      e1: 0,
      hasWeb3: false,
      haschain3: false,
      checkingweb3: true,
      checkingchain3: true,
      msg: '',
      tpsdk: null,
      coinbase: '',
      privatekey: '',
      balance: '',
      needinput: false,
      moacaddr: '',
      password: '',
      see: true
    }
  },
  created: function () {
    var vv = this
    console.log('开始初始化．．．')
    EventBus.$once('ethinfo', info => {
      if (info.result) {
          vv.coinbase = info.coinbase
          vv.balance = info.balance
        }else {
          vv.msg = '查询区块链网络失败，请重新连接测试！'
        }
    })
   
    EventBus.$once('init', result => {
      if (result.has) {
        vv.checkingweb3 = false
        vv.hasWeb3 = true
        let info = vv.$store.getters.getAccountInfo(0)
      }else {
        vv.checkingweb3 = false
        vv.hasWeb3 = false;
      }
    })
    EventBus.$on('moacinit', result => {
      if (result.has) {
        vv.checkingchain3 = false
        vv.haschain3 = true
        let pmiinfo = vv.$cookie.get("PMI")   //get pmi cookie
        if (pmiinfo){
            vv.$store.commit("setCoinbase",{id: 1, coinbase: pmiinfo})
            let info = vv.$store.getters.getAccountInfo(1)
        }else {
            vv.needinput = true
        }
      }else {
        vv.checkingchain3 = false
        vv.haschain3 = false;
        vv.msg = vv.msg
      }
    })
  },
  mounted: function () {
    var vv = this
    vv.$store.dispatch('initEth')
    console.log('初始化结束')
  },
  methods: {
    invokeQRScanner: function () {
    },
    getDeviceId: function() {
      this.msg = 'get device'
    },
    onGetDeviceId: function (result) {
        var data = JSON.parse(result)
        this.msg = data.device_id
    },
    gotoPage(pageno){
      var vv = this
      vv.e1 = pageno
      if (pageno == 1 ) {  
        console.log('初始化eth')
        vv.checkingweb3 = true
        EventBus.$once('ethinfo', info => {
          if (info.result) {
              vv.coinbase = info.coinbase
              vv.balance = info.balance
            }else {
              vv.msg = '查询区块链网络失败，请重新连接测试！'
            }
        })
        EventBus.$once('init', result => {
          if (result.has) {
            vv.checkingweb3 = false
            vv.hasWeb3 = true
            let info = vv.$store.getters.getAccountInfo(0)
          }else {
            vv.checkingweb3 = false
            vv.hasWeb3 = false;
          }
        })
        vv.$store.dispatch('initEth')
      }else if (pageno == 2 ) {  // init eth
        vv.checkingchain3 = true
        EventBus.$on('moacinfo', info => {
          if (info.result) {
            vv.haschain3 = true
            vv.checkingchain3 = false
            vv.coinbase = info.coinbase
            vv.balance = info.balance
          }else {
              vv.msg = '查询区块链网络失败，请重新连接测试！'
              vv.checkingchain3 = false
          }
        })
        EventBus.$once('init', result => {
           if (result.has) {
              vv.checkingchain3 = false
              vv.haschain3 = true
              let pmiinfo = vv.$cookie.get("PMI")   //get pmi cookie
              if (pmiinfo){
                  vv.$store.commit("setCoinbase",{id: 1, coinbase: pmiinfo})
                  vv.privatekey = vv.$cookie.get('PMIpass')
                  let info = vv.$store.getters.getAccountInfo(1)
              }else {
                  vv.createNewMoacWallet()
                  vv.needinput = false
              }
            }else {
              vv.checkingchain3 = false
              vv.haschain3 = false;
              vv.msg = vv.msg
            }
        })
        vv.$store.dispatch('initMoac')
      }else if (pageno == 3 ){
        console.log('初始化EOS')
      }
    },
    newAddr: function () {
      var vv = this
      if (vv.moacaddr) {
        vv.checkingchain3 = true
        vv.needinput = false
        vv.$cookie.set('PMI',vv.moacaddr,{ expires: '1Y' })
        if (vv.password) {
          vv.$cookie.set('PMIpass',vv.password,{ expires: '1Y' })
        }
        vv.$store.commit("setCoinbase",{id: 1, coinbase: vv.moacaddr})
        window.setTimeout(function () {
          let info = vv.$store.getters.getAccountInfo(1)
        }, 2000)
      }
    },
    createNewMoacWallet: function () {
      var crypto = require('crypto');
      var secp256k1 = require('secp256k1');
      var keccak = require('keccak');
      //获得随机的32个字节作为私钥，在使用中，请注意随机数来源的安全
      var privateKey = crypto.randomBytes(32);
      //获得公钥
      var publicKey = secp256k1.publicKeyCreate(privateKey, false).slice(1);
      //获得地址
      var address = keccak('keccak256').update(publicKey).digest().slice(-20);

      console.log('public key', publicKey.toString('hex'))
      console.log('private key', privateKey.toString('hex'))
      console.log('address', '0x' + address.toString('hex'))
      this.coinbase = '0x' + address.toString('hex')
      this.privatekey = privateKey.toString('hex')
      this.$cookie.set('PMI',this.coinbase,{ expires: '1Y' })
      this.$cookie.set('PMIpass',this.privatekey,{ expires: '1Y' })

    },
    changeAddr: function () {
      var vv = this
      vv.needinput = true
    },
    starPage: function () {
      this.$router.push({name: "main"})
    }
  },
  watch: {
  },
  computed: {
  }
}
</script>
<style scoped>

</style>

