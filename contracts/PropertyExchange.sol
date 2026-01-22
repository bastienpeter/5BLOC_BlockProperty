// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./PropertyToken.sol";
import "./PropertyStats.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract PropertyExchange is Ownable, ReentrancyGuard {
    PropertyToken public tokenContract;
    
    // Limites du système
    uint256 public constant MAX_TOTAL_SHARES = 400; // Total Max de parts (Correspond à "4 ressources complètes")
    uint256 public constant COOLDOWN_TIME = 1 minutes;
    uint256 public constant LOCK_TIME = 2 minutes;

    // Suivi de l'état des utilisateurs
    mapping(address => uint256) public lastTransactionTime; // Dernière action
    mapping(address => uint256) public lockedUntil; // Verrouillage compte

    event SharesAcquired(address indexed user, uint256 propertyId, uint256 amount);
    event SharesExchanged(address indexed user, uint256 fromId, uint256 toId, uint256 fromAmount, uint256 toAmount);

    constructor(address _tokenContract, address initialOwner) Ownable(initialOwner) {
        tokenContract = PropertyToken(_tokenContract);
    }

    modifier checkCooldown() {
        require(block.timestamp >= lastTransactionTime[msg.sender] + COOLDOWN_TIME, unicode"Cooldown actif (veuillez patienter)");
        _;
        lastTransactionTime[msg.sender] = block.timestamp;
    }

    modifier checkLock() {
        require(block.timestamp >= lockedUntil[msg.sender], unicode"Compte verrouille temporairement");
        _;
    }

    // Obtenir le total des parts possédées par un utilisateur (toutes propriétés confondues)
    function getTotalShares(address user) public view returns (uint256) {
        uint256 total = 0;
        for (uint256 i = 0; i <= 6; i++) {
            total += tokenContract.balanceOf(user, i);
        }
        return total;
    }

    // Acquérir des parts d'une propriété (en pourcentage)
    // amount = pourcentage (1-100)
    function acquireShares(uint256 propertyId, uint256 amount) external nonReentrant checkCooldown {
        require(propertyId <= 6, unicode"Propriété invalide");
        require(amount > 0 && amount <= 100, "Montant invalide");
        require(tokenContract.getAvailableSupply(propertyId) >= amount, "Offre insuffisante");
        
        // Vérification de la limite de possession
        uint256 newTotal = getTotalShares(msg.sender) + amount;
        require(newTotal <= MAX_TOTAL_SHARES, unicode"Dépasse la limite de possession");

        // Mint (création) des parts
        tokenContract.mint(msg.sender, propertyId, amount);
        
        // Application du verrouillage (Lock)
        lockedUntil[msg.sender] = block.timestamp + LOCK_TIME;
        
        emit SharesAcquired(msg.sender, propertyId, amount);
    }

    // Échanger des parts d'une propriété vers une autre
    // Brûle `fromAmount` de `fromId`, et Mint la valeur équivalente de `toId`
    function exchangeShares(uint256 fromId, uint256 toId, uint256 fromAmount) external nonReentrant checkCooldown checkLock {
        require(fromId <= 6 && toId <= 6, unicode"Propriété invalide");
        require(fromId != toId, unicode"Même propriété");
        require(tokenContract.balanceOf(msg.sender, fromId) >= fromAmount, "Parts insuffisantes");

        // Récupération des valeurs
        PropertyToken.PropertyMetadata memory fromProp = tokenContract.getPropertyDetails(fromId);
        PropertyToken.PropertyMetadata memory toProp = tokenContract.getPropertyDetails(toId);

        // Calcul de l'équivalence
        uint256 fromValue = fromAmount * fromProp.value;
        uint256 toAmount = fromValue / toProp.value;
        require(toAmount > 0, unicode"Valeur trop faible pour échange");
        require(tokenContract.getAvailableSupply(toId) >= toAmount, unicode"Offre insuffisante pour l'échange");

        // Vérification limite après échange
        uint256 newTotal = getTotalShares(msg.sender) - fromAmount + toAmount;
        require(newTotal <= MAX_TOTAL_SHARES, unicode"Dépasse la limite de possession après échange");

        // Exécution
        tokenContract.burn(msg.sender, fromId, fromAmount);
        tokenContract.mint(msg.sender, toId, toAmount);

        // Application du verrouillage
        lockedUntil[msg.sender] = block.timestamp + LOCK_TIME;

        emit SharesExchanged(msg.sender, fromId, toId, fromAmount, toAmount);
    }

    // Obtenir le prix d'une propriété pour 1%
    function getPropertyPrice(uint256 propertyId) public view returns (uint256) {
        return tokenContract.getPropertyDetails(propertyId).value;
    }
}
