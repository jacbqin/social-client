

require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-web3");

function getAccounts() {
    let envFile = "./env.js";
    return require(envFile).accounts.map((item) => item.privateKey);
}
const accounts = getAccounts();

const config = {
    defaultNetwork: "basegoerli",
    solidity: { version: "0.8.4", settings: { optimizer: { enabled: true, runs: 100 } } },
    networks: {
        base: {
            currency: "ETH",
            url: "https://mainnet.base.org",
            explorer: "https://basescan.org",
            accounts,
            chainId: 8453,
        },
        basegoerli: {
            currency: "ETH",
            url: "https://goerli.base.org",
            explorer: "https://goerli.basescan.org",
            accounts,
            chainId: 84531,
            gasPrice: 1.5 * 1e9,
        },
        zkgoerli: {
            currency: "ETH",
            currencyDecimals: 18,
            url: `https://testnet.era.zksync.dev`,
            explorer: "https://goerli.explorer.zksync.io",
            ethNetwork: "goerli",
            verifyURL: 'https://zksync2-testnet-explorer.zksync.dev/contract_verification',
            accounts,
            chainId: 280,
            zksync: true,
        },
        zksync: {
            currency: "ETH",
            currencyDecimals: 18,
            url: `https://mainnet.era.zksync.io`,
            explorer: "https://explorer.zksync.io",
            ethNetwork: `https://mainnet.infura.io/v3/3e55ce6cfad9447abbca943899994e16`,
            verifyURL: "https://zksync2-mainnet-explorer.zksync.io/contract_verification",
            accounts,
            chainId: 324,
            zksync: true,
        },
        ethereum: {
            currency: "ETH",
            currencyDecimals: 18,
            url: `https://mainnet.infura.io/v3/3e55ce6cfad9447abbca943899994e16`,
            explorer: "https://etherscan.io",
            accounts,
            chainId: 1,
            gasPrice: 31e9,
        },
        avalanche: {
            currency: "AVAX",
            currencyDecimals: 18,
            url: "https://api.avax.network/ext/bc/C/rpc",
            explorer: "https://snowtrace.io",
            accounts,
            chainId: 43114,
        },
        fuji: {
            currency: "AVAX",
            currencyDecimals: 18,
            url: "https://api.avax-test.network/ext/bc/C/rpc",
            explorer: "https://testnet.snowtrace.io",
            accounts,
            chainId: 43113,
            gasPrice: 25000000000,
        },
        goerli: {
            currency: "ETH",
            currencyDecimals: 18,
            url: `https://goerli.infura.io/v3/3e55ce6cfad9447abbca943899994e16`,
            explorer: "https://goerli.etherscan.io",
            accounts,
            chainId: 5,
        },
        arbitrum: {
            currency: "ETH",
            currencyDecimals: 18,
            url: "https://arb-mainnet.g.alchemy.com/v2/K6ooygeuX_XZYGZz1QqHyYMiFE9p3elH",
            explorer: "https://arbiscan.io",
            rpc: "https://arbitrum-mainnet.infura.io",
            accounts,
            chainId: 42161,
        },
        arbigoerli: {
            currency: "ETH",
            currencyDecimals: 18,
            url: "https://arb-goerli.g.alchemy.com/v2/sFQLzqNwFsZKsi3kz0zy-4b1AFaEm-xg",
            explorer: "https://goerli.arbiscan.io",
            rpc: "https://goerli-rollup.arbitrum.io/rpc",
            accounts,
            chainId: 421613,
        },
        polygon: {
            currency: "MATIC",
            currencyDecimals: 18,
            url: `https://polygon-rpc.com/`,
            explorer: "https://polygonscan.com",
            accounts,
            chainId: 137,
            gasPrice: 1000000000 * 50,
        },
        mumbai: {
            currency: "MATIC",
            currencyDecimals: 18,
            url: `https://matic-mumbai.chainstacklabs.com`,
            explorer: "https://mumbai.polygonscan.com",
            accounts,
            chainId: 80001,
        },
        lineagoerli: {
            url: `https://linea-goerli.infura.io/v3/222d481eb67a49a980712c9a932af7c7`,
            explorer: "https://goerli.lineascan.build",
            accounts,
            currency: "ETH",
            currencyDecimals: 18,
            chainId: 59140
        },
        linea: {
            url: `https://linea-mainnet.infura.io/v3/222d481eb67a49a980712c9a932af7c7`,
            explorer: "https://lineascan.build/",
            accounts,
            currency: "ETH",
            currencyDecimals: 18,
            chainId: 59144
        },
    },
};

module.exports = config
