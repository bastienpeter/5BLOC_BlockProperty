
import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    // 1. Déploiement du Token
    const PropertyToken = await ethers.getContractFactory("PropertyToken");
    const token = await PropertyToken.deploy(deployer.address);
    await token.waitForDeployment();
    const tokenAddress = await token.getAddress();
    console.log("PropertyToken déployé à :", tokenAddress);

    // 2. Déploiement de l'Échange
    const PropertyExchange = await ethers.getContractFactory("PropertyExchange");
    const exchange = await PropertyExchange.deploy(tokenAddress, deployer.address);
    await exchange.waitForDeployment();
    const exchangeAddress = await exchange.getAddress();
    console.log("PropertyExchange déployé à :", exchangeAddress);

    // 3. Transfert de propriété du Token vers l'Échange (pour qu'il puisse Mint)
    const tx = await token.transferOwnership(exchangeAddress);
    await tx.wait();
    console.log("Propriété du Token transférée à l'Échange");

    // 4. Mise à jour automatique de la configuration Frontend
    const fs = require("fs");
    const contractsPath = __dirname + "/../frontend/src/contracts.ts";
    let contractContent = fs.readFileSync(contractsPath, "utf8");

    // Remplacement des adresses via Regex
    contractContent = contractContent.replace(
        /export const TOKEN_ADDRESS = ".*";/,
        `export const TOKEN_ADDRESS = "${tokenAddress}";`
    );
    contractContent = contractContent.replace(
        /export const EXCHANGE_ADDRESS = ".*";/,
        `export const EXCHANGE_ADDRESS = "${exchangeAddress}";`
    );

    fs.writeFileSync(contractsPath, contractContent);
    console.log("✅ Config Frontend mise à jour automatiquement dans src/contracts.ts");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
