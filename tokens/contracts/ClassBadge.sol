// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract ClassBadge is ERC721, Ownable {
    using Strings for uint256;

    // Custom error khi không nhập tên sinh viên
    error EmptyName();

    uint256 private _nextTokenId;
    mapping(uint256 => string) private _studentNames;

    constructor() ERC721("ClassBadge", "CBG") Ownable(msg.sender) {}

    // Mint NFT chỉ dành cho Owner, trả về tokenId mới
    function mint(address to, string calldata studentName) external onlyOwner returns (uint256) {
        if (bytes(studentName).length == 0) revert EmptyName();

        uint256 tokenId = _nextTokenId++;
        _studentNames[tokenId] = studentName;
        _safeMint(to, tokenId);
        return tokenId;
    }

    // Dựng toàn bộ SVG và JSON metadata on-chain dạng data:application/json;base64,...
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        string memory student = _studentNames[tokenId];

        // 1. Tạo ảnh SVG on-chain dạng base64
        string memory svg = Base64.encode(
            bytes(
                string.concat(
                    '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">',
                    '<rect width="100%" height="100%" fill="#1a1a2e"/>',
                    '<text x="50%" y="40%" dominant-baseline="middle" text-anchor="middle" fill="#00ffcc" font-size="20">ClassBadge</text>',
                    '<text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-size="16">',
                    student,
                    '</text></svg>'
                )
            )
        );
        string memory imageUri = string.concat("data:image/svg+xml;base64,", svg);

        // 2. Tạo metadata JSON on-chain dạng base64
        string memory json = Base64.encode(
            bytes(
                string.concat(
                    '{"name":"ClassBadge #',
                    tokenId.toString(),
                    '","description":"On-chain TrustKeys Class Badge","image":"',
                    imageUri,
                    '","attributes":[{"trait_type":"Student","value":"',
                    student,
                    '"}]}'
                )
            )
        );

        return string.concat("data:application/json;base64,", json);
    }
}