
const fs = require('fs');
const hre = require("hardhat");
const BN = require("bn.js");
const abi = JSON.parse(fs.readFileSync('./abi.json', 'utf8'));
const contractAddress = "0xeea94efcefe133bfe683ca8b230251873fa961b1"

let trader, instance

async function loadContract(sp) {
    const accounts = await hre.ethers.getSigners();
    return new hre.ethers.Contract(contractAddress, abi, sp);
}

async function init() {
    // console.log(hre)
    //从配置文件"env.js"取其中一个账号
    trader = (await hre.ethers.getSigners())[0];
    console.log("user:", trader.address)

    //初始化合约
    instance = await loadContract(trader)
}
async function main() {
    await init();
    await buy("elonmusk", 2)
    await sell("elonmusk", 1)
}

async function buy(twitterUserName, amount) {
    let account = toAccount(twitterUserName)
    let price = new BN((await instance.getBuyPrice(account, amount)).toString());
    let protocolFee = new BN((await instance.getProtocolFee(price.toString())).toString());
    let subjectFee = new BN((await instance.getSubjectFee(price.toString())).toString());
    let value = price.add(protocolFee).add(subjectFee).toString();
    console.log("value", value.toString())
    await confirmTransaction(instance.buyShares(account, amount, { value }), "buyShares")
}

async function sell(twitterUserName, amount) {
    let account = toAccount(twitterUserName)
    await confirmTransaction(instance.sellShares(account, amount), "sellShares")
}

async function confirmTransaction(promise, action = "") {
    let receipt = await promise;
    let confirmations;
    if (receipt) {
        confirmations = await receipt.wait()
        if (!confirmations || confirmations.status !== 1) {
            console.log("Error occurs when executing receipt.wait(), hash: ", receipt.hash);
            process.exit(1)
        } else {
            console.log(`${action}: ${receipt.hash}`);
        }
    }
    return { receipt, confirmations }
}

const toAccount = s => {
    let result = web3.utils.fromAscii("x@" + s);
    if (result.length > 66) {
        console.error("invalid twitter username")
        process.exit(1)
    }
    while (result.length < 66) {
        result = result + "0";
    }
    return result;
}



main().catch(error => {
    console.error(error);
    process.exit(1);
});

