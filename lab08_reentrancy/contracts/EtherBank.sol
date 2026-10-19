// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract EtherBank is ReentrancyGuard {
    mapping(address => uint256) public balances;

    function deposit() external payable {
        require(msg.value > 0, "Deposit phai lon hon 0");
        balances[msg.sender] += msg.value;
    }

    // Áp dụng modifier nonReentrant và mô hình CEI
    function withdraw() external nonReentrant {
        // 1. CHECKS: Kiểm tra điều kiện tiên quyết
        uint256 bal = balances[msg.sender];
        require(bal > 0, "no balance");

        // 2. EFFECTS: Xóa số dư VỀ 0 TRƯỚC khi gọi ra bên ngoài
        balances[msg.sender] = 0;

        // 3. INTERACTIONS: Chuyển tiền ra ngoài sau cùng
        (bool ok, ) = msg.sender.call{value: bal}("");
        require(ok, "transfer failed");
    }
}