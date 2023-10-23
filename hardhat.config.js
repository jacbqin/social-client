

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
        arbitrum: {
            currency: "ETH",
            currencyDecimals: 18,
            url: "https://arb-mainnet.g.alchemy.com/v2/K6ooygeuX_XZYGZz1QqHyYMiFE9p3elH",
            explorer: "https://arbiscan.io",
            rpc: "https://arbitrum-mainnet.infura.io",
            accounts: getAccounts("arbitrum"),
            chainId: 42161,
            // gasPrice: 0.1 * 1e9,
            //gas: 950000,
        },

        arbigoerli: {
            currency: "ETH",
            currencyDecimals: 18,
            url: "https://arb-goerli.g.alchemy.com/v2/sFQLzqNwFsZKsi3kz0zy-4b1AFaEm-xg",
            explorer: "https://goerli.arbiscan.io",
            rpc: "https://goerli-rollup.arbitrum.io/rpc",
            accounts: getAccounts("arbigoerli"),
            chainId: 421613,
        },
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
