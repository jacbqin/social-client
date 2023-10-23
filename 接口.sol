// SPDX-License-Identifier: MIT
//https://lineascan.build/address/0x9e813d7661d7b56cbcd3f73e958039b208925ef8#code
pragma solidity ^0.8.4;

interface ISocialSharesV2 {
    event TradeEvent(
        address traderAddress,
        bytes32 tradeAccount,
        address subjectAddress,
        bytes32 subjectAccount,
        uint8 action,
        uint256 amount,
        uint256 price,
        uint256 afterPrice,
        uint256 protocolFee,
        uint256 subjectFee,
        uint256 supply,
        uint256 balance,
        uint256 timestamp
    );

    function bind(
        bytes32 account,
        address addr,
        bytes memory signature
    ) external payable;

    function buyShares(bytes32 subjectAccount, uint256 amount) external payable;

    function sellShares(
        bytes32 subjectAccount,
        uint256 amount
    ) external payable;

    function getProtocolFee(uint256 price) external view returns (uint256 fee);

    function getSubjectFee(uint256 price) external view returns (uint256 fee);

    function subjectFeePercent() external view returns (uint256);

    function getPrice(
        uint256 supply,
        uint256 amount
    ) external view returns (uint256);

    function getBuyPrice(
        bytes32 subjectAccount,
        uint256 amount
    ) external view returns (uint256);

    function getSellPrice(
        bytes32 subjectAccount,
        uint256 amount
    ) external view returns (uint256);

    function getBuyPriceAfterFee(
        bytes32 subjectAccount,
        uint256 amount
    ) external view returns (uint256);

    function getSellPriceAfterFee(
        bytes32 subjectAccount,
        uint256 amount
    ) external view returns (uint256);

    function sharesBalance(
        bytes32 subjectAccount,
        address holder
    ) external view returns (uint256);

    function sharesSupply(
        bytes32 subjectAccount
    ) external view returns (uint256);

    function accountETHBalance(bytes32 account) external view returns (uint256);

    function addressOf(bytes32 account) external view returns (address);

    function accountOf(address addr) external view returns (bytes32);

    function protocolFeeTo() external view returns (address);

    function protocolFeePercent() external view returns (uint256);

    function totalAccountETHBalance() external view returns (uint256);
}
