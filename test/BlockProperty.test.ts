
import { loadFixture, time } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

// SUITE DE TESTS PRINCIPALE
// Contrat : BlockProperty (ERC-1155 Fractionné)
describe("BlockProperty (ERC-1155 Fractional)", function () {

    // FIXTURE DE DEPLOIEMENT
    // Configuration initiale : 1 Owner, 2 Utilisateurs
    // Deploie Token + Echange et configure les droits
    async function deployFixture() {
        const [owner, user1, user2] = await hre.ethers.getSigners();
        console.log("\n[SETUP] Deploiement des contrats...");

        const PropertyToken = await hre.ethers.getContractFactory("PropertyToken");
        const token = await PropertyToken.deploy(owner.address);
        console.log("   > Token deploye");

        const PropertyExchange = await hre.ethers.getContractFactory("PropertyExchange");
        const exchange = await PropertyExchange.deploy(await token.getAddress(), owner.address);
        console.log("   > Echange deploye");

        // Transfert de propriété du Token vers l'Échange pour qu'il puisse Mint
        await token.transferOwnership(await exchange.getAddress());
        console.log("   > Propriete du Token transferee a l'echange");

        return { token, exchange, owner, user1, user2 };
    }

    // BLOC : DEPLOIEMENT & INITIALISATION
    // Verification des donnees de base (Nom, Prix, ID)
    describe("Deployment (Deploiement)", function () {
        it("Should initialize properties correctly (Doit initialiser les propriétés correctement)", async function () {
            const { token } = await loadFixture(deployFixture);

            console.log("\n[TEST] Verification des proprietes initiales");
            const maison = await token.getPropertyDetails(0);
            expect(maison.name).to.equal("MAISON");
            expect(maison.value).to.equal(10);
            console.log("   > Propriete 0 (MAISON) verifiee - Prix: 10");

            const gare = await token.getPropertyDetails(1);
            expect(gare.name).to.equal("GARE");
            expect(gare.value).to.equal(15);
            console.log("   > Propriete 1 (GARE) verifiee - Prix: 15");

            const hotel = await token.getPropertyDetails(2);
            expect(hotel.name).to.equal("HOTEL");
            expect(hotel.value).to.equal(25);
            console.log("   > Propriete 2 (HOTEL) verifiee - Prix: 25");

            const villa = await token.getPropertyDetails(3);
            expect(villa.name).to.equal("VILLA");
            expect(villa.value).to.equal(20);
            console.log("   > Propriete 3 (VILLA) verifiee - Prix: 20");

            const chateau = await token.getPropertyDetails(6);
            expect(chateau.name).to.equal("CHATEAU");
            expect(chateau.value).to.equal(50);
            console.log("   > Propriete 6 (CHATEAU) verifiee - Prix: 50");
        });
    });

    // BLOC : ACQUISITION & ACHAT
    // Tests : Achat simple, Cooldown, Limites, Stocks, Cas d'erreur (0%, ID Invalide)
    describe("Acquisition", function () {

        // FONCTION : ACHAT SIMPLE
        it("Should allow acquiring shares (Doit permettre d'acquérir des parts)", async function () {
            const { exchange, token, user1 } = await loadFixture(deployFixture);

            console.log("\n[TEST] Achat de parts");
            console.log("   > User1 achete 30% de MAISON");
            // Acheter 30% de MAISON
            await exchange.connect(user1).acquireShares(0, 30);

            const balance = await token.balanceOf(user1.address, 0);
            console.log(`   > Solde User1: ${balance}%`);

            expect(balance).to.equal(30);
            expect(await token.getSharePercentage(user1.address, 0)).to.equal(30);
        });

        // FONCTION : VERIFICATION ERREUR MONTANT NUL
        it("Should fail if amount is 0 (Doit echouer si montant = 0)", async function () {
            const { exchange, user1 } = await loadFixture(deployFixture);
            console.log("\n[TEST] Achat Montant Invalide (0)");

            console.log("   > Tentative d'achat de 0%...");
            await expect(
                exchange.connect(user1).acquireShares(0, 0)
            ).to.be.revertedWith("Montant invalide");
            console.log("   > Echec attendu (Revert: Montant invalide)");
        });

        // FONCTION : VERIFICATION ID INVALIDE
        it("Should fail if property ID is invalid (Doit echouer si ID invalide)", async function () {
            const { exchange, user1 } = await loadFixture(deployFixture);
            console.log("\n[TEST] Achat ID Invalide");

            console.log("   > Tentative d'achat Propriete ID 99...");
            await expect(
                exchange.connect(user1).acquireShares(99, 10)
            ).to.be.revertedWith("Propriété invalide");
            console.log("   > Echec attendu (Revert: Propriete invalide)");
        });

        // FONCTION : VERIFICATION COOLDOWN (DELAI)
        it("Should enforce Cooldown (Doit appliquer le délai de 1 min)", async function () {
            const { exchange, user1 } = await loadFixture(deployFixture);
            console.log("\n[TEST] Verification du Cooldown");

            await exchange.connect(user1).acquireShares(0, 10);
            console.log("   > Achat 1 (10%) effectue");

            console.log("   > Tentative immediate Achat 2...");
            await expect(
                exchange.connect(user1).acquireShares(0, 10)
            ).to.be.revertedWith("Cooldown actif (veuillez patienter)");
            console.log("   > Echec attendu (Revert: Cooldown actif)");

            console.log("   > Attente 60 secondes...");
            await time.increase(60);

            await expect(
                exchange.connect(user1).acquireShares(0, 10)
            ).not.to.be.reverted;
            console.log("   > Achat 2 reussi apres attente");
        });

        // FONCTION : LIMITE POSSESSION (MAX 400)
        it("Should enforce max possession limit (Doit limiter à 400 parts max)", async function () {
            const { exchange, user1 } = await loadFixture(deployFixture);
            console.log("\n[TEST] Limite de possession (400 parts)");

            // Acheter 100% de MAISON
            await exchange.connect(user1).acquireShares(0, 100);
            console.log("   > Achat 100% MAISON");
            await time.increase(60);

            // Acheter 100% de GARE
            await exchange.connect(user1).acquireShares(1, 100);
            console.log("   > Achat 100% GARE");
            await time.increase(60);

            // Acheter 100% de HOTEL
            await exchange.connect(user1).acquireShares(2, 100);
            console.log("   > Achat 100% HOTEL");
            await time.increase(60);

            // Acheter 100% de VILLA
            await exchange.connect(user1).acquireShares(3, 100);
            console.log("   > Achat 100% VILLA");
            await time.increase(60);

            console.log("   > Tentative achat supplementaire...");
            // Tenter d'acheter plus - devrait échouer (max 400%)
            await expect(
                exchange.connect(user1).acquireShares(4, 10)
            ).to.be.revertedWith("Dépasse la limite de possession");
            console.log("   > Echec attendu (Revert: Dépasse limite)");
        });

        // FONCTION : VERIFICATION STOCK DISPONIBLE
        it("Should respect available supply (Doit respecter l'offre disponible)", async function () {
            const { exchange, user1, user2 } = await loadFixture(deployFixture);
            console.log("\n[TEST] Verification des Stocks");

            // User1 achète 80%
            await exchange.connect(user1).acquireShares(0, 80);
            console.log("   > User1 prend 80% du stock");
            await time.increase(60);

            // User2 essaie d'acheter 30% - devrait échouer
            console.log("   > User2 veut 30% (reste 20%)...");
            await expect(
                exchange.connect(user2).acquireShares(0, 30)
            ).to.be.revertedWith("Offre insuffisante");
            console.log("   > Echec attendu (Revert: Offre insuffisante)");

            // User2 achète 20% - devrait marcher
            await expect(
                exchange.connect(user2).acquireShares(0, 20)
            ).not.to.be.reverted;
            console.log("   > User2 prend les 20% restants (Succes)");
        });
    });

    // BLOC : TRANSFERTS
    describe("Transfer (Transfert)", function () {

        // FONCTION : TRANSFERT ENTRE UTILISATEURS
        it("Should allow partial transfer of shares (Doit permettre le transfert partiel)", async function () {
            const { exchange, token, user1, user2 } = await loadFixture(deployFixture);
            console.log("\n[TEST] Transfert entre utilisateurs");

            // User1 achète 50%
            await exchange.connect(user1).acquireShares(0, 50);
            console.log("   > User1 a 50%");

            // Transfère 20% à User2
            console.log("   > Transfert de 20% vers User2");
            await token.connect(user1).safeTransferFrom(user1.address, user2.address, 0, 20, "0x");

            const bal1 = await token.balanceOf(user1.address, 0);
            const bal2 = await token.balanceOf(user2.address, 0);
            console.log(`   > Solde User1: ${bal1}% | Solde User2: ${bal2}%`);

            expect(bal1).to.equal(30);
            expect(bal2).to.equal(20);
        });

        // FONCTION : CAS LIMITE (AUTO-TRANSFERT)
        it("Should handle self-transfer gracefully (Doit gerer l'auto-transfert)", async function () {
            const { exchange, token, user1 } = await loadFixture(deployFixture);
            console.log("\n[TEST] Auto-transfert (User1 -> User1)");

            await exchange.connect(user1).acquireShares(0, 50);
            console.log("   > User1 a 50%");

            console.log("   > User1 s'envoie 10%...");
            await token.connect(user1).safeTransferFrom(user1.address, user1.address, 0, 10, "0x");

            const bal = await token.balanceOf(user1.address, 0);
            console.log(`   > Solde final User1: ${bal}% (Inchange)`);
            expect(bal).to.equal(50);
        });
    });

    // BLOC : ECHANGES (SWAP)
    describe("Exchange (Échange)", function () {

        // FONCTION : ECHANGE REUSSI
        it("Should exchange shares between properties (Doit échanger des parts)", async function () {
            const { exchange, token, user1 } = await loadFixture(deployFixture);
            console.log("\n[TEST] Echange de proprietes");

            // Acheter 30% de MAISON (valeur = 10 ch., total = 300)
            await exchange.connect(user1).acquireShares(0, 30);
            console.log("   > User1 a 30% MAISON (Valeur 300)");

            // Attendre Lock + Cooldown (2 minutes = 120s)
            console.log("   > Attente fin de Lock (120s)...");
            await time.increase(120);

            // Échanger 30% MAISON (valeur 300) contre GARE (15 ch.) = 20% GARE
            console.log("   > Echange contre GARE (Valeur u. 15)");
            await exchange.connect(user1).exchangeShares(0, 1, 30);

            const balMaison = await token.balanceOf(user1.address, 0);
            const balGare = await token.balanceOf(user1.address, 1);
            console.log(`   > Resultat: MAISON ${balMaison}% | GARE ${balGare}%`);

            expect(balMaison).to.equal(0);
            expect(balGare).to.equal(20);
        });

        // FONCTION : ECHANGE ECHOUE (VALEUR INSUFFISANTE)
        it("Should fail exchange if value is too low (Doit echouer si valeur trop faible)", async function () {
            const { exchange, user1 } = await loadFixture(deployFixture);
            console.log("\n[TEST] Echange Valeur Insuffisante");

            // Maison (10) vs Chateau (50). 3% Maison = 30 val. < 50 (1% chateau).
            await exchange.connect(user1).acquireShares(0, 3);
            console.log("   > User1 a 3% MAISON (Valeur 30)");

            await time.increase(120);

            console.log("   > Tentative echange contre CHATEAU (Valeur 50)...");
            await expect(
                exchange.connect(user1).exchangeShares(0, 6, 3)
            ).to.be.revertedWith("Valeur trop faible pour échange");
            console.log("   > Echec attendu (Revert: Valeur trop faible)");
        });
    });
});
