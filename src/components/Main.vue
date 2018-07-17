<template>
    <v-flex>
        <v-tabs icons-and-text centered dark grow @input='tabchange' v-model='tabname'>
            <v-tabs-slider color="yellow"></v-tabs-slider>
            <v-tab href="#tab-1">
            以太坊-Testnet
                <v-icon>phone</v-icon>
            </v-tab>
            <v-tab href="#tab-2" >
            墨客
                <v-icon>message</v-icon>
            </v-tab>
            <v-tab href="#tab-3">
            EOS
                <v-icon>account_box</v-icon>
            </v-tab>
            <v-tab-item id="tab-1" class="mt-0 pt-0">
                <v-container
                    fluid
                    class="mt-0 pt-0"
                    style="max-width: 600px; margin: auto; min-height: 0;"
                    grid-list-lg
                >
                    <v-layout row wrap>
                        <v-flex xs12>
                             <v-toolbar color="indigo" dark>
                                <v-toolbar-side-icon></v-toolbar-side-icon>
                                <v-toolbar-title>发送以太坊消息</v-toolbar-title>
                                <v-progress-circular v-show="inProgress" indeterminate color="primary"></v-progress-circular>
                                <v-spacer></v-spacer>
                                <v-btn icon dark @click="sendTxtToNet" :disabled="!isRegister">
                                    发送
                                <v-icon>send</v-icon>
                                </v-btn>
                            </v-toolbar>
                            <v-card color="blue-grey darken-1" class="white--text">
                                <v-layout column >
                                    <v-flex xs12>
                                        <v-expansion-panel v-model="ethexpand" expand v-if="isRegister" >
                                            <v-expansion-panel-content key="account" style='max-height:50%;'>
                                                <div slot="header">
                                                    <span class='subheading'>用户地址:&nbsp;&nbsp;&nbsp;{{usernick}}</span><br>
                                                    <span class="subheading">RiG币:&nbsp;&nbsp;&nbsp;{{mytotal}} 个</span>
                                                </div>
                                                <v-card>
                                                    <v-card-text v-if='numberofitem>0'>
                                                        <span class='caption'>在以太坊网络中{{$store.getters.dapps.Network}},您已发送<strong>{{numberofitem}}</strong>条永久信息.</span>
                                                        <v-select
                                                            :items="mylist"
                                                            v-model="selectedone"
                                                            label="选择查看"
                                                            item-text='id'
                                                            item-value='id'
                                                            max-height="50%"
                                                            autocomplete
                                                            single-line
                                                            @change='showOne'
                                                            >
                                                            </v-select>
                                                    </v-card-text>
                                                </v-card>
                                            </v-expansion-panel-content>
                                        </v-expansion-panel>
                                        <v-expansion-panel v-else>
                                             <v-expansion-panel-content key="account" >
                                                <div slot="header">
                                                    注册 (输入用户口令和邮件地址即可获得100 RiG 币！)
                                                </div>
                                                <v-card>
                                                    <v-container fluid>
                                                        <strong v-if='!isRegister'>以太坊地址:{{coinbase}}</strong>
                                                        <v-layout row>
                                                            <v-flex xs4>
                                                                <v-subheader>口令</v-subheader>
                                                            </v-flex>
                                                            <v-flex xs8>
                                                                <v-text-field
                                                                id="userpadd"
                                                                name="口令"
                                                                label="请输入口令"
                                                                v-model="password"
                                                                type="password"
                                                                ></v-text-field>
                                                            </v-flex>
                                                        </v-layout>
                                                        <v-layout row>
                                                            <v-flex xs4>
                                                                <v-subheader>邮件</v-subheader>
                                                            </v-flex>
                                                            <v-flex xs8>
                                                                <v-text-field
                                                                name="email"
                                                                v-model="email"
                                                                label="请输入你的邮件地址"
                                                                value="email"
                                                                class="input-group--focused"
                                                                ></v-text-field>
                                                            </v-flex>
                                                        </v-layout>
                                                        <v-layout row>
                                                            <v-flex></v-flex>
                                                            <v-flex class="mx-auto"><v-btn @click="register">注册</v-btn></v-flex>
                                                        </v-layout>
                                                    </v-container>
                                                </v-card>
                                            </v-expansion-panel-content>
                                        </v-expansion-panel>
                                    </v-flex>
                                    <v-flex xs12 row>
                                        <v-card-text>
                                            <v-checkbox
                                                :label="`是否公开: ${openmsg}`"
                                                v-model="open"
                                            ></v-checkbox>
                                            <span>请选择速度:<strong>{{speed}}</strong></span>
                                            <v-slider v-model="gas"  step="50" ticks style='height:12px'></v-slider>
                                        </v-card-text>
                                        <v-container fluid style='max-height:75%'>
                                            <v-layout column>
                                                <v-flex xs12 >
                                                    <v-text-field
                                                    v-model="msg"
                                                    label="信息"
                                                    multi-line
                                                    auto-grow
                                                    clearable
                                                    box
                                                    >
                                                    </v-text-field>
                                                </v-flex>
                                            </v-layout>
                                        </v-container>
                                    </v-flex>
                                     <v-flex row>
                                         <v-layout class='mt-0 pa-0'>
                                             <v-flex xs2><strong>系统消息:</strong></v-flex>
                                             <v-flex xs10 text-sm-left class='mt-0 ' >
                                                 <v-text-field
                                                    color="white"
                                                    name="input-1"
                                                    label="Label Text"
                                                    textarea
                                                    v-html ='sysmsg'
                                                    multi-line
                                                    >
                                                </v-text-field>
                                            </v-flex>
                                         </v-layout>
                                    </v-flex>
                                </v-layout>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-tab-item>
            <v-tab-item id="tab-2" style="max-width: 600px; margin: auto;">
                <v-container
                    fluid
                    class="mt-0 pt-0"
                    style="max-width: 600px; margin: auto; min-height: 0;"
                    grid-list-lg
                >
                    <v-layout row wrap>
                        <v-flex xs12>
                             <v-toolbar color="indigo" dark>
                                <v-toolbar-side-icon></v-toolbar-side-icon>
                                <v-toolbar-title>发送墨客消息</v-toolbar-title>
                                <v-progress-circular v-show="inProgress" indeterminate color="primary"></v-progress-circular>
                                <v-spacer></v-spacer>
                                <v-btn icon dark @click="sendTxtToNet" :disabled="!isRegister">
                                    发送
                                <v-icon>send</v-icon>
                                </v-btn>
                            </v-toolbar>
                            <v-card color="blue-grey darken-1" class="white--text">
                                <v-layout column >
                                    <v-flex xs12>
                                        <v-expansion-panel v-model='moacexpand' expand v-if="isRegister" >
                                            <v-expansion-panel-content key="account" style='max-height:50%;'>
                                                <div slot="header">
                                                    <span class='subheading'>用户地址:&nbsp;&nbsp;&nbsp;{{usernick}}</span><br>
                                                    <span class="subheading">RiG币:&nbsp;&nbsp;&nbsp;{{mytotal}} 个</span>
                                                </div>
                                                <v-card>
                                                    <v-card-text v-if='numberofitem>0'>
                                                        <span class='caption'>在墨客网络中{{$store.getters.dapps.Network}},您已发送<strong>{{numberofitem}}</strong>条永久信息.</span>
                                                        <v-select
                                                            :items="mylist"
                                                            v-model="selectedone"
                                                            label="选择查看"
                                                            item-text='id'
                                                            item-value='id'
                                                            max-height="50%"
                                                            autocomplete
                                                            single-line
                                                            @change='showOne'
                                                            >
                                                            </v-select>
                                                    </v-card-text>
                                                </v-card>
                                            </v-expansion-panel-content>
                                        </v-expansion-panel>
                                        <v-expansion-panel v-else>
                                             <v-expansion-panel-content key="account" >
                                                <div slot="header">
                                                    注册 (输入用户口令和邮件地址即可获得100 RiG 币！)
                                                </div>
                                                <v-card>
                                                    <v-container fluid>
                                                        <strong v-if='!isRegister'>墨客地址:{{coinbase}}</strong>
                                                        <v-layout row>
                                                            <v-flex xs4>
                                                                <v-subheader>口令</v-subheader>
                                                            </v-flex>
                                                            <v-flex xs8>
                                                                <v-text-field
                                                                id="moacuserpadd"
                                                                name="口令"
                                                                label="请输入口令"
                                                                v-model="moacpassword"
                                                                type="password"
                                                                ></v-text-field>
                                                            </v-flex>
                                                        </v-layout>
                                                        <v-layout row>
                                                            <v-flex xs4>
                                                                <v-subheader>邮件</v-subheader>
                                                            </v-flex>
                                                            <v-flex xs8>
                                                                <v-text-field
                                                                name="email"
                                                                v-model="moacemail"
                                                                label="请输入你的邮件地址"
                                                                value="email"
                                                                class="input-group--focused"
                                                                ></v-text-field>
                                                            </v-flex>
                                                        </v-layout>
                                                        <v-layout row>
                                                            <v-flex></v-flex>
                                                            <v-flex class="mx-auto"><v-btn @click="register">注册</v-btn></v-flex>
                                                        </v-layout>
                                                    </v-container>
                                                </v-card>
                                            </v-expansion-panel-content>
                                        </v-expansion-panel>
                                    </v-flex>
                                    <v-flex xs12 row>
                                        <v-card-text>
                                            <v-checkbox
                                                :label="`是否公开: ${openmsg}`"
                                                v-model="open"
                                            ></v-checkbox>
                                            <span>请选择速度:<strong>{{speed}}</strong></span>
                                            <v-slider v-model="gas"  step="50" ticks style='height:12px'></v-slider>
                                        </v-card-text>
                                        <v-container fluid style='max-height:75%'>
                                            <v-layout column>
                                                <v-flex xs12 >
                                                    <v-text-field
                                                    v-model="msg"
                                                    label="信息"
                                                    multi-line
                                                    auto-grow
                                                    clearable
                                                    box
                                                    >
                                                    </v-text-field>
                                                </v-flex>
                                            </v-layout>
                                        </v-container>
                                    </v-flex>
                                     <v-flex row>
                                         <v-layout class='mt-0 pa-0'>
                                             <v-flex xs2><strong>系统消息:</strong></v-flex>
                                             <v-flex xs10 text-sm-left class='mt-0 ' >
                                                 <v-text-field
                                                    color="white"
                                                    name="input-1"
                                                    label="Label Text"
                                                    textarea
                                                    v-html ='sysmsg'
                                                    multi-line
                                                    >
                                                </v-text-field>
                                            </v-flex>
                                         </v-layout>
                                    </v-flex>
                                </v-layout>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-tab-item>
            <v-tab-item id="tab-3" style="max-width: 600px; margin: auto;">
                <v-card flat id="#tab-2">
                    <v-card-text>Underconstruction...</v-card-text>
                </v-card>
            </v-tab-item>
        </v-tabs>
        <v-dialog v-model="pkd" max-width="524px" persistent>
            <v-card>
                <v-card-title>
                   请输入账户私钥，（本系统不会记录）
                </v-card-title>
                <v-card-text>
                    <v-flex xs12>
                        <v-text-field label="" v-model='yourkey' required></v-text-field>
                    </v-flex>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary" flat @click.stop="pkd=false">退出</v-btn>
                    <v-btn color="primary" flat @click.stop="confirmkey">确定</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-flex>
