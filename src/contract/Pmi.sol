pragma solidity ^0.4.24;

// ----------------------------------------------------------------------------
// 'Pmi' token contract
//
// Deployed to : 
// Symbol      : PMFa
// Name        : Pmi Factory
// Total supply: 100000000
// Decimals    : 18
//
// Enjoy.
//
// (c) by Gao Ji Hua Endroid Ltd 2018. The MIT Licence.
// ----------------------------------------------------------------------------


import "github.com/willitscale/solidity-util/lib/Strings.sol";


contract Pmi {
 using Strings for string;
 address owner;
 uint _timestamp;
 uint modified;
 bool hasWord;
 string _title;
 uint64 Max = 65535;
 uint Try=4;
 string  _content;   //user content
 address[] Grantees;  //those who can see the content
 bool open;
 uint i;
 
 mapping (address => uint256) private GranteeIndexes;
  
//Our access modifier is present, only the contract creator can use this function
 function kill() public Owned { 
    selfdestruct(owner);
 }
 
 constructor(address sender,bool o,string con) public {
    owner = sender;
    hasWord = false;
    open = o;
    _content = con;
 }

 function writeMsg(address sender,string con) public  returns(bool) {
    require(
        sender == owner &&
        hasWord == false
    );
    _content = con;
    _timestamp = now;
    hasWord = true;
    return true;
 }
 
 function modifyMsg(address sender ,string con) public  returns(bool){
     require(sender == owner);
     if (modified > Try) {
         return false;
     }else{
         
        if (bytes(con).length>0 && bytes(con).length<Max){
             _content = con;
             _timestamp = now;
        }
        modified = modified +1;
     }
 }
 
 function readMsg(address sender) constant public returns (bool,string){
     require(sender == owner);
     if (hasWord || bytes(_content).length > 0){
         return (true,_content);
     }else{
         return (false,"");
     }
 }
 
 function s(string str) public returns (bool){
     require(open);
     if (_content.indexOf(str)>=0) {
         return true;
     }else{
         return false;
     }
     
 }
 
 function isGrant(address one) internal returns(bool){
    for (i=0;i<Grantees.length;i++){
        if (Grantees[i]==one) {
            return true;
        }
    }    
    return false;
 }
 
 function addAddress(address _addr) internal returns(bool) {
    uint id = Grantees.length;
    GranteeIndexes[_addr] = id;
    Grantees.push(_addr);
}

function removeAddress(address _addr) internal returns(bool) {
    uint id = GranteeIndexes[_addr];
    delete Grantees[id];
}
 
 function grant(address sender,address to){
     require(sender == owner &&
             isGrant(to)
     );
     addAddress(to);
 }
 
  //Access modifier 
 modifier Owned {
  require(msg.sender == owner);
  _;
 }
}
