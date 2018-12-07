/*
	-----------------------------------------------------
	|			   Decentralized Exchange	 			|
	-----------------------------------------------------
	|		  Exchange smart contract methods			|
	|		 		 Module Description					|
	|													|
	|		 There will be a description of the 		|
	|   arguments of the methods for the class to work	|	
	-----------------------------------------------------
 */


// Import the "Web3" library and it's binding to a constant for working with it
const Web3 = require('web3');
// Import a configuration file and it's binding to a constant for working with it
const Settings = require("./config/settings.json");


// The "Excalibur" class which includes methods for working with it
class Excalibur {

	// Class constructor
	constructor(inProviderID, isMainnetAddress) {
		// Creating a variable and assigning it the provider ID. The formal parameter should receive as input the actual parameter as a string
		this.providerID = inProviderID;
		// The formal parameter "isMainnetAddress" must have one of two states: 'true' or 'false'. Allows you to select the address of the exchange to which you want to connect
		// Importing the contract address from the "settings.json" file
		this.contractAddress = (isMainnetAddress === true) ? Settings.mainnetAddress : Settings.kovanAddress;
		// Creating an object "web3" from the library "Web3"
		this.web3 = new Web3(new Web3.providers.WebsocketProvider(this.providerID));
		// Import ABI exchange from the file "settings.json"
		this.exchangeABI = Settings.exchangeABI;
		// Importing an ABI token from the file "settings.json"
		this.tokenABI = Settings.tokenABI;
		// Creating a variable that will work with contracts for the exchange (Exchange Contract)
		this.exchangeContract = new this.web3.eth.Contract(this.exchangeABI, this.contractAddress);
		// Creating a variable that will work with contracts for a token (Token Contract)
		this.tokenContract = new this.web3.eth.Contract(this.tokenABI, this.contractAddress);
		// Importing the library version from the file "settings.json"
		this.libraryVersion = Settings.libraryVersion;
	}

	// Getting an account by it's index
	async getAccount(accountIndex) {
		let arrayAccounts;
		await this.web3.eth.getAccounts(function(error, array) {
			if (!error) {
				arrayAccounts = array;
			}
		});
		return await arrayAccounts[accountIndex];
	}

	// Deposit some amount
	async makeDeposit(fromWhere, depositAmount, callback) {
		let depositValue;
		await this.exchangeContract.methods.deposit().send({from: fromWhere, value: depositAmount}, function(error, hash) {
			if (!error) {
				depositValue = hash;
			}
			callback(hash);
		});
		return await depositValue;
	}

	// Withdraw funds
	async withdrawFunds(fromWhere, amountValue, callback) {
		let withdrawalValue;
		await this.exchangeContract.methods.withdraw(amountValue).send({from: fromWhere}, function(error, hash) {
			if (!error) {
				withdrawalValue = hash;
			}
			callback(hash);
		});
		return await withdrawalValue;
	}

	// Add some tokens
	async makeDepositToken(fromWhere, spender, token, amountValue, callback) {
		let depositValue;
		await this.tokenContract.methods.approve(spender, amountValue).send({from: fromWhere}, function(firstError, hash) {
			if (!firstError) {
				depositValue = hash;
			}
			callback(hash);
			let checkTransaction = setInterval(() => {
				this.web3.eth.getTransactionReceipt(hash).then(result => {
					if (result.blockNumber !== null) {
						clearInterval(checkTransaction);
						this.exchangeContract.methods.depositToken(token, amountValue).send({from: fromWhere}, function(secondError, hash) {
							if (!secondError) {
								depositValue = hash;
							}
							callback(hash);
						});
					}
				});
			}, 3000);
		});
		return await depositValue;
	}

	// Withdraw tokens
	async withdrawTokens(fromWhere, token, amountValue, callback) {
		let withdrawalValue;
		await this.exchangeContract.methods.withdrawToken(token, amountValue).send({from: fromWhere}, function(error, hash) {
			if (!error) {
				withdrawalValue = hash;
			}
			callback(hash);
		});
		return await withdrawalValue;
	}

