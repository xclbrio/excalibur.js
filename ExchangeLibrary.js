/*
	-----------------------------------------------------
	|			   Decentralized Exchange	 			|
	-----------------------------------------------------
	|		  Exchange smart contract methods			|
	|				    Version 0.0.1			  		|
	|		 		  Module Description				|
	|													|	
	-----------------------------------------------------
 */


 //подключение бибилиотеки web3
 const Web3 = require("Web3")
 
 //Объявление переменной ид провайдера
 const providerID = "wss://kovan.infura.io/ws"

 //создание переменной веб3 класса веб3
 const web3 = new Web3(new Web3.providers.HttpProvider(providerID));
 
 //подключение файла с неизменяемыми насрлйками
 //const settings = require("./settings.js")

 //ABI description
 const ABI = [
		{
			"constant": false,
			"inputs": [
				{
					"name": "tokenGet",
					"type": "address"
				},
				{
					"name": "amountGet",
					"type": "uint256"
				},
				{
					"name": "tokenGive",
					"type": "address"
				},
				{
					"name": "amountGive",
					"type": "uint256"
				},
				{
					"name": "expires",
					"type": "uint256"
				},
				{
					"name": "nonce",
					"type": "uint256"
				}
			],
			"name": "order",
			"outputs": [],
			"payable": false,
			"type": "function",
			"stateMutability": "nonpayable"
		},
		{
			"constant": true,
			"inputs": [
				{
					"name": "",
					"type": "address"
				},
				{
					"name": "",
					"type": "bytes32"
				}
			],
			"name": "orderFills",
			"outputs": [
				{
					"name": "",
					"type": "uint256"
				}
			],
			"payable": false,
			"type": "function",
			"stateMutability": "view"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "amount",
					"type": "uint256"
				}
			],
			"name": "withdraw",
			"outputs": [],
			"payable": false,
			"type": "function",
			"stateMutability": "nonpayable"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "token",
					"type": "address"
				},
				{
					"name": "amount",
					"type": "uint256"
				}
			],
			"name": "depositToken",
			"outputs": [],
			"payable": false,
			"type": "function",
			"stateMutability": "nonpayable"
		},
		{
			"constant": true,
			"inputs": [
				{
					"name": "",
					"type": "address"
				},
				{
					"name": "",
					"type": "address"
				}
			],
			"name": "tokens",
			"outputs": [
				{
					"name": "",
					"type": "uint256"
				}
			],
			"payable": false,
			"type": "function",
			"stateMutability": "view"
		},
		{
			"constant": true,
			"inputs": [],
			"name": "tradeState",
			"outputs": [
				{
					"name": "",
					"type": "bool"
				}
			],
			"payable": false,
			"type": "function",
			"stateMutability": "view"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "token",
					"type": "address"
				},
				{
					"name": "amount",
					"type": "uint256"
				}
			],
			"name": "withdrawToken",
			"outputs": [],
			"payable": false,
			"type": "function",
			"stateMutability": "nonpayable"
		},
		{
			"constant": true,
			"inputs": [],
			"name": "checkAdmin",
			"outputs": [
				{
					"name": "",
					"type": "bool"
				}
			],
			"payable": false,
			"type": "function",
			"stateMutability": "view"
		},
		{
			"constant": true,
			"inputs": [
				{
					"name": "",
					"type": "address"
				},
				{
					"name": "",
					"type": "bytes32"
				}
			],
			"name": "orders",
			"outputs": [
				{
					"name": "",
					"type": "bool"
				}
			],
			"payable": false,
			"type": "function",
			"stateMutability": "view"
		},
		{
			"constant": false,
			"inputs": [],
			"name": "deposit",
			"outputs": [],
			"payable": true,
			"type": "function",
			"stateMutability": "payable"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "tokenGet",
					"type": "address"
				},
				{
					"name": "amountGet",
					"type": "uint256"
				},
				{
					"name": "tokenGive",
					"type": "address"
				},
				{
					"name": "amountGive",
					"type": "uint256"
				},
				{
					"name": "expires",
					"type": "uint256"
				},
				{
					"name": "nonce",
					"type": "uint256"
				},
				{
					"name": "v",
					"type": "uint8"
				},
				{
					"name": "r",
					"type": "bytes32"
				},
				{
					"name": "s",
					"type": "bytes32"
				},
				{
					"name": "pair",
					"type": "string"
				}
			],
			"name": "cancelOrder",
			"outputs": [],
			"payable": false,
			"type": "function",
			"stateMutability": "nonpayable"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "state_",
					"type": "bool"
				}
			],
			"name": "changeTradeState",
			"outputs": [],
			"payable": false,
			"type": "function",
			"stateMutability": "nonpayable"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "tokenGet",
					"type": "address"
				},
				{
					"name": "amountGet",
					"type": "uint256"
				},
				{
					"name": "tokenGive",
					"type": "address"
				},
				{
					"name": "amountGive",
					"type": "uint256"
				},
				{
					"name": "expires",
					"type": "uint256"
				},
				{
					"name": "nonce",
					"type": "uint256"
				},
				{
					"name": "user",
					"type": "address"
				},
				{
					"name": "v",
					"type": "uint8"
				},
				{
					"name": "r",
					"type": "bytes32"
				},
				{
					"name": "s",
					"type": "bytes32"
				},
				{
					"name": "amount",
					"type": "uint256"
				},
				{
					"name": "pair",
					"type": "string"
				}
			],
			"name": "trade",
			"outputs": [],
			"payable": false,
			"type": "function",
			"stateMutability": "nonpayable"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "newAdmin",
					"type": "address"
				}
			],
			"name": "transferOwnership",
			"outputs": [],
			"payable": false,
			"type": "function",
			"stateMutability": "nonpayable"
		},
		{
			"constant": true,
			"inputs": [
				{
					"name": "token",
					"type": "address"
				},
				{
					"name": "user",
					"type": "address"
				}
			],
			"name": "balanceOf",
			"outputs": [
				{
					"name": "",
					"type": "uint256"
				}
			],
			"payable": false,
			"type": "function",
			"stateMutability": "view"
		},
		{
			"constant": true,
			"inputs": [],
			"name": "admin",
			"outputs": [
				{
					"name": "",
					"type": "address"
				}
			],
			"payable": false,
			"type": "function",
			"stateMutability": "view"
		},
		{
			"inputs": [],
			"payable": false,
			"type": "constructor",
			"stateMutability": "nonpayable"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": false,
					"name": "tokenGet",
					"type": "address"
				},
				{
					"indexed": false,
					"name": "amountGet",
					"type": "uint256"
				},
				{
					"indexed": false,
					"name": "tokenGive",
					"type": "address"
				},
				{
					"indexed": false,
					"name": "amountGive",
					"type": "uint256"
				},
				{
					"indexed": false,
					"name": "expires",
					"type": "uint256"
				},
				{
					"indexed": false,
					"name": "nonce",
					"type": "uint256"
				},
				{
					"indexed": false,
					"name": "user",
					"type": "address"
				},
				{
					"indexed": false,
					"name": "hash",
					"type": "bytes32"
				}
			],
			"name": "Order",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": false,
					"name": "tokenGet",
					"type": "address"
				},
				{
					"indexed": false,
					"name": "amountGet",
					"type": "uint256"
				},
				{
					"indexed": false,
					"name": "tokenGive",
					"type": "address"
				},
				{
					"indexed": false,
					"name": "amountGive",
					"type": "uint256"
				},
				{
					"indexed": false,
					"name": "expires",
					"type": "uint256"
				},
				{
					"indexed": false,
					"name": "nonce",
					"type": "uint256"
				},
				{
					"indexed": false,
					"name": "user",
					"type": "address"
				},
				{
					"indexed": false,
					"name": "v",
					"type": "uint8"
				},
				{
					"indexed": false,
					"name": "r",
					"type": "bytes32"
				},
				{
					"indexed": false,
					"name": "s",
					"type": "bytes32"
				},
				{
					"indexed": false,
					"name": "hash",
					"type": "bytes32"
				},
				{
					"indexed": false,
					"name": "pair",
					"type": "string"
				}
			],
			"name": "Cancel",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": false,
					"name": "tokenGet",
					"type": "address"
				},
				{
					"indexed": false,
					"name": "amountGet",
					"type": "uint256"
				},
				{
					"indexed": false,
					"name": "tokenGive",
					"type": "address"
				},
				{
					"indexed": false,
					"name": "amountGive",
					"type": "uint256"
				},
				{
					"indexed": false,
					"name": "get",
					"type": "address"
				},
				{
					"indexed": false,
					"name": "give",
					"type": "address"
				},
				{
					"indexed": false,
					"name": "hash",
					"type": "bytes32"
				},
				{
					"indexed": false,
					"name": "pair",
					"type": "string"
				}
			],
			"name": "Trade",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": false,
					"name": "token",
					"type": "address"
				},
				{
					"indexed": false,
					"name": "user",
					"type": "address"
				},
				{
					"indexed": false,
					"name": "amount",
					"type": "uint256"
				},
				{
					"indexed": false,
					"name": "balance",
					"type": "uint256"
				}
			],
			"name": "Deposit",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": false,
					"name": "token",
					"type": "address"
				},
				{
					"indexed": false,
					"name": "user",
					"type": "address"
				},
				{
					"indexed": false,
					"name": "amount",
					"type": "uint256"
				},
				{
					"indexed": false,
					"name": "balance",
					"type": "uint256"
				}
			],
			"name": "Withdraw",
			"type": "event"
		}]


 //Основной класс библиотеки

 //Конструктор класса
 function Exchange(contractAdress) {
 	this.contract = new web3.eth.Contract(ABI, contractAdress);
 	//для отладки
 	console.log("Контсруктор вызван успешно, класс инициализирован");
 }


 //свнести депозит
 Exchange.prototype.makeDeposit = async function(fromWhere, amount, CALLBACK) {
 	let temporaryValue;
 	await this.contract.methods.deposit().send({from: fromWhere, value: amount},
 		function(error, hash) {
 			if (!error) {
	 			temporaryValue = hash;
	 			CALLBACK(hash);
	 		}
 		});
 	return await temporaryValue;
 }


 //вывод средств
 Exchange.prototype.withdrawalFunds = async function(fromWhere, amount, CALLBACK) {
 	let temporaryValue;
 	await this.contract.methods.withdraw(amount).send({from: fromWhere},
 		function(error, hash) {
 			if (!error) {
 				temporaryValue = hash;
 			}
 			CALLBACK(hash);
 		});
 	return await temporaryValue;
 }

 //Внест депозит токена ПЕРЕДЕЛАТЬ
 /*
 Exchange.prototype.makeTokenDeposit = async function(fromWhere, tokenContract, spender, token, amount, CALLBACK) {
 	let temporaryValue;
 	await tokenContract.methods.approve(spender, amount).send({from: fromWhere},
 		function(error, hash) {
 			if (!error) {
 				temporaryValue = hash;
 			}
 		}



 }
 */


 //вывод токена
 Exchange.prototype.withdrawalToken = async function(fromWhere, token, amount, CALLBACK) {
 	let temporaryValue;
 	await this.contract.methods.withdrawToken(token, amount).send({from: fromWhere},
 		function(error, hash) {
 			if (!error) {
 				temporaryValue = hash;
 			}
 			CALLBACK(hash);
 		});
 	return await temporaryValue;
 }


 //Запросить баланс кошелька юзера
 Exchange.prototype.getUserBalance = async function(tokenValue, addressUserWallet) {
	let temporaryValue;
	await this.contract.methods.getUserBalance(tokenValue, addressUserWallet).call(
		function(error, result) {
			if (!error) {
				temporaryValue = result;
			}
		}
	);
	return await temporaryValue;
 }

 //Обмен валюты
 Exchange.prototype.swapToken = async function(fromWhere, getToken, getAmount, giveToken, giveAmount, expires, nonce, user, V, R, S, amount, pair, CALLBACK) {
	let temporaryValue;
	await contract_.methods.trade(getToken, getAmount, giveToken, giveAmount, expires, nonce, user, v, r, s, amount, pair).send({from: fromWhere},
			function(error, hash){
				if (!err){
					temporaryValue = hash
					console.log(hash)
				}
				CALLBACK(hash);
			}
		);
		return await temporaryValue;
 }

 //Перепод в читаемый вид эфира
 Exchange.prototype.transformToRSV = function(signature) {
	let temporaryValue = signature.slice(2);
	let R = '0x' + temporaryValue.slice(0, 64);
	let S = '0x' + temporaryValue.slice(64, 128);
	let V = web3.utils.toDecimal('0x' + temporaryValue.slice(128, 130));
	return {R: R, S: S, V: V};
 }


 //отменить ордер
 Exchange.prototype.cancelOrder = async function(fromWhere, getToken, getAmount, giveToken, giveAmount, expires, nonce, user, V, R, S, amount, pair, CALLBACK) {
	let temporaryValue;
	await this.contract.methods.cancelOrder(gettoken, getAmount, giveToken, giveAmount, expires, nonce, V, R, S, pair).send({from: fromWhere},
		function(error, hash) {
			if (!error) {
				temporaryValue = hash;
			}
			CALLBACK(hash);
		});
	return await temporaryValue;
 }







 module.exports = Exchange;