</template>
<script>
/* eslint-disable */
import { EventBus } from '../EventBus.js'
export default {   
  name: "mainface",
  data() {
    return {
      tabname: 'tab-1',
      ethexpand: [false, false],  // indicate expande is open or not 
      moacexpand: [false,false],
      pkd: false,
      yourkey: '',
      page: 0,
      gas: 100,
      isRegister:false,
      email:"",
      moacemail: "",
      password:"",
      moacpassword: "",
      msg: "",
      open: false,
      coinbase: "",
      balance: "",
      contractInstance: null,
      pmiInstance: null,
      pmimoacInstance: null,
      usernick:"",
      network: "",
      amount: null,
      pending: false,
      winEvent: null,
      inProgress: false,
      sysmsg: "",
      mytotal:"",
      numberofitem: "",
      decimal : 100,
      mylist:[],
      checkcount: 0,
      checkinterval: null,
      intervalhand: null,
      selectedone: null,
      pmicontract: null,
      OuputEvent: null,
      NewUserEvent: null
    };
  },
  beforeCreate: function() {
    // console.log("Before");
    var vv = this
    vv.page = 0;
    // set default dapps to eth
    EventBus.$on('init', info => {
      if (info.has) {
        window.setTimeout(function () {
            vv.$store.commit("setDapps",vv.page)
        },3000)
        }else {
          vv.sysmsg = info.msg
        }
    })
    EventBus.$once('contract', info => {
      vv.sysmsg = info.msg
      if (info.result && vv.page == 0) {
          console.log(vv.$store.getters.dapps.instance())
          vv.$store.getters.dapps.instance().eth.getCoinbase((err,co) => {
              if (err) {
                  vv.showErr('获取coinbase失败，请重试')
              }else {
                  vv.coinbase = co
                  let getContract = new Promise(function (resolve, reject) {
                    let web3 = new Web3(window.web3.currentProvider)
                    let ccontract = web3.eth.contract(vv.$store.getters.dapps.ABI)
                    let ccinstance = ccontract.at(vv.$store.getters.dapps.address)
                    resolve(ccinstance)
                  })
                  vv.contractinstance = getContract.then(result => {
                      vv.contractInstance = () => result
                      vv.checkLogin()
                  })
              }
          })
        }else {
            console.log('智能合约初始化失败')
            vv.showErr('智能合约初始化失败')
        }
    })
   
  },
  mounted: function() {
    var vv = this;
    vv.inProgress = true;
    vv.sysmsg = "连接测试网路..."
    vv.$store.dispatch('initEth')  // first in eth
  },
  computed: {
    speed: function() {
      if (this.gas === 50) {
        return "中速";
      } else if (this.gas === 0) {
        return "慢";
      } else if (this.gas === 100) {
        return "快";
      }
      return "";
    },
    web3: function () {
      return this.$store.getters.Web3;
    },
    openmsg: function () {
        if (this.open) {
            return "信息将公开"
        }else{
            return "不公开"
        }
    }
  },
  methods: {
    tabchange: function(e) {
        var vv = this
        this.inProgress = true
        vv.expand = false 
        vv.msg = '' 
        vv.sysmsg = "正在转换发布网络．．．"
        console.log(e)
        if (e === 'tab-1'){
            console.log('以太网')
            vv.page = 0
            vv.isRegister = false
            vv.numberofitem = 0
            vv.coinbase = null
            vv.contractInstance = null
            EventBus.$once('contract', info => {
                vv.sysmsg = info.msg
                if (info.result) {
                    vv.$store.getters.dapps.instance().eth.getCoinbase((err,co) => {
                        if (err) {
                            vv.showErr('获取coinbase失败，请重试')
                        }else {
                            vv.coinbase = co
                            // vv.contractinstance = vv.$store.getters.dapps.instance().eth.contract(vv.$store.getters.dapps.ABI).at(vv.$store.getters.dapps.address)
                            let getContract = new Promise(function (resolve, reject) {
                                let web3 = new Web3(window.web3.currentProvider)
                                let ccontract = web3.eth.contract(vv.$store.getters.dapps.ABI)
                                let ccinstance = ccontract.at(vv.$store.getters.dapps.address)
                                resolve(ccinstance)
                            })
                            vv.contractinstance = getContract.then(result => {
                                vv.contractInstance = () => result
                                vv.checkLogin()
                            })
                            // vv.OutputEvent = vv.contractInstance.Output()
                            // vv.NewUserEvent = vv.contractInstance.Newuser()
                        }
                    })
               }else {
                    console.log('智能合约初始化失败')
                    vv.showErr('智能合约初始化失败')
                }
                vv.inProgress = false
            })
            this.$store.dispatch('initEth')
        }else if (e === 'tab-2') {
            console.log('墨客')
            vv.page = 1
            vv.isRegister = false
            vv.numberofitem = 0
            vv.coinbase = null
            vv.contractInstance = null
            EventBus.$once('contract', info => {
                vv.sysmsg = info.msg
                if (info.result && vv.page == 1) {
                    let co = vv.$cookie.get('PMI')
                    if (co) {
                         vv.coinbase = co
                         let getmoacContract = new Promise(function (resolve, reject) {
                            let chain3 = new Chain3(new Chain3.providers.HttpProvider(window.ChainServer))
                            let ccontract = chain3.mc.contract(vv.$store.getters.dapps.ABI)
                            let ccinstance = ccontract.at(vv.$store.getters.dapps.address)
                            resolve(ccinstance)
                        })
                        vv.contractinstance = getmoacContract.then(result => {
                            vv.contractInstance = () => result
                            vv.sysmsg = '墨客网络准备完毕'
                            vv.checkLogin()
                            vv.OutputEvent = vv.contractInstance().Output()
                            vv.NewUserEvent = vv.contractInstance().Newuser()
                        })
                        
                    }else {
                        vv.showErr("没有设定墨客钱包！请到设置页面去设定墨客帐号．")
                    }
                }else {
                        console.log('智能合约初始化失败')
                        vv.showErr('智能合约初始化失败')
                }
                vv.inProgress = false
            })
            this.$store.dispatch('initMoac')
        }else {
            vv.page = 2
            console.log('EOS')
            vv.isRegister = false
            vv.numberofitem = 0
            vv.coinbase = null
            vv.contractInstance = null
        }
    },
    eth_getAccountStatus: function() {
        var vv = this
        let m = vv.contractInstance().AccountStatus(
                {
                    value: 0,
                    from: vv.coinbase
                },
                ( err,result ) => {
                    if (err){
                        vv.inProgress = false
                        vv.sysmsg ='<span color="red">'+err+'</span>'
                    }else{
                        vv.mytotal = result[1].toNumber()
                        if (vv.mytotal>0){   
                            vv.isRegister = true
                            vv.numberofitem = result[2].toNumber()
                            vv.usernick = result[0]
                            vv.sysmsg = 'Welcome:' + vv.usernick
                            for (var i=1;i<vv.numberofitem+1;i++) {
                                vv.mylist.push({id:i,title:""})
                            }
                        }else {
                            vv.showErr('用户未注册')
                        }    
                        vv.inProgress = false  
                    }
                }
            )
    },
    moac_getAccountStatus: function () {
        var vv = this
        let m = vv.contractInstance().AccountStatus({ from: vv.coinbase})
        console.log(m)
        if (m[1].toNumber() == -1) {
            vv.isRegister = false
        }else{
            vv.mytotal = m[1].toNumber()
            if (vv.mytotal>0){   
                vv.isRegister = true
                vv.numberofitem = m[2].toNumber()
                vv.usernick = m[0]
                vv.sysmsg = 'Welcome:' + vv.usernick
                for (var i=1;i<vv.numberofitem+1;i++) {
                    vv.mylist.push({id:i,title:""})
                }
            }else {
                vv.showErr('用户未注册')
            }    
           
        }
        vv.inProgress = false
    },
    checkLogin: function () {
        var vv = this 
         if (vv.$store.getters.dapps) {
            vv.inProgress = true;
            vv.sysmsg = "检查账户"
            if (vv.page == 0 ) {
                vv.eth_getAccountStatus()
            }else if (vv.page == 1) {
                vv.moac_getAccountStatus()
            }
        }
    },
    pollContract: function() {
        var vv = this
        if (vv.contractInstance) {
            console.log('polling use address:'+vv.coinbase)
            let m = vv.contractInstance().AccountStatus(
                {
                    from: vv.coinbase
                },
                ( err,result ) => {
                    console.log(result)
                    if (!err){
                        vv.mytotal = result[1].toNumber()
                        if (vv.mytotal>0){   
                            vv.numberofitem = result[2].toNumber()
                            vv.usernick = result[0]
                            vv.mylist=[]
                            for (var i=1;i<vv.numberofitem+1;i++) {
                                vv.mylist.push({id:i,title:""})
                            }
                        }
                    }
                }
            )
        }
    },
    _callContract: function(chain3, contractAddress, account, abiString, anotherAddress, amount){
        var address = account.address;
        var abi = JSON.parse(abiString);
        var contract = chain3.mc.contract(abi);
        var token = contract.at(contractAddress);

        var data = token.transfer.getData(anotherAddress, amount);
        console.log('data', data);
        var txCount = chain3.mc.getTransactionCount(account.address);
        var rawTx = {
            nonce: chain3.intToHex(txCount),
            gasPrice: chain3.intToHex(25000000000),
            gasLimit: chain3.intToHex(1000000),
            to: contractAddress,
            data: data,
            chainId: chain3.version.network
        };
        var signedTx = chain3.signTransaction(rawTx, account.secret);
        chain3.mc.sendRawTransaction(signedTx, function(err, hash) {
            if (!err){
                console.log("succeed: ", hash);
                var filter = chain3.mc.filter('latest');
                filter.watch(function(error, result) {
                    var receipt = chain3.mc.getTransaction(hash);
                    if (!error && receipt && receipt.blockNumber != null) {
                    console.log("done.");
                    filter.stopWatching();
                    process.exit(0);
                    }
                });
            }else{
                console.log("error:", err.message);
            }
        });
    },
    register: function() {
        var vv = this 
         if (vv.$store.getters.dapps) { 
            if (vv.page == 0) {
                if (!(vv.password && vv.email)){
                    vv.sysmsg = "请输入口令和邮件地址，再点击注册"
                    return
                }
                vv.sysmsg = "注册中. ．．"
                vv.inProgress = true
                let m = vv.contractInstance().Register(
                    vv.email,
                    vv.password,
                    vv.email,
                    {   
                        gas:150000,
                        value: 0,
                        from: vv.coinbase
                    },
                    ( err,result ) => {
                        if (err){
                            vv.inProgress = false
                            vv.showErr(err)
                        }else{
                            console.log(result)
                            vv.inProgress = false
                            vv.sysmsg = "注册成功"
                            setTimeout(vv.checkLogin(),2000)
                        }
                    }
                )
            }else if (vv.page == 1) {
                if (!(vv.moacpassword && vv.moacemail)){
                    vv.sysmsg = "请输入口令和邮件地址，再点击注册"
                    return
                }
                vv.sysmsg = "注册中. ．．"
                vv.inProgress = true
                vv.moac_register()
            }
        }
    },
    getAccountSecret: function() {
        var vv = this
        var secret = vv.$cookie.get("PMIpass") 
        if (!secret) {
            vv.showErr("\n需要账户私钥，请输入(private key)")
            vv.pkd = true
            return vv.yourkey
        } else {
            return secret
        }
    },
    confirmkey: function() {
        var vv = this
        this.pkd = false
        if (vv.yourkey){
            console.log(vv.yourkey)
        }else{
            console.log(vv.yourkey)
        }
    },
    callContractMethod:function(src, contractAddress, gasValue,amount, inchainID, inByteCode){
        var vv = this
        console.log("addr:", src["addr"])
        let chain3 = this.$store.getters.dapps.instance()
        var txcount = chain3.mc.getTransactionCount(src["addr"]);
        console.log("Get tx account", txcount)
        //Build the raw tx obj
        //note the transaction
        var rawTx = {
            from: src.addr,
            to: contractAddress, 
            nonce: chain3.intToHex(txcount),
            gasPrice: chain3.intToHex(400000000),
            gasLimit: chain3.intToHex(gasValue),
            value: chain3.intToHex(chain3.toSha(amount,'mc')),
            data: inByteCode,
            chainId: chain3.intToHex(inchainID)
        }
        console.log(rawTx);
        var cmd1 = chain3.signTransaction(rawTx, src["key"]);    
        console.log("\nSend signed TX:\n", cmd1);
        chain3.mc.sendRawTransaction(cmd1, function(err, hash) {
            if (!err){     
                console.log("发送成功! Hash: ", hash)
                vv.inProgress = true
                let count = 0       
                let intervalhand = setInterval(function () {
                    vv.$store.getters.dapps.instance().mc.getTransactionReceipt(hash, function (err, value) {
                        console.log(err)
                        console.log(value)
                        if (value != null) {
                            if (value.status == '0x1'){
                                vv.sysmsg = "注册已成功!\n" 
                                vv.sysmsg += '你的信息在块:'+value.blockHash +'中<br/>\n'
                                vv.sysmsg += '本次注册使用了:'+value.gasUsed +'gas'
                                setTimeout(vv.pollContract(), 1000)
                            }else {
                                vv.showErr("<br>注册失败，多数情况是out of gas,请添加gas 重新发布!" )      
                                count =0
                            }
                            clearInterval(intervalhand)
                            vv.inProgress = false
                        }else {
                            count++
                            console.log(count)
                            if (count > 100) {
                                clearInterval(intervalhand)
                                vv.showErr('<br>状态获取超时,请检查')
                                vv.inProgress = false
                            }
                        }
                    })
                },3000)
                return hash;
            }else{
                console.log("Chain3 error:", err.message);
                vv.showErr("请为您的墨客账户充１个墨客，在网上发永久信息还是需要一些成本的")
                vv.inProgress = false
                return err.message
            }
            console.log("Get response from MOAC node in the feedback function!")
                // res.send(response);
        });
    },
    moac_register: function() {
        var vv = this
        let cc3 = vv.$store.getters.dapps.instance()
        var coinbase = vv.$cookie.get("PMI")
        
        if (!coinbase) {
            vv.showErr("没有设置墨客账户．")
            return
        }
        var secret = vv.$cookie.get("PMIpass")
        if (!secret) {
            // vv.showErr("没有输入私钥,请输入")
            vv.pkd = true
            return
        }
        var src = {
            'addr': vv.coinbase,
            'key': secret
        }
    
        vv.NewUserEvent.watch(function(error, result){
            console.log("event")
            console.log(err)
            console.log(result)
            if (!error)
                {
                  vv.showErr(result)
                } else {
                   vv.showErr(error)
                }
        })
        vv.inProgress = true
        var data=vv.contractInstance().Register.getData(vv.moacemail, vv.moacpassword, vv.moacemail)
        vv.callContractMethod(src, vv.$store.getters.dapps.address, '9000000', 0 , vv.$store.getters.dapps.instance().version.network , data)
    },
    getBalance: function () {
        var vv = this 
        if (vv.contractinstance) {
            vv.inProgress = true
            vv.sysmsg = "检查账户"
            let m = vv.contractInstance().balanceOf(
                vv.coinbase,
                {
                    gas: 300000,
                    from: vv.coinbase
                },
                ( err,result ) => {
                    if (err){
                        vv.showErr(err)
                        vv.inProgress = false;
                    }else{
                        vv.mytotal = result
                        vv.inProgress = false;
                        vv.sysmsg = "";
                    }
                }
            ) 
        }
    },
    sendTxtToNet(event) {
      var vv = this
      this.winEvent = null
      this.pending = true
      let checkinterval = null
      let checkingTx = function(result) {
          if (result) {
              clearInterval(checkinterval)
              vv.sysmsg += "<br>信息已成功发布！"
          }else {
              vv.checkcount++
              if (vv.checkcount >500){
                  clearInterval(checkinterval)
              }  
          }
      }
      console.log('信息内容大小为:'+encodeURI(vv.msg).length)
      if (vv.page == 0 ) {
            if (vv.contractinstance) {
                let m = vv.contractInstance().OneRaiseHand(
                        encodeURI(vv.msg),
                        vv.open,
                        {
                            gas: 3200000+(vv.gas/100)*900000,
                            value: 0,
                            from: vv.coinbase
                        },
                        (err, result) => {
                            // console.log(result)
                            if (err) {
                                console.log(err);
                                this.pending = false;
                                vv.showErr( '信息发布失败')
                            } else {
                                // console.log("OK, please check address:"+result)
                                vv.sysmsg = '永久信息正在发布，交易地址为: '+result
                                vv.sysmsg += '<br>注意请查询ethscan 中的交易信息，留言可能会因为费用不够而失败，请等待'
                                vv.inProgress = true
                                //console.log(vv.$store.getters.dapps.instance())
                                
                                vv.intervalhand = setInterval(function () {
                                    vv.$store.getters.dapps.instance().eth.getTransactionReceipt(result, function (err, value) {
                                        if (value != null) {
                                            if (value.status=='0x1'){
                                                clearInterval(vv.intervalhand)
                                                console.log(value)
                                                vv.sysmsg = "<br>信息已成功发布!" 
                                                vv.sysmsg += '你的信息在块:'+value.blockHash +'中<br/>'
                                                vv.sysmsg += '本次发布使用了:'+value.gasUsed +'gas'
                                                vv.inProgress = false
                                                vv.checkcount=0
                                                setTimeout(vv.pollContract(), 1000)
                                            }else {
                                                vv.showErr("<br>信息发布失败，多数情况是out of gas,请添加gas 重新发布!" )
                                                clearInterval(vv.intervalhand)
                                                vv.checkcount =0
                                            }
                                        }else {
                                            vv.checkcount++
                                            console.log(vv.checkcount)
                                            if (vv.checkcount > 100) {
                                                clearInterval(vv.intervalhand)
                                                vv.showErr('<br>状态获取超时,请检查')
                                                vv.inProgress = false
                                            }
                                        }
                                    })
                                },5000)
                            }
                        }
                )
            }
      } else if (vv.page == 1 ) {
          vv.moac_sendtxt(vv.coinbase, vv.msg, vv.open, 4500000+(vv.gas/100)*900000)
      }
      
    },
    moac_sendtxt(coinbase, msg, open, gas) {
        var vv = this
        let cc3 = vv.$store.getters.dapps.instance()
        var coinbase = vv.$cookie.get("PMI")
        if (!coinbase) {
            vv.showErr("没有设置墨客账户．")
            return
        }
        var secret = vv.$cookie.get("PMIpass")
        if (!secret) {
            // vv.showErr("没有输入私钥,请输入")
            vv.pkd = true
            return
        }
        var src = {
            'addr': vv.coinbase,
            'key': secret
        }
        vv.NewUserEvent.watch(function(error, result){
            console.log("event")
            console.log(err)
            console.log(result)
            if (!error)
                {
                  vv.showErr(result)
                } else {
                   vv.showErr(error)
                }
        })
        vv.inProgress = true
        var data=vv.contractInstance().OneRaiseHand.getData(msg, open)
        //vv.callContractMethod(src, vv.$store.getters.dapps.address, '9000000', 0 , vv.$store.getters.dapps.instance().version.network , data)

        let chain3 = vv.$store.getters.dapps.instance()
        var txcount = chain3.mc.getTransactionCount(src["addr"]);
        var rawTx = {
            from: src.addr,
            to: vv.$store.getters.dapps.address, 
            nonce: chain3.intToHex(txcount),
            gasPrice: chain3.intToHex(400000000),
            gasLimit: chain3.intToHex(gas),
            value: chain3.intToHex(chain3.toSha(0,'mc')),
            data: data,
            chainId: chain3.intToHex(vv.$store.getters.dapps.instance().version.network)
        }
        console.log(rawTx);
        var cmd1 = chain3.signTransaction(rawTx, src["key"]);    
        // console.log("\nSend signed TX:\n", cmd1);
        chain3.mc.sendRawTransaction(cmd1, function(err, hash) {
            if (!err){
                console.log("发送成功! Hash: ", hash)
                vv.inProgress = true
                let count = 0
                let intervalhand = setInterval(function () {
                    vv.$store.getters.dapps.instance().mc.getTransactionReceipt(hash, function (err, value) {
                        console.log(err)
                        console.log(value)
                        if (value != null) {
                            if (value.status == '0x1'){
                                vv.sysmsg = "注册已成功!\n" 
                                vv.sysmsg += '你的信息在块:'+value.blockHash +'中<br/>\n'
                                vv.sysmsg += '本次注册使用了:'+value.gasUsed +'gas'
                                setTimeout(vv.pollContract(), 1000)
                            }else {
                                vv.showErr("<br>注册失败，多数情况是out of gas,请添加gas 重新发布!" )      
                                count =0
                            }
                            clearInterval(intervalhand)
                            vv.inProgress = false
                        }else {
                            count++
                            console.log(count)
                            if (count > 100) {
                                clearInterval(intervalhand)
                                vv.showErr('<br>状态获取超时,请检查')
                                vv.inProgress = false
                            }
                        }
                    })
                },3000)
                return hash;
            }else{
                console.log("Chain3 error:", err.message);
                vv.showErr("请为您的墨客账户充１个墨客，在网上发永久信息还是需要一些成本的")
                vv.inProgress = false
                return err.message
            }
            console.log("Get response from MOAC node in the feedback function!")
                // res.send(response);
        });
    },
    showErr: function (msg) {
        this.sysmsg += '<br><p color="red">'+msg+'</p>'
    },
    showOne: function(w) {
        var vv = this
        vv.selectedone=w
        if (vv.contractinstance && vv.selectedone) {
            vv.inProgress = true;
            vv.sysmsg = "获取智能合约及其内容"
            if (vv.page == 0) {
                let m = vv.contractInstance().getStuff(
                    vv.selectedone-1,
                    {
                        gas: 300000,
                        from: vv.coinbase
                    },
                    ( err,result ) => {
                        if (err){
                            console.log(err)
                            vv.inProgress = false;
                            vv.showErr(err)
                        }else{
                            console.log(result)
                            vv.pmicontract = result[0]
                            let open = result[1]
                            let diget = result[2]
                            let time = result[3]
                            vv.msg = ''
                            var date = new Date(time * 1000)
                            vv.msg = '创建于' + date.toString()+"\n"
                            vv.inProgress = false
                            vv.sysmsg = "获取智能合约："+ vv.pmicontract.toString()
                            let getPmiContract = new Promise(function (resolve, reject) {
                                let web3 = new Web3(window.web3.currentProvider)
                                let ccontract = web3.eth.contract(vv.$store.getters.dapps.PMIABI)
                                let ccinstance = ccontract.at(vv.pmicontract)
                                resolve(ccinstance)
                            })
                            vv.contractinstance = getPmiContract.then(result => {
                                vv.pmiInstance = () => result
                                /* vv.contractInstance().AccountStatus({}, (err, result) => {
                                console.log(result)
                                }) */
                                vv.getPmiInfo()
                            }) 
                        }
                    }
                )
            } else if ( vv.page == 1 ) {
                vv.moac_getstuff(w)
            }
        }
    },
    moac_getstuff( id ){
        var vv = this
        let m = vv.contractInstance().getStuff(
                id-1,
                {
                    gas: 300000,
                    from: vv.coinbase
                },
                ( err,result ) => {
                        if (err){
                            console.log(err)
                            vv.inProgress = false;
                            vv.showErr(err)
                        }else{
                            console.log(result)
                            vv.pmicontract = result[0]
                            let open = result[1]
                            let diget = result[2]
                            let time = result[3]
                            vv.msg = ''
                            var date = new Date(time * 1000)
                            vv.msg = '创建于' + date.toString()+"\n"
                            vv.inProgress = true
                            vv.sysmsg = "获取智能合约："+ vv.pmicontract.toString()
                            let getPmimoacContract = new Promise(function (resolve, reject) {
                                let chain3 = new Chain3(new Chain3.providers.HttpProvider(window.ChainServer))
                                let ccontract = chain3.mc.contract(vv.$store.getters.dapps.PMIABI)
                                let ccinstance = ccontract.at(vv.pmicontract)
                                resolve(ccinstance)
                            })
                            let pmiinstance = getPmimoacContract.then(result => {
                                vv.pmimoacInstance = () => result
                                /* vv.contractInstance().AccountStatus({}, (err, result) => {
                                console.log(result)
                                }) */
                                vv.pmimoacInstance().readMsg(
                                    vv.coinbase,
                                    (err, value) => {
                                        vv.msg += '合约内容:\n'+ decodeURI(value)
                                        vv.inProgress = false
                                    }
                                )
                            }) 
                        }
                }
                ) 
    },
    getPmiInfo: function() {
        var vv = this
        vv.pmiInstance().readMsg(
            vv.coinbase,
            (err, value) => {
                vv.msg += '合约内容:\n'+ decodeURI(value)
            }
        )
    }
  }
};
</script>

<style scoped>
textarea {
   font-size: 24pt;
   font-family: Arial;
}
</style>
