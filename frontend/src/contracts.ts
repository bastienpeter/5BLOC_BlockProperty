
export const TOKEN_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const EXCHANGE_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

export const PropertyTokenABI = [
    // ERC-1155 standard
    "function balanceOf(address account, uint256 id) view returns (uint256)",
    "function safeTransferFrom(address from, address to, uint256 id, uint256 value, bytes data)",
    "function setApprovalForAll(address operator, bool approved)",
    "function isApprovedForAll(address owner, address operator) view returns (bool)",
    // Custom functions
    "function getPropertyDetails(uint256 id) view returns (tuple(string name, uint256 value, string ipfsHash, uint256 createdAt))",
    "function getSharePercentage(address user, uint256 id) view returns (uint256)",
    "function getAvailableSupply(uint256 id) view returns (uint256)",
    "function totalMinted(uint256 id) view returns (uint256)"
];

export const PropertyExchangeABI = [
    "function acquireShares(uint256 propertyId, uint256 amount) external",
    "function exchangeShares(uint256 fromId, uint256 toId, uint256 fromAmount) external",
    "function getTotalShares(address user) view returns (uint256)",
    "function getPropertyPrice(uint256 propertyId) view returns (uint256)",
    "function lastTransactionTime(address user) view returns (uint256)",
    "function lockedUntil(address user) view returns (uint256)",
    "function MAX_TOTAL_SHARES() view returns (uint256)",
    "function COOLDOWN_TIME() view returns (uint256)",
    "function LOCK_TIME() view returns (uint256)"
];

// Property IDs
export const PROPERTY_IDS = {
    MAISON: 0,
    GARE: 1,
    HOTEL: 2,
    VILLA: 3,
    SUPERMARCHE: 4,
    USINE: 5,
    CHATEAU: 6
};