	// Request a balance in the user account
	async getBalance(token, walletAddress) {
		let balanceValue;
		await this.exchangeContract.methods.balanceOf(token, walletAddress).call(function(error, cash) {
			if (!error) {
				balanceValue = cash;
			}
		});
		return await balanceValue;
	}

	// Get a cryptocurrency buy or sell order
	async getOrder(fromWhere, getToken, getAmount, giveToken, giveAmount, expires, nonce) {
		let temporaryValue;
		await this.exchangeContract.methods.order(getToken, getAmount, giveToken, giveAmount, expires, nonce).send({from: fromWhere}, function(error, hash) {
			if (!error) {
				temporaryValue = hash;
			}
		});
		return await temporaryValue;
	}

	// To exchange tokens
	async swapTokens(fromWhere, getToken, getAmount, giveToken, giveAmount, expires, nonce, walletAddress, v, r, s, amountValue, tokenPair, callback) {
		let temporaryValue;
		await this.exchangeContract.methods.trade(getToken, getAmount, giveToken, giveAmount, expires, nonce, walletAddress, v, r, s, amountValue, tokenPair).send({from: fromWhere}, function(error, hash) {
			if (!error) {
				temporaryValue = hash;
			}
			callback(hash);
		});
		return await temporaryValue;
	}

	// Cancel cryptocurrency buy or sell order
	async cancelOrder(fromWhere, getToken, getAmount, giveToken, giveAmount, expires, nonce, v, r, s, pairTokens, callback) {
		let temporaryValue;
		await this.exchangeContract.methods.cancelOrder(getToken, getAmount, giveToken, giveAmount, expires, nonce, v, r, s, pairTokens).send({from: fromWhere}, function(error, hash) {
			if (!error) {
				temporaryValue = hash;
			}
			callback(hash);
		});
		return await temporaryValue;
	}

	// Personal signature
	async personalSign(fromWhere, hash) {
		let signResult;
		await this.web3.eth.personal.sign(hash, fromWhere, function(error, result) {
			if (!error) {
				signResult = result;
			}
		});
		return await signResult;
	}

	// Perform signature verification
	async checkSign(hash, signature) {
		let checkingResult;
		await this.web3.eth.personal.ecRecover(hash, signature, function(error, result) {
			if (!error) {
				checkingResult = result;
			}
		});
		return await checkingResult;
	}

	// Get a hash order
	getOrderHash(getToken, getAmount, giveToken, giveAmount, expires, nonce) {
		let temporaryValue = this.web3.utils.soliditySha3(this.exchangeContract, getToken, getAmount, giveToken, giveAmount, expires, nonce);
		return temporaryValue;
	}

	// Get a signature
	getSign(fromWhere, getToken, getAmount, giveToken, giveAmount, expires, nonce, callback) {
		let hash = this.getOrderHash(getToken, getAmount, giveToken, giveAmount, expires, nonce);
		callback(hash);
		return this.personalSign(fromWhere, hash);
	}

	// Get approve to use the funds
	async getFundsApprove(fromWhere, spender, amountValue) {
		let temporaryValue;
		await this.exchangeContract.methods.approve(spender, amountValue).send({from: fromWhere}, function(error, hash) {
			if (!error) {
				temporaryValue = hash;
			}
		});
		return await temporaryValue;
	}

	// Make a transfer of a some amount
	async makeTransfer(fromWhere, startPoint, endPoint, amountValue) {
		let transferValue;
		await this.exchangeContract.methods.transferFrom(startPoint, endPoint, amountValue).send({from: fromWhere}, function(error, hash) {
			if (!error) {
				transferValue = hash;
			}
		});
		return await transferValue;
	}

	// Event creation order
	async orderEvent() {
		let temporaryValue;
		await this.exchangeContract.events.Order({fromBlock: 0}, function(error, event) {
			if (!error) {
				temporaryValue = event;
			}
		});
		return await temporaryValue;
	}

