// import web3 from "./web3";
const web3 = require("./web3");
// import Transaction from "./build/transaction.json";
const Transaction = require("./build/transaction.json");

const instance = new web3.eth.Contract(
  Transaction.abi,
  "0xA333AD0019179721225baDec35056F36B6fE6206"
);

// export default instance;
module.exports = instance;