# Rapport Technique - BlockProperty

## 1. Architecture Technique
Le projet repose sur une architecture DApp standard :
- **Blockchain** : Ethereum (EVM compatible), simulé avec Hardhat.
- **Smart Contracts** : Solidity 0.8.24.
- **Standards** : **ERC-1155** (Multi-Token) pour la gestion des parts fractionnées.
- **Stockage** : IPFS (via **Pinata**) pour les métadonnées.

### Choix de Conception : ERC-1155 (Fractionné)
Nous avons choisi le standard **ERC-1155** car :
1. Il permet de gérer plusieurs types de tokens (les 7 propriétés) dans un seul contrat.
2. Il supporte nativement la **fongibilité fractionnée** (partage de propriété) tout en gardant des IDs distincts.
3. C'est plus efficient en Gas que de déployer 7 contrats ERC-20 ou ERC-721.

## 2. Implémentation des Contraintes Métiers

### 2.1 Tokenisation & Catégories
Le contrat `PropertyToken.sol` gère les parts.
- **Fractionnement** : Chaque propriété (ID 0 à 6) dispose de 100 parts (1% chacune).
- **Metadata** : Struct `PropertyMetadata` (Nom, Valeur, Hashes, `lastTransferAt`).
- **Historique** : `previousOwners` tracké lors des transferts.

### 2.2 Échange (Exchange Logic)
Le contrat `PropertyExchange.sol` permet d'acquérir et d'échanger des parts.
- **Acquisition** : Achat de pourcentage spécifique.
- **Vérifications** : Solde suffisant, Offre disponible, Respect des limites.

### 2.3 Contraintes Temporelles & Limites
Les règles sont appliquées via des `modifiers` :
- **Max Possession** : `MAX_TOTAL_SHARES = 400`. Cela correspond à l'équivalent de **4 propriétés complètes** (400%), respectant la contrainte "Max 4 ressources".
- **Cooldown (1 min)** : Délai entre transactions.
- **Lock (2 min)** : Blocage après acquisition (réduit pour faciliter les tests, au lieu de 10 min).

## 3. Stockage des Données (IPFS)
Les métadonnées sont stockées JSON sur IPFS via Pinata.
Le Smart Contract stocke le CID de base (`bafy...`) et construit l'URI dynamiquement :
`ipfs://<CID>/<id>.json`

## 4. Tests et Sécurité
Tests Hardhat (`test/BlockProperty.test.ts`) couvrant :
- Acquisition partielle (ex: 30%).
- Transfert partiel.
- Limites (400%) et Contraintes de temps.
