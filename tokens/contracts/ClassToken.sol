// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract ClassToken is ERC20, ERC20Capped, ERC20Permit {
    constructor(address initialHolder)
        ERC20("ClassToken", "CTK")
        ERC20Capped(1_000_000 * 10 ** 18)
        ERC20Permit("ClassToken")
    {
        _mint(initialHolder, 1_000_000 * 10 ** 18);
    }

    // Cả ERC20 và ERC20Capped cùng định nghĩa _update nên bắt buộc override cả hai
    function _update(address from, address to, uint256 value)
        internal
        virtual
        override(ERC20, ERC20Capped)
    {
        super._update(from, to, value);
    }
}