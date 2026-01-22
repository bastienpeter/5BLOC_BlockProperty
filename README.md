# BlockProperty - DApp d'Investissement Immobilier Fractionné

**Module :** Blockchain & Web3  
**École :** SUPINFO  
**Année :** 2024-2025

---

## 1. Contexte et Objectifs

Ce projet a été réalisé dans le cadre du module de développement Blockchain. L'objectif était de concevoir une Application Décentralisée (DApp) répondant à une problématique concrète tout en respectant un ensemble de contraintes techniques et métiers strictes.

**Cas d'usage choisi :** L'investissement immobilier fractionné.
Le projet **BlockProperty** permet de démocratiser l'accès à l'investissement immobilier en permettant aux utilisateurs d'acquérir des parts de propriétés (de 1% à 100%) sous forme de tokens sur la Blockchain. Cela résout les problèmes de barrière à l'entrée et d'illiquidité du marché traditionnel.


---

## 2. Documentation Détaillée

Pour une compréhension approfondie du projet, veuillez consulter les documents suivants situés dans le dossier `/docs` :

- **Présentation du Cas d'Usage** : Détail de la problématique, des personas (Alice & Bob) et du modèle économique.
- **Rapport Technique** : Justification des choix techniques (ERC-1155, IPFS), architecture et sécurité.

---

## 3. Architecture Technique

Le projet repose sur une stack technique moderne orientée Web3 :

- **Blockchain :** Ethereum (environnement de développement Hardhat).
- **Smart Contracts :** Solidity (v0.8.24).
  - Utilisation du standard **ERC-1155** pour la gestion des tokens fractionnés (Multi-Token Standard).
  - Utilisation de la bibliothèque **OpenZeppelin** pour la sécurité (Ownable, ReentrancyGuard).
- **Frontend :** React (Vite) + TypeScript.
  - Interaction Blockchain via **Ethers.js (v6)**.
- **Stockage Décentralisé :** IPFS (InterPlanetary File System) pour l'hébergement des métadonnées des propriétés.

---

## 4. Fonctionnalités et Règles Métiers

L'application respecte les contraintes suivantes :

### A. Tokenisation des Ressources
Les biens sont représentés par des tokens ERC-1155. Chaque bien dispose d'une offre totale de **100 parts** (1 part = 1% du bien).
**7 propriétés sont disponibles :**
1. Maison (10 tokens/part)
2. Gare (15 tokens/part)
3. Hôtel (25 tokens/part)
4. Villa (20 tokens/part)
5. Supermarché (30 tokens/part)
6. Usine (40 tokens/part)
7. Château (50 tokens/part)

### B. Échanges et Transferts
- **Acquisition :** L'utilisateur peut acheter un pourcentage précis d'un bien.
- **Transfert :** Possibilité de transférer des parts (en %) à un autre utilisateur via son adresse Ethereum.

### C. Limites de Possession
Pour éviter la centralisation des biens par un seul acteur :
- **Limite Globale :** Un utilisateur ne peut posséder plus de **400 parts** au total (toutes propriétés confondues), ce qui équivaut à la possession de 4 propriétés complètes.

### D. Contraintes Temporelles (Sécurité)
- **Cooldown :** Un délai de **1 minute** est imposé entre chaque transaction d'achat ou de transfert pour éviter le spam.
- **Lock Temporaire :** Après une acquisition, le compte de l'utilisateur est verrouillé pour **2 minutes** (réduit pour faciliter les tests) empêchant toute nouvelle transaction critique.

---

## 5. Installation et Démarrage

### Prérequis
- Node.js (v18+)
- Git
- Navigateur avec l'extension **MetaMask** installée.

### Procédure Automatique (Recommandée)
Un script d'automatisation est fourni pour lancer l'environnement complet :

1. Ouvrez un terminal à la racine du projet.
2. Exécutez le script : `start_servers.bat` (ou double-cliquez dessus).
   - *Ce script lance le nœud Hardhat, déploie les contrats et démarre le serveur Frontend.*
3. Pour arrêter proprement : `stop_servers.bat`.

### Procédure Manuelle
Si vous souhaitez lancer les services séparément :

1. **Installation des dépendances :**
   ```bash
   npm install
   cd frontend
   npm install
   cd ..
   ```

2. **Démarrage de la Blockchain locale :**
   ```bash
   npx hardhat node
   ```

3. **Déploiement des Smart Contracts :**
   ```bash
   npx hardhat run scripts/deploy.ts --network localhost
   ```

4. **Lancement de l'interface utilisateur :**
   ```bash
   cd frontend
   npm run dev
   ```

---

## 6. Configuration de MetaMask

Pour utiliser l'application, configurez MetaMask sur le réseau local :

- **Nom du réseau :** Hardhat Localhost
- **URL RPC :** http://127.0.0.1:8545
- **ID de chaîne :** 31337
- **Symbole :** ETH

Importez ensuite l'un des comptes de test fournis par Hardhat (affichés dans le terminal `npx hardhat node`) en utilisant sa **clé privée**.

---

## 7. Tests et Validation

Le projet inclut une suite de tests unitaires complète et un script d'automatisation fournissant un rapport détaillé (logs verbeux + consommation de Gas).

### Exécution
Pour lancer la campagne de test complète :
- **Sous Windows** : Exécutez le script **`test_integral.bat`** (double-clic ou ligne de commande).
- **Commande manuelle** :
  ```bash
  npx hardhat test
  ```

### Détails de la Couverture (11 Tests)
Le script valide les scénarios nominaux et les cas limites :
- **Initialisation** : Vérification des prix et noms des 7 propriétés.
- **Acquisition** : Achat simple, gestion des erreurs (montant nul, mauvaise propriété).
- **Limites Métiers** :
  - **Cooldown** : Respect du délai entre transactions.
  - **Max Possession** : Blocage au-delà de 400 parts.
  - **Stocks** : Impossibilité d'acheter plus que l'offre disponible.
- **Transactions Complexes** :
  - **Transfert** : Envoi de parts à un tiers + test d'auto-transfert.
  - **Échange (Swap)** : Conversion de propriété avec vérification des valeurs.
- **Performance** : Rapport de consommation de Gas généré automatiquement à la fin du test.

---

## 8. Structure du Projet

- `/contracts` : Code source Solidity (`PropertyToken.sol`, `PropertyExchange.sol`).
- `/frontend` : Code de l'interface React.
- `/scripts` : Scripts de déploiement et de génération de métadonnées.
- `/test` : Tests unitaires TypeScript (Hardhat/Chai).
- `/docs` : Documentation additionnelle (Cas d'usage, Rapport technique).
- `/metadata` : Fichiers JSON générés pour IPFS.

---

**Auteurs :**
Projet étudiant SUPINFO.
