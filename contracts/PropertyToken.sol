// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./PropertyStats.sol";

    // Token Fractionné de Propriété (Standard ERC-1155)
    // ID Token : 0 = MAISON, 1 = GARE, etc.
    // Chaque propriété a une offre max de 100 (représentant 100%)
    contract PropertyToken is ERC1155, Ownable {

    // Métadonnées pour chaque type de propriété
    struct PropertyMetadata {
        string name;
        uint256 value; // Prix pour 1%
        string ipfsHash;
        uint256 createdAt;
        uint256 lastTransferAt;
    }

    // Mapping ID Token -> Métadonnées
    mapping(uint256 => PropertyMetadata) public propertyData;
    
    // Mapping ID Token -> Offre totale déjà "mintée" (émise)
    mapping(uint256 => uint256) public totalMinted;
    
    // Mapping ID Token -> Liste des anciens propriétaires (simplifié: garde les 10 derniers)
    mapping(uint256 => address[]) public previousOwners;

    // Offre max par propriété (100 parts = 100%)
    uint256 public constant MAX_SUPPLY_PER_PROPERTY = 100;

    event PropertyCreated(uint256 indexed tokenId, string name, uint256 value);
    event SharesMinted(address indexed to, uint256 indexed tokenId, uint256 amount);
    event SharesBurned(address indexed from, uint256 indexed tokenId, uint256 amount);

    constructor(address initialOwner) 
        ERC1155("ipfs://") 
        Ownable(initialOwner) 
    {
        string memory baseCid = "bafybeifs5rhbjj5cysdzr6wtfmcgmii6xrf6unzvhvals5bkrtgu2xrpwi";
        
        // Initialisation des propriétés avec les vrais URIs IPFS (CID/id.json)
        // Construction manuelle de la string pour économiser du gas dans ce projet étudiant
        _initProperty(0, "MAISON", 10, string(abi.encodePacked("ipfs://", baseCid, "/0.json")));
        _initProperty(1, "GARE", 15, string(abi.encodePacked("ipfs://", baseCid, "/1.json")));
        _initProperty(2, "HOTEL", 25, string(abi.encodePacked("ipfs://", baseCid, "/2.json")));
        _initProperty(3, "VILLA", 20, string(abi.encodePacked("ipfs://", baseCid, "/3.json")));
        _initProperty(4, "SUPERMARCHE", 30, string(abi.encodePacked("ipfs://", baseCid, "/4.json")));
        _initProperty(5, "USINE", 40, string(abi.encodePacked("ipfs://", baseCid, "/5.json")));
        _initProperty(6, "CHATEAU", 50, string(abi.encodePacked("ipfs://", baseCid, "/6.json")));
    }

    function _initProperty(uint256 id, string memory name, uint256 value, string memory ipfsHash) internal {
        propertyData[id] = PropertyMetadata({
            name: name,
            value: value,
            ipfsHash: ipfsHash,
            createdAt: block.timestamp,
            lastTransferAt: 0
        });
        emit PropertyCreated(id, name, value);
    }

    // Créer (Mint) des parts d'une propriété (seulement Owner/Exchange peut appeler)
    function mint(address to, uint256 id, uint256 amount) public onlyOwner {
        require(id <= 6, unicode"ID de propriété invalide");
        require(totalMinted[id] + amount <= MAX_SUPPLY_PER_PROPERTY, unicode"Dépasse l'offre max");
        
        _mint(to, id, amount, "");
        totalMinted[id] += amount;
        
        emit SharesMinted(to, id, amount);
    }

    // Brûler (Burn) des parts
    function burn(address from, uint256 id, uint256 amount) public onlyOwner {
        require(balanceOf(from, id) >= amount, "Solde insuffisant");
        _burn(from, id, amount);
        totalMinted[id] -= amount;
        emit SharesBurned(from, id, amount);
    }

    // Récupérer les détails d'une propriété
    function getPropertyDetails(uint256 id) public view returns (PropertyMetadata memory) {
        return propertyData[id];
    }

    // Récupérer le pourcentage de parts d'un utilisateur
    function getSharePercentage(address user, uint256 id) public view returns (uint256) {
        return balanceOf(user, id); // Chaque unité = 1%
    }

    // Surcharge de safeTransferFrom pour suivre l'historique
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 value,
        bytes memory data
    ) public override {
        super.safeTransferFrom(from, to, id, value, data);
        
        // Mise à jour des métadonnées
        propertyData[id].lastTransferAt = block.timestamp;

        // Suivi de l'ancien propriétaire (garde les 10 derniers)
        if (previousOwners[id].length < 10) {
            previousOwners[id].push(from);
        }
    }

    // Obtenir l'offre disponible pour une propriété
    function getAvailableSupply(uint256 id) public view returns (uint256) {
        return MAX_SUPPLY_PER_PROPERTY - totalMinted[id];
    }

    // Surcharge URI pour les métadonnées IPFS
    function uri(uint256 id) public view override returns (string memory) {
        return propertyData[id].ipfsHash;
    }
}
