// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import './SaiToken.sol';

contract EthSwap {
    string public name = "EthSwap Instant Exchange";
    SaiToken public token;
    uint public rate = 100;

    event TokensPurchased(address account, address token, uint amount, uint rate);
    event TokensSold(address account, address token, uint amount, uint rate);

    constructor(SaiToken _token) {
        token = _token;
    }

    function  buyTokens() public payable {
        //calculate the number of tokens to buy
        //redemtion rate = # of ttokens they receive for 1 ether.
        // Amount of Ethereum * redemption rate
        uint tokenAmount = msg.value * rate;
        require(token.balanceOf(address(this)) >= tokenAmount);
        token.transfer(msg.sender, tokenAmount);
        //Emit an event
        emit TokensPurchased(msg.sender, address(token), tokenAmount, rate);
    }

    function  sellTokens(uint _amount) public payable {
        //users ccan't sell more tokens than they have
        require(token.balanceOf(msg.sender) >= _amount, "Your SaiBalance is not sufficient");


        //calculate the number of tokens to buy
        //redemtion rate = # of ttokens they receive for 1 ether.
        // ether amount = Amount of tokens / redemption rate
        uint etherAmount = _amount/rate;
        require(address(this).balance >= etherAmount, "Ether balance of EthSwap contract is not sufficient");

        //peform sale
        token.transferFrom(msg.sender, address(this), _amount);
        payable(msg.sender).transfer(etherAmount);

        //Emit an TokensSold event
        emit TokensSold(msg.sender, address(token), _amount, rate);

    }
}