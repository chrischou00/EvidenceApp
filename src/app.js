App = {
  web3Provider: null,
  contracts: {},

  init: async function () {
    const node = await Ipfs.create({ repo: String(Math.random() + Date.now()) })

    console.log('IPFS node is ready');
    window.node = node;
    return App.initWeb3();
  },

  // Step 1：實作初始化 web3
  initWeb3: async function () {
    if (ethereum) {
      web3 = new Web3(ethereum);
      try {
        //  https://bit.ly/2QQHXvF
        console.log('ethereum.enable()');
        const accounts = await ethereum.enable();
        web3.eth.defaultAccount = accounts[0];
      } catch (error) {}
    } else if (web3) {
      console.log('load web3.currentProvider');
      web3 = new Web3(web3.currentProvider);
    } else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
    App.web3Provider = web3.currentProvider
    web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  // Step 2：實例化智能合約
  initContract: function () {
    fetch('Evidence.json')
      .then(function(res) {
        return res.json();
      })
      .then(function(data){
        var GiveArtifact = data;
        console.log(GiveArtifact);
        App.contracts.Cert = TruffleContract(GiveArtifact);
        App.contracts.Cert.setProvider(App.web3Provider);
        
      });
    //return App.bindEvents();
  },
  submit: async function(){
    var tex = document.getElementById("ip");
    var times = tex.files.length;
    var i = 0;
    while(i < times)
    {
      for await (const file of node.add(tex.files[i])){
        if (file && file.cid) {
            console.log('successfully stored', file.cid)
    
            await App.display(file.cid,i)
            i++;
        }
      }
    }
  },
  display: async function(cid,times) {
    for await (const data of node.cat(cid)) {
      //document.getElementById('cid').innerText = document.getElementById('cid').innerText + cid + "\n";
      //document.getElementById('content').insertAdjacentHTML("afterend", "<img src = https://ipfs.io/ipfs/"+cid+">");
      if(times==0)
      {
        var name = document.getElementById("name").value;
        var num = document.getElementById("num").value;
        var about = document.getElementById("about").value;
        web3.eth.getAccounts(function(error, accounts){
          if(error)
          {
            console.log(error);
          }
          var account = accounts[0];
          
          App.contracts.Cert.deployed().then(function(instance){
            return instance.add(name, cid.string, num, about, {from: account, gas: 5000000});
          })
          .then(function(result){
            App.contracts.Cert.deployed().then(function(instance){
              return instance.show_case_num().call();
            })
            .then(function(result){
              alert("證據已成功上傳! 案件編號為"+result[0]);
            })
          })
        })
      }
    }
        
      

  }

  /*AddAttribute: function(){
    var name = document.getElementById("name").value;
    var data = document.getElementById("data").value;
    web3.eth.getAccounts(function(error, accounts){
      if(error)
        console.log(error);
      var account = accounts[0];
      App.contracts.Cert.deployed().then(function(instance){
        return instance.addAttribute(name, data, {from: account, gas: 5000000});
      })
      .then(function(result){
        console.log(result);
        alert("Success!!");
      })
    })
    
  },
  revoke: function(){
    var sign_id = document.getElementById("sign_id").value;
    var target = document.getElementById("sign_target").value;
    web3.eth.getAccounts(function(error, accounts){
      if(error)
         console.log(error);
      var account = accounts[0];
      console.log(sign_id, target)
      App.contracts.Cert.deployed().then(function(instance){
        return instance.revokeSignature( target ,sign_id, {from: account, gas: 8000000});
      })
      .then(function(result){
        alert("Successful!");
      })
    })
  },

  ShowAttribute: function(){
    var target = document.getElementById("target").value;
    var id = document.getElementById("attr_id").value;
    var cont = document.getElementById("cont");
    web3.eth.getAccounts(function(error, accounts){
      if(error)
         console.log(error);
      var account = accounts[0];
      App.contracts.Cert.deployed().then(function(instance){
        return instance.getAttribute(target, id, {gas: 50000});
      })
      .then(function(result){
        var date = new Date(result[2]*1000);
        var hours = date.getHours();
        // Minutes part from the timestamp
        var minutes = "0" + date.getMinutes();
        // Seconds part from the timestamp
        var seconds = "0" + date.getSeconds();

        // Will display time in 10:30:23 format
        var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

        cont.innerHTML = "Attribute type: " + result[0] + "<br>" + "Attribute data: "+result[1]+"<br>"+
                         "Extend deadline: "+ date.toString() + "<br>" + "Signature num: " + result[3]+"<br>";
      })
      .catch(function(err){
        cont.innerHTML = "Error!";
      })
    })
  },

  Sign: function(){
    var sign_id = document.getElementById("sign_id").value;
    var target = document.getElementById("sign_target").value;
    web3.eth.getAccounts(function(error, accounts){
      if(error)
         console.log(error);
      var account = accounts[0];
      console.log(sign_id, target)
      App.contracts.Cert.deployed().then(function(instance){
        return instance.Sign( target ,sign_id, {from: account, gas: 5000000, value: 100000000000000000});
      })
      .then(function(result){
        alert("Sign successful!");
      })
    })
  },

  updateAttribute: function(){
    var time_id = document.getElementById("time_id").value;
    var data = document.getElementById("update_data").value;

    web3.eth.getAccounts(function(error, accounts){
      if(error)
         console.log(error);
      var account = accounts[0];
      App.contracts.Cert.deployed().then(function(instance){
        console.log(time_id, data);
        return instance.updateAttribute( time_id, data, {from: account, gas: 500000});
      })
      .then(function(result){
        alert("update successful!");
      })
    })
  },
  
  Extend_time: function(){
    var time_id = document.getElementById("time_id").value;
    var cont = document.getElementById("cont2");
    web3.eth.getAccounts(function(error, accounts){
      if(error)
         console.log(error);
      var account = accounts[0];
      App.contracts.Cert.deployed().then(function(instance){
         return instance.need(time_id, {from: account, gas:500000});
      })
      .then(function(result){
        App.contracts.Cert.deployed().then(function(instance){
          console.log(result);
          console.log(result*100000000000000000);
          console.log(result.toString());
          return instance.extendTime(time_id, {from: account, gas: 500000, value: result*100000000000000000});
        })
        .then(function(result){
          App.contracts.Cert.deployed().then(function(instance){
            return instance.show_after(time_id, {from: account, gas: 500000});
          })
          .then(function(result){
            console.log(result);
            var date2 = new Date(result[1]*1000);
            var date3 = new Date(result[2]*1000);
                    
            cont.innerHTML = "If you keep extend this attribute time before 'Duration Time', 'Duration Number' grows.<br>"+
                            "And you should spend money to finish extend.<br>"+"There is a free extend between 'Duration Time' and 'Update Time'.<br>"
                            + "Duration Number: "+ result[0]+"<br>"+"Duration Time: "+date2.toString()+"<br>"+"Update Time: "+date3.toString()+"<br>";
          })
        })
      })
    })
  }*/
  /*
  // 標記已經被領養的寵物
  markAdopted: function () { // Step 3
    var adoptionInstance;
    App.contracts.Adoption.deployed().then(function (instance) {
      adoptionInstance = instance;
      // 因為 getAdopters 是具有 view 修飾符的函示，所以不用建立一筆交易 (transation)，可以直接用 call 函示來取得回傳值。
      return adoptionInstance.getAdopters.call();
    }).then(function (adopters) {
      adopters.forEach(function (adopter, index) {
        // 如果已經有人領養了，則停用按鈕。
        if (adopter !== '0x0000000000000000000000000000000000000000') {
          $('.panel-pet').eq(index).find('button').text('Success').attr('disabled', true);
        }
      });
    }).catch(function (err) {
      console.log(err.message);
    });
  },*/

  /*handleAdopt: function (event) { // Step 4
    event.preventDefault();
    var petId = parseInt($(event.target).data('id'));
    var adoptionInstance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.Adoption.deployed().then(function (instance) {
        adoptionInstance = instance;
        // 建立一筆交易，執行智能合約的 adopt 函式
        return adoptionInstance.adopt(petId, {
          from: account
        });
      App.contracts.Give.deployed().then(function (instance) {
        adoptionInstance = instance;
        // 建立一筆交易，執行智能合約的 adopt 函式
        console.log(account);
         return adoptionInstance.checkPermission(account);
      }).then(function (result) {
        // console.log(result);
        return App.markAdopted();
      }).catch(function (err) {
        console.log(err.message);
      });
    });
  }*/

};

window.onload = function () {
  App.init();
}
