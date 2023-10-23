

require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-web3");

function getAccounts() {
    let envFile = "./env.js";
    return require(envFile).accounts.map((item) => item.privateKey);
}

const config = {
    defaultNetwork: "basegoerli",
    solidity: { version: "0.8.4", settings: { optimizer: { enabled: true, runs: 100 } } },
    networks: {
        base: {
            currency: "ETH",
            currencyDecimals: 18,
            url: "https://mainnet.base.org",
            explorer: "https://basescan.org",
            accounts: getAccounts(),
            chainId: 8453,
        },
        basegoerli: {
            currency: "ETH",
            currencyDecimals: 18,
            saveDeployments: true,
            tags: ["staging"],
            url: "https://goerli.base.org",
            explorer: "https://goerli.basescan.org",
            accounts: getAccounts(),
            chainId: 84531,
            gasPrice: 1.5 * 1e9,
        },
    },
    mocha: { timeout: 200000 },
    etherscan: {
        apiKey: {
            arbitrumOne: "8GMNPUD6828B4MIHYRAHC7K5RRWRY1B82C",
        },
    },
};

module.exports = config
