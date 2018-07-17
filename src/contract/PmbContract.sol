pragma solidity ^0.4.24;
import "./Ownable.sol";
import "./Pmi.sol";

library SafeMath {
    function add(uint a, uint b) internal pure returns (uint c) {
        c = a + b;
        require(c >= a);
    }
    function sub(uint a, uint b) internal pure returns (uint c) {
        require(b <= a);
        c = a - b;
    }
    function mul(uint a, uint b) internal pure returns (uint c) {
        c = a * b;
        require(a == 0 || c / a == b);
    }
    function div(uint a, uint b) internal pure returns (uint c) {
        require(b > 0);
        c = a / b;
    }
}


contract ERC20Interface {
  function transferFrom(address _from, address _to, uint _value) returns (bool){}
  function transfer(address _to, uint _value) returns (bool){}
  function ERC20Interface(){}
}


contract PMBullet is ERC20Interface,Ownable {
  using SafeMath for uint;
  using Strings for string;
  address owner;
  string public name = "Pmi Coin"; 
  string public symbol = "RiG";
  uint public decimals = 2;
  uint public INITIAL_SUPPLY = 10000000 * (10 ** decimals);
  uint256 DigestLen = 140;
  uint256 AirDropNumber = 10000;
  
  struct PmiEntry {
      address pmi;
      bool open;
      bool killed;
      string digest;
      uint time;      //timestamp for creation
  }
  
  struct userEntry{
      string name;
      bytes32 pass;
      string email;
      bool active;
  }
  
  
  
  uint256 _totalSupply;
  
  mapping (address => PmiEntry[]) private _datastore;
  mapping (address => userEntry) public _userstore;
  mapping (address => uint256) balances;
  mapping(address => mapping (address => uint256)) allowed;


  
  constructor() public payable{
    owner = msg.sender;
    _totalSupply = INITIAL_SUPPLY;
    balances[owner] = INITIAL_SUPPLY;
    
    _userstore[msg.sender] =userEntry({
                                name:"pmbpp", 
                                pass:keccak256("pmbingress"),
                                email:"admin@endroid.com",
                                active:true
                            });
  }
     
  function totalSupply() constant returns (uint256 totalSupply) {
        totalSupply = _totalSupply;
  }
  
      // What is the balance of a particular account?
  function balanceOf(address _owner) constant returns (uint256 balance) {
        return balances[_owner]/(10**decimals);
  }
  
 
  
      // Transfer the balance from owner's account to another account
  function transfer(address _to, uint256 _amount) returns (bool success) {
        if (balances[msg.sender] >= _amount 
            && _amount > 0
            && balances[_to] + _amount > balances[_to]) {
            balances[msg.sender] -= _amount;
            balances[_to] += _amount;
            Transfer(msg.sender, _to, _amount);
            return true;
        } else {
            return false;
        }
  }
 
 
  function transferFrom(
        address _from,
        address _to,
        uint256 _amount
    ) returns (bool success) {
        if (balances[_from] >= _amount
            && _amount > 0
            && balances[_to] + _amount > balances[_to]) {
            balances[_from] -= _amount;
            balances[_to] += _amount;
            Transfer(_from, _to, _amount);
            return true;
        } else {
            return false;
        }
  }


  
  event Transfer(address indexed _from, address indexed _to, uint _value);
  event EndMinting( uint timestamp );

  /*function mint( address[] recipients ) onlyOwner {
    uint newRecipients = 0;
    for( uint i = 0 ; i < recipients.length ; i++ ){
      address recipient = recipients[i];
      if( balanceOf[recipient] == 0 ){
        Transfer( address(0x0), recipient, 1 );
        balanceOf[recipient] = 1;
        newRecipients++;
      }
    }

    totalSupply += newRecipients;
  }

  function endMinting() onlyOwner {
    transferOwnership(address(0xdead));
    EndMinting(block.timestamp);
  }*/

  /*function burn() {
    require(balances[msg.sender] == 1 );
    Transfer( msg.sender, address(0x0), 1 );
    balances[msg.sender] = 0;
    totalSupply--;
  }*/
 
  function emergencyERC20Drain() private returns(bool){
      require(bytes(_userstore[msg.sender].name).length>0);
      if (balances[owner] >= 100) {
            transferFrom(owner,msg.sender, AirDropNumber);
            return true;
        } else {
            return false;
        }
  }


  // ERC20 stubs
  //function transfer(address _to, uint _value) returns (bool){ revert(); }
  //function transferFrom(address _from, address _to, uint _value) returns (bool){ revert(); }
  function approve(address _spender, uint _value) returns (bool){ return true; }
  
  function allowance(address _owner, address _spender) constant returns (uint){return 0;} 

  
  event Approval(address indexed _owner, address indexed _spender, uint _value);
  
  
  function Register(string user,string pass,string email) public payable returns(bool){
     require(msg.sender != owner);
 
     if (bytes(_userstore[msg.sender].name).length>0) 
        revert();
    
     _userstore[msg.sender]=userEntry({name:user, pass:keccak256(pass),email:email,active:true});
     balances[msg.sender]=0;
    
     emergencyERC20Drain();   //register and get the coin
   
  }
  
  
  function Digest(string str) internal returns(string){
      
      if (str.length()>DigestLen){
          return str.substring(int(DigestLen));
      }else{
          return str;
      }
      
  }
  
  function OneRaiseHand(string str,bool open) public payable returns(address instant) {
    
    require(2 <= balances[msg.sender]);   //send 1 coin to say something readonly, 2 for open

    Pmi apmi = new Pmi(msg.sender,open,str);
    //bool setok = apmi.call.gas(900764)(bytes4(keccak256("writeMsg(address,string)")), msg.sender,str);
    //if (setok){
        _datastore[msg.sender].push(PmiEntry({
                                    pmi:address(apmi),
                                    open:open,
                                    digest:Digest(str),
                                    killed:false,
                                    time:now
                                }));

    if (open){
        balances[msg.sender] = balances[msg.sender]-200;
    }else{
        balances[msg.sender] = balances[msg.sender]-100;
    }
    //}
    return (apmi);
    
  }
  
  function AccountStatus() constant public returns(int balance,string email,uint256 total,address an1,address an2) {
      userEntry auser = _userstore[msg.sender];
      if (auser.active){
          email = _userstore[msg.sender].email;
          
          balance = int(balanceOf(msg.sender));
          
          total = _datastore[msg.sender].length;
          
          if (total>1){
              an1 = _datastore[msg.sender][0].pmi;
          }else{
              an1=address(0);
          }
          
      }else{
          balance = -1;
      }
      
  }
  
  function getStuff(uint index) constant public returns(address pmi,bool open,string title,uint time){
      
      require(_userstore[msg.sender].active && index < _datastore[msg.sender].length);
      
      PmiEntry one = _datastore[msg.sender][index];
      if (!one.killed){
          pmi = one.pmi;
          open = one.open;
          title = one.digest;
          time = one.time;
          
      }
  }
}




