// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// import './DaiToken/ERC20Mintable.sol';

contract SaiToken is ERC20 {
    string public tokenName = "Sai Stablecoin";
    string public tokenSymbol = "SAI";
    uint8 public tokenDecimals = 18;
    // uint256 public INITIAL_SUPPLY = 12000;
    uint256 public INITIAL_SUPPLY ;

    constructor(uint256 totalSupply_) ERC20(tokenName, tokenSymbol) {
        INITIAL_SUPPLY = totalSupply_;
        _mint(msg.sender, totalSupply_);
    }
}
