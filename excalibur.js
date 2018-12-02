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


// Импорт билиотеки "Web3" и ее связывание с константой для работы с ней.
const Web3 = require('web3');
// Импортирование конфигурационного файла и его связывание с константой для работы с ним.
const Settings = require("./config/settings.json");


// Класс "Excalibur", который включает методы для работы с ним.
class Excalibur {

	// Конструктор класса
	constructor(inProviderID, inContractAddress) {
		// Создание переменной и присваивание ей идентификатор провайдера. Формальный параметр должен получать на вход фактический параметр в виде строки.
		this.providerID = inProviderID;
		// Формальный параметр "inContractAddress" должен иметь одно из двух состояний: 'true' или 'false'. Позволяет выбрать адрес биржи к которому необходимо подсоединиться.
		// Импортирование адреса контракта из файла "settings.json".
		this.contractAddress = ((inContractAddress === true) ? Settings.firstContractAddress : Settings.secondContractAddress);
		// Создание объекта "web3" от библиотеки "Web3".
		this.web3 = new Web3(new Web3.providers.WebsocketProvider(this.providerID));
		// Импортирование ABI биржи из файла "settings.json".
		this.exchangeABI = Settings.exchangeABI;
		// Импортирование ABI токена из файла "settings.json".
		this.tokenABI = Settings.tokenABI;
		// Создание переменной, которая будет осуществлять работу с контрактами для биржи (Exchange Contract).
		this.exchangeContract = new this.web3.eth.Contract(this.exchangeABI, this.contractAddress);
		// Создание переменной, которая будет осуществлять работу с контрактами для токена (Token Contract).
		this.tokenContract = new this.web3.eth.Contract(this.tokenABI, this.contractAddress);
		// Импортирование версии библиотеки из файла "settings.json".
		this.libraryVersion = Settings.libraryVersion;
	}

	// Получение аккаунта по его индексу
	async getAccount(accountIndex) {
		let arrayAccounts;
		await this.web3.eth.getAccounts(function(error, array) {
			if (!error) {
				arrayAccounts = array;
			}
		});
		return await arrayAccounts[accountIndex];
	}

	// Внести некоторую сумму
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

	// Вывести средства
	async withdrawalFunds(fromWhere, amountValue, callback) {
		let withdrawalValue;
		await this.exchangeContract.methods.withdraw(amountValue).send({from: fromWhere}, function(error, hash) {
			if (!error) {
				withdrawalValue = hash;
			}
			callback(hash);
		});
		return await withdrawalValue;
	}

	// Внести некоторое количество токенов
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

	// Вывести токены
	async withdrawalTokens(fromWhere, token, amountValue, callback) {
		let withdrawalValue;
		await this.exchangeContract.methods.withdrawToken(token, amountValue).send({from: fromWhere}, function(error, hash) {
			if (!error) {
				withdrawalValue = hash;
			}
			callback(hash);
		});
		return await withdrawalValue;
	}

	// Запросить баланс
	async getBalance(token, walletAddress) {
		let balanceValue;
		await this.exchangeContract.methods.balanceOf(token, walletAddress).call(function(error, cash) {
			if (!error) {
				balanceValue = cash;
			}
		});
		return await balanceValue;
	}

	// Ордер на покупку/продажу криптовалюты
	async getOrder(fromWhere, getToken, getAmount, giveToken, giveAmount, expires, nonce) {
		let temporaryValue;
		await this.exchangeContract.methods.order(getToken, getAmount, giveToken, giveAmount, expires, nonce).send({from: fromWhere}, function(error, hash) {
			if (!error) {
				temporaryValue = hash;
			}
		});
		return await temporaryValue;
	}

	// Обменять токены
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

	// Отменить ордер на покупку/продажу криптовалюты
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

	// Персональная подпись
	async personalSign(fromWhere, hash) {
		let signResult;
		await this.web3.eth.personal.sign(hash, fromWhere, function(error, result) {
			if (!error) {
				signResult = result;
			}
		});
		return await signResult;
	}

	// Проверить подпись
	async checkSign(hash, signature) {
		let checkingResult;
		await this.web3.eth.personal.ecRecover(hash, signature, function(error, result) {
			if (!error) {
				checkingResult = result;
			}
		});
		return await checkingResult;
	}

	// Получить хэш ордера
	getOrderHash(getToken, getAmount, giveToken, giveAmount, expires, nonce) {
		let temporaryValue = this.web3.utils.soliditySha3(this.exchangeContract, getToken, getAmount, giveToken, giveAmount, expires, nonce);
		return temporaryValue;
	}

	// Получить подпись
	getSign(fromWhere, getToken, getAmount, giveToken, giveAmount, expires, nonce, callback) {
		let hash = this.getOrderHash(getToken, getAmount, giveToken, giveAmount, expires, nonce);
		callback(hash);
		return this.personalSign(fromWhere, hash);
	}

	// Получить разрешение на использование средств
	async getFundsApprove(fromWhere, spender, amountValue) {
		let temporaryValue;
		await this.exchangeContract.methods.approve(spender, amountValue).send({from: fromWhere}, function(error, hash) {
			if (!error) {
				temporaryValue = hash;
			}
		});
		return await temporaryValue;
	}

	// Сделать трансфер некоторой суммы
	async makeTransfer(fromWhere, startPoint, endPoint, amountValue) {
		let transferValue;
		await this.exchangeContract.methods.transferFrom(startPoint, endPoint, amountValue).send({from: fromWhere}, function(error, hash) {
			if (!error) {
				transferValue = hash;
			}
		});
		return await transferValue;
	}

	// Событие создания ордера
	async orderEvent() {
		let temporaryValue;
		await this.exchangeContract.events.Order({fromBlock: 0}, function(error, event) {
			if (!error) {
				temporaryValue = event;
			}
		});
		return await temporaryValue;
	}

	// Перевод в читаемый вид эфириума
	transformToRSV(signature) {
		let temporaryValue = signature.slice(2);
		let r = '0x' + temporaryValue.slice(0, 64);
		let s = '0x' + temporaryValue.slice(64, 128);
		let v = this.web3.utils.toDecimal('0x' + temporaryValue.slice(128, 130));
		return {r: r, s: s, v: v};
	}

	// Transfrom Wei
	transformWei(numberValue, unit = 'ether', transformType = 'to') {
		if (transformType === 'to') {
			return this.web3.utils.toWei(numberValue, unit);
		} else if (transformType === 'from') {
			return this.web3.utils.fromWei(numberValue, unit);
		} else {
			return "Transfrom type is not define.";
		}
	}

	// Information about the use of the library and it's variables and function's arguments
	help(key = '-all') {
		if (key === '-all') {
			// this is place for all description about library methods
		}
		// in the future here will be added descriptions
	}

	// Информация о версии библиотеки и о версиях используемых дополнениях к ней
	versions() {
		console.log(`Excalibur library:  ver. ${this.libraryVersion}`);
		console.log(`Web3 library:  ver. ${this.web3.version}`);
	}

}

// Импортирование библиотеки для использования в других проектах
module.exports = Excalibur;