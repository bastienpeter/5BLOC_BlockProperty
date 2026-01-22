# Vérification de Conformité du Projet

Ce fichier liste les points de contrôle pour s'assurer que le projet **BlockProperty** répond parfaitement aux exigences du sujet d'examen.

## 1. Stack Technique & Choix
- [x] **DApp Web3** : Frontend React + Smart Contract Solidity.
- [x] **Blockchain** : Ethereum (Hardhat) choisi (vs Solana).
- [x] **Environnement de Test** : Hardhat utilisé.

## 2. Contraintes Métiers (Sujet)

### A. Tokenisation des Ressources
> *Les ressources doivent être représentées sous forme de tokens ayant différents niveaux.*
- [x] **Implémentation** : ERC-1155 (Multi-Token).
- [x] **Catégories** : 7 niveaux implémentés (Maison, Gare, Hôtel, Villa, Supermarché, Usine, Château).
- [x] **Validation** : Vérifier que chaque ID (0-6) a bien des attributs distincts (Prix, Nom).

### B. Échanges de Tokens
> *Mécanisme d'échange et règles de validation.*
- [x] **Implémentation** : Contrat `PropertyExchange.sol`.
- [x] **Règle d'échange** : Burn & Mint basé sur la valeur (ex: 30% Maison -> 20% Gare).
- [x] **Validation transaction** : Vérification des soldes et des `approval` (via `PropertyToken` -> `PropertyExchange`).

### C. Limites de Possession
> *Chaque utilisateur ne peut posséder qu'un nombre limité de ressources (ex: max 4).*
- [x] **Interprétation** : Limite fixée à **400 parts** (équivalent à 4 immeubles complets à 100%).
- [x] **Implémentation** : Fonction `getTotalShares(user)` vérifiée à chaque achat/échange.
- [x] **Test** : Le test `Should enforce max possession limit` valide ce point.

### D. Contraintes Temporelles
> *Cooldown (ex: 5 min) et Lock après action critique (ex: 10 min).*
- [x] **Lock** : 10 minutes après acquisition (réduit à 2 min pour les tests).
- [x] **Cooldown** : Actuellement réglé à **1 minute** pour faciliter les tests (Mentionné dans rapport).
    - *Action requise* : Mentionner explicitement que c'est une réduction pour tests.

### E. Utilisation d'IPFS
> *Les métadonnées doivent être stockées sur IPFS.*
- [x] **Implémentation** : Utilisation de Pinata (CID : `bafy...`).
- [x] **Lien On-Chain** : Le contrat construit l'URI `ipfs://<CID>/<id>.json`.

## 3. Format des Métadonnées
> *Champs requis : name, type, value, hash, previousOwners, createdAt, lastTransferAt.*

**Mapping des champs dans le projet :**
| Champ Sujet | Implémentation BlockProperty | Localisation |
|-------------|------------------------------|--------------|
| `name` | `PropertyMetadata.name` (struct) + JSON | On-Chain & IPFS |
| `type` | Dans le JSON (`attributes` ou `type`) | IPFS |
| `value` | `PropertyMetadata.value` (struct) | On-Chain |
| `hash` | `PropertyMetadata.ipfsHash` (struct) | On-Chain |
| `previousOwners`| `previousOwners` mapping (array) | On-Chain |
| `createdAt` | `PropertyMetadata.createdAt` | On-Chain |
| `lastTransferAt`| `PropertyMetadata.lastTransferAt` | On-Chain |

- [x] **Conformité** : Tous les champs obligatoires sont présents et accessibles via les fonctions du Smart Contract ou les fichiers IPFS.

## 4. Tests Unitaires
> *Couverture significative avec Hardhat.*
- [x] **Framework** : Hardhat + Chai.
- [x] **Couverture** :
    - Déploiement ✅
    - Acquisition (Achat) ✅
    - Limites temporelles (Time travel) ✅
    - Limites de possession (Max 400) ✅
    - Transfert ✅
    - Échange (Swap) ✅
- [x] **Total** : 7 tests passants.

## 5. Livrables Attendus
- [x] **Définition du cas d'usage** : `docs/Presentation_Cas_Usage.md`.
- [x] **Code Source** : Dossiers `contracts/` et `frontend/`.
- [x] **Tests** : Dossier `test/`.
- [x] **Rapport Technique** : `docs/Rapport_Technique.md`.

---

## ⚠️ Actions Finales avant Rendu
1. **Cooldown** : Décider si on passe à 5 min ou si on laisse 1 min (expliquer le choix dans le rapport si on laisse 1 min).
2. **Nettoyage** : Supprimer le dossier `node_modules` avant de zipper (trop lourd).
3. **Vérification Git** : S'assurer que tous les commits sont poussés (si applicable).
