#!/bin/bash
echo "========================================================="
echo "SCRIPT D'INSTALLATION DES DEPENDANCES"
echo "========================================================="

# 1. Verification de Node.js
echo "1. Verification de Node.js..."
if ! command -v node &> /dev/null; then
    echo "Erreur : Node.js n'est pas installe."
    echo "Veuillez l'installer via votre gestionnaire de paquets ou https://nodejs.org/"
    exit 1
fi
echo "Node.js est present."

echo ""
read -p "Voulez-vous mettre a jour NPM vers la derniere version ? (o/n) : " confirm
if [[ "$confirm" == "o" || "$confirm" == "O" || "$confirm" == "y" || "$confirm" == "Y" ]]; then
    echo "Mise a jour de NPM..."
    npm install -g npm@latest
fi

# 2. Installation des dependances racine
echo "2. Installation des dependances du projet (Racine)..."
npm install
echo "   > Installation specifique de Hardhat (si manquant)..."
npm install --save-dev hardhat

# 3. Installation des dependances frontend
echo "3. Installation des dependances du Frontend..."
cd frontend
npm install
cd ..

echo ""
echo "========================================================="
echo "INSTALLATION TERMINEE"
echo "Vous pouvez maintenant lancer les scripts de demarrage."
echo "========================================================="
