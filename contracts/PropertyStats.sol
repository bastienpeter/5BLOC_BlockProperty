// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library PropertyStats {
    enum Category { MAISON, GARE, HOTEL }
    
    struct PropertyInfo {
        uint256 value; // Price in lowest denomination
        uint256 maxSupply;
    }
}
