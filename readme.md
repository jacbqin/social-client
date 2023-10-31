# social shares client

## init

```shell
# copy env-example.js to env.js, replace keys/address in env.js
cp env-example.js env.js

# install required libraries
npm i

# run in base testnet
npx hardhat run main.js --network basegoerli

# run in base mainnet
npx hardhat run main.js --network base

# run in zksync mainnet
npx hardhat run main.js --network zksync

# run in zksync testnet
npx hardhat run main.js --network zkgoerli
```