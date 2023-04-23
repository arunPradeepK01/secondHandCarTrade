const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const transaction = require('./build/transaction.json')

const provider = new HDWalletProvider(
  "mixture worry coast hero glimpse among season apology good circle sample achieve",
  "https://sepolia.infura.io/v3/0106a6c70b934eb58233489b647280f3"
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(transaction.abi)
    .deploy({ data: transaction.evm.bytecode.object })
    .send({ gas: "1600000", from: accounts[0] });

  console.log("Contract deployed to", result.options.address);
  provider.engine.stop();
};
deploy();