	// Translation into readable form of the Ethereum
	transformToRSV(signature) {
		let temporaryValue = signature.slice(2);
		let r = '0x' + temporaryValue.slice(0, 64);
		let s = '0x' + temporaryValue.slice(64, 128);
		let v = this.web3.utils.toDecimal('0x' + temporaryValue.slice(128, 130));
		return {r: r, s: s, v: v};
	}

	// Transfrom Wei
	transformWei(numberValue, transformType = 'to', unit = 'ether') {
		if (transformType === 'to') {
			return this.web3.utils.toWei(numberValue, unit);
		} else if (transformType === 'from') {
			return this.web3.utils.fromWei(numberValue, unit);
		} else {
			console.log(`Transfrom type ${transformType} is not define.`);
			return numberValue;
		}
	}

	// Information about the use of the library and it's variables and function's arguments
	help(key = '-all') {
		if (key === '-all') {
			console.log(`Вызвав этот метод Вы можете получить всю необходимую информацию для работы с библиотекой`);
			console.log(`Вызвав метод без параметров, Вам выведется полный список ключей и сопоставленных им методов.`);
			console.log(`Для получения информации вызовите метод с ключом соответствующей функции, информацию по которой Вы хотите получить.`);
			console.log(`'-ga'  - Позволяет получить информацию о методе "getAccount".`);
			console.log(`'-md'  - Позволяет получить информацию о методе "makeDeposit".`);
			console.log(`'-wf'  - Позволяет получить информацию о методе "withdrawFunds".`);
			console.log(`'-dt'  - Позволяет получить информацию о методе "makeDepositToken".`);
			console.log(`'-wt'  - Позволяет получить информацию о методе "withdrawTokens".`);
			console.log(`'-gb'  - Позволяет получить информацию о методе "getBalance".`);
			console.log(`'-go'  - Позволяет получить информацию о методе "getOrder".`);
			console.log(`'-st'  - Позволяет получить информацию о методе "swapTokens".`);
			console.log(`'-co'  - Позволяет получить информацию о методе "cancelOrder".`);
			console.log(`'-ps'  - Позволяет получить информацию о методе "personalSign".`);
			console.log(`'-cs'  - Позволяет получить информацию о методе "checkSign".`);
			console.log(`'-oh'  - Позволяет получить информацию о методе "getOrderHash".`);
			console.log(`'-gs'  - Позволяет получить информацию о методе "getSign".`);
			console.log(`'-fa'  - Позволяет получить информацию о методе "getFundsApprove".`);
			console.log(`'-mt'  - Позволяет получить информацию о методе "makeTransfer".`);
			console.log(`'-oe'  - Позволяет получить информацию о методе "orderEvent"`);
			console.log(`'-rsv' - Позволяет получить информацию о методе "transformToRSV"`);
			console.log(`'-tw'  - Позволяет получить информацию о методе "tranformWei"`);
		}
		if (key === '-mt') {

		}
		if (key === '-ga') {
			console.log(`Этот метод позволяет получить аккаунт по его индексу.`);
			console.log(`Parameter:`);
			console.log(`accountIndex - индекс аккаунта.`);
		}
		if (key === '-oe') {
			console.log(`Этот метод создает событие ордера.`);
			console
			fromWhere, startPoint, endPoint, amountValue
		}
		if (key === '-rsv') {

		}
		if (key === '-tw') {
			console.log(`Этот метод позволяет перевести Вашу валюту во внутреннюю.`);
			console.log(`Parameters:`);
			console.log(`numberValue - переводимое значение.`);
			console.log(`transformType - позволяет указать тип перевода. Имеет два значения - "to" или "from", по умолчанию установлено значение "to"`);
			console.log(`unit - позволяет указать во что или из чего переводить.  `);
		}
	}

	// Information about the version of the library and the versions of the used additions to it
	versions() {
		console.log(`Excalibur library:  ver. ${this.libraryVersion}`);
		console.log(`Web3 library:  ver. ${this.web3.version}`);
	}
	
}

// Importing a library for use in other projects
module.exports = Excalibur;