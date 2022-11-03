window.onload = async () => {
  const contract_address = "0xa1e71021b208a5a38cc06fd56b0ca56701518d2e";

  const abi = [
    {
      "inputs": [],
      "name": "descrement",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "increment",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "val",
          "type": "uint256"
        }
      ],
      "name": "setval",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "show",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  document.querySelectorAll(".loginBtn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      let isLoggedIn = window.userAddress ? true : false;
      console.log("clicked", window.userAddress, isLoggedIn);
      if (isLoggedIn) {
        logOut();
      } else {
        login();
      }
    });
  });

  document.querySelectorAll(".incrementBtn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      let isLoggedIn = window.userAddress ? true : false;
      console.log("incrementBtn", window.userAddress);
      increment();
    });
  });

  document.querySelectorAll(".showBtn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      let isLoggedIn = window.userAddress ? true : false;
      console.log("showBtn", window.userAddress);
      show();
    });
  });

  const getUserInfo = () => {
    let main = document.getElementById("main");
    let isLoggedIn = window.userAddress ? true : false;
    document.querySelectorAll(".loginBtn").forEach((btn) => {
      if (isLoggedIn) {
        btn.innerText = "Logout";
        main.classList.remove("hidden");
      } else {
        btn.innerText = "Connect Metamask";
        main.classList.add("hidden");
      }
    });
  };

  const login = async () => {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();
    const balance = await web3.eth.getBalance(accounts[0]);
    window.userAddress = accounts[0];
    document.getElementById("Address").innerText = accounts[0];
    document.getElementById("balance").innerText = `${balance} ETH`;

    getUserInfo();
  };

  const increment = async () => {
    let contract = new web3.eth.Contract(abi,contract_address,{
        from: window.userAddress,
        gas: 30000,
        gasPrice: '30000000000'
      }
    ); 

    contract.methods.increment().send({from: window.userAddress})
    .on('receipt', function(result){
       console.log(result)
    });
  }

  const show = async () => {
    let contract = new web3.eth.Contract(abi,contract_address,{}); 

    contract.methods.show().call((err, result) => {
      console.log('err', err)
      console.log('result', result)
      document.getElementById("likes").innerText = `${result} Likes`;
    })
  }

  const logOut = async () => {
    window.userAddress = null;
    document.getElementById("Address").innerText = "";
    getUserInfo();
  };

  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    try {
      getUserInfo();
    } catch (error) {
      console.log("Error");
    }
  } else {
    alert("Please install MetaMask Extension in your browser");
  }
};
