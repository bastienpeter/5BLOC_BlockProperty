# BLOCKPROPERTY - Présentation du Cas d'Usage
> "L'immobilier décentralisé pour tous"

## 1. Contexte & Problématique
Les investissements immobiliers traditionnels souffrent de barrières à l'entrée élevées (>50k€), d'une illiquidité importante et de frais d'intermédiaires coûteux.

**Notre solution : BlockProperty**
Une DApp permettant d'investir dans l'immobilier fractionné dès 10 "tokens", inspirée de modèles comme Bricks.co mais entièrement décentralisée sur la Blockchain.

## 2. Le Modèle Économique (Tokenisation)
Nous représentons les actifs immobiliers sous forme de tokens fractionnés **ERC-1155**. 
Chaque propriété est divisée en **100 parts (1%)**. L'utilisateur peut acheter une fraction (ex: 10%) ou la totalité.

### Catégories d'Actifs
| Catégorie | Prix (1%) |
|-----------|-----------|
| **MAISON**| 10 €      |
| **GARE**  | 15 €      |
| **VILLA** | 20 €      |
| **HOTEL** | 25 €      |
| **SUPERMARCHE** | 30 € |
| **USINE** | 40 €      |
| **CHATEAU**| 50 €     |

## 3. Scénarios Utilisateurs

### Alice : L'étudiante (Petit Budget)
1. **Acquisition** : Alice connecte son wallet et achète **10% d'une MAISON** pour 100 tokens.
2. **Métadonnées** : Elle accède au titre de propriété stocké sur IPFS via la DApp.
3. **Limite** : Elle peut cumuler jusqu'à l'équivalent de 4 propriétés complètes (400 parts).

### Bob : Le Trader (Stratégie)
1. **Achat** : Bob possède **50% de MAISON**.
2. **Transfert** : Il transfère 10% à Alice via son adresse Ethereum.
   - *Contrainte* : Il doit attendre le **Cooldown** de 1 minute entre ses actions.
3. **Lock** : Après une acquisition, ses actifs sont bloqués (**Lock**) pendant 10 minutes pour éviter la spéculation haute fréquence.

## 4. Pourquoi la Blockchain ? (Web3 vs Web2)
- **Transparence** : L'historique des propriétaires est vérifiable (`previousOwners`).
- **Désintermédiation** : L'échange se fait via Smart Contract sans notaire.
- **Sécurité** : Les règles (Cooldown, Max Possession, Stocks) sont immuables.
