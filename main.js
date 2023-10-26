
const fs = require('fs');
const hre = require("hardhat");
const moment = require('moment');
const BN = require("bn.js");
const xlsx = require('xlsx');
const { toBN, toWei, fromWei } = require("web3-utils");
const etherToWei = amount => toBN(toWei(amount.toString(), "ether"));
const weiToEther = amount => fromWei(amount.toString(), "ether");
const etherToWeiString = amount => etherToWei(amount).toString(10);
const humanBN = d => parseFloat(parseFloat(weiToEther(d.toString())).toFixed(8));
const abi = JSON.parse(fs.readFileSync('./abi.json', 'utf8'));
const contractAddress = "0xeea94efcefe133bfe683ca8b230251873fa961b1"

let trader, instance

async function loadContract(sp) {
    return new hre.ethers.Contract(contractAddress, abi, sp);
}


async function init() {
    // get one account from env.js
    trader = (await hre.ethers.getSigners())[0];

    console.log("user:", trader.address)

    // initialize contract instance
    instance = await loadContract(trader)
}


async function main() {
    await init();
    // await buy("satyanadella", 2,0)
    // await sell("satyanadella", 1,0)
    await readAndTrade("test.xlsx", "text-result.xlsx")
}

// excel里面:
//  Amount表示买入/卖出数量. 数量大于0表示购买数量, 数量小于0表示卖出数量.
//  Price表示限定价格. 买入时,表示最大购买价格. 卖出时,表示最小卖出价格; 当price为0时,表示不限制价格
async function readAndTrade(excelPath, resultPath) {
    let items = excelToJSON(excelPath)
    for (let item of items) {
        let twtiterUsername = item['TwitterUserName']
        let amount = parseInt(item['Amount'] || 0)
        if (!amount || !twtiterUsername) continue
        console.log(JSON.stringify(item))
        let result = await (amount > 0 ? buy : sell)(twtiterUsername, amount, item['Price'])
        let { tradePrice, protocolFee, subjectFee, hash } = result || {}
        if (tradePrice) {
            item['TradePrice'] = humanBN(tradePrice)
            item['ProtocolFee'] = humanBN(protocolFee)
            item['SubjectFee'] = humanBN(subjectFee)
            item['Hash'] = hash
            item['TradeTime'] = moment().format();
            console.log(JSON.stringify(item))
            JSONToExcel(resultPath, items)
        }
    }
}



async function buy(twitterUserName, amount, maxBuyPrice) {
    // console.log("buy ", twitterUserName, amount, maxBuyPrice)
    let account = toAccount(twitterUserName)
    let tradePrice = new BN((await instance.getBuyPrice(account, amount)).toString());
    //如果大于限定购买价格,取消交易
    if ((maxBuyPrice > 0 && humanBN(tradePrice) > maxBuyPrice) || amount == 0) {
        return {}
    }
    let protocolFee = new BN((await instance.getProtocolFee(tradePrice.toString())).toString());
    let subjectFee = new BN((await instance.getSubjectFee(tradePrice.toString())).toString());
    let value = tradePrice.add(protocolFee).add(subjectFee).toString();
    let { hash } = await confirmTransaction(instance.buyShares(account, amount, { value: value }), "buyShares")
    return { tradePrice, protocolFee, subjectFee, hash }
}

async function sell(twitterUserName, amount, minSellPrice) {
    // console.log("sell ", twitterUserName, amount, minSellPrice)
    let account = toAccount(twitterUserName)
    let tradePrice = new BN((await instance.getSellPrice(account, amount)).toString());
    let shareBanace = parseInt((await instance.sharesBalance(account, trader.address)).toString())
    //如果小于限定卖出价格, 取消交易
    //如果amount==0,取消交易
    //如果amount> 持有数量,取消交易
    if ((minSellPrice > 0 && humanBN(tradePrice)) < minSellPrice || amount == 0 || amount > shareBanace) {
        return {}
    }
    let protocolFee = new BN((await instance.getProtocolFee(tradePrice.toString())).toString());
    let subjectFee = new BN((await instance.getSubjectFee(tradePrice.toString())).toString());
    let { hash } = await confirmTransaction(instance.sellShares(account, amount), "sellShares")
    return { price: tradePrice, protocolFee, subjectFee, hash }
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
    return { hash: receipt && receipt.hash, receipt, confirmations }
}

function JSONToExcel(path, json) {
    let workBook = xlsx.utils.book_new();
    const workSheet = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(workBook, workSheet, `response`);
    xlsx.writeFile(workBook, path);
}

function excelToJSON(path) {
    const workbook = xlsx.readFile(path);
    let workbook_sheet = workbook.SheetNames;
    return xlsx.utils.sheet_to_json(workbook.Sheets[workbook_sheet[0]]);
}

const toAccount = s => {
    let result = web3.utils.fromAscii("x@" + s.toLowerCase());
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

