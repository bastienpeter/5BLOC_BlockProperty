#!/bin/bash
echo "Demarrage de l'environnement BlockProperty..."

# 1. Starting Blockchain Node
echo "1. Demarrage du noeud Blockchain..."
if command -v gnome-terminal &> /dev/null; then
    gnome-terminal --title="BlockProperty: Blockchain" -- bash -c "npx hardhat node; exec bash"
elif command -v xterm &> /dev/null; then
    xterm -T "BlockProperty: Blockchain" -e "npx hardhat node; bash" &
else
    echo "Attention : Aucun emulateur de terminal compatible trouve (gnome-terminal/xterm)."
    echo "Demarrage du noeud Hardhat en arriere-plan (log: blockchain.log)..."
    npx hardhat node > blockchain.log 2>&1 &
fi

echo "Attente de l'initialisation de la blockchain..."
sleep 5

# 2. Deploying Contracts
echo "2. Deploiement des contrats..."
npx hardhat run scripts/deploy.ts --network localhost

# 3. Starting Frontend
echo "3. Demarrage du Frontend..."
cd frontend

if command -v gnome-terminal &> /dev/null; then
    gnome-terminal --title="BlockProperty: DApp" -- bash -c "npm run dev; exec bash"
elif command -v xterm &> /dev/null; then
    xterm -T "BlockProperty: DApp" -e "npm run dev; bash" &
else
    echo "Demarrage du Frontend en arriere-plan (log: frontend.log)..."
    npm run dev > frontend.log 2>&1 &
fi

echo ""
echo "========================================"
echo "  Les serveurs sont en ligne !"
echo "  - Blockchain: Fenetre distincte ou Arriere-plan"
echo "  - Frontend:   Fenetre distincte ou Arriere-plan"
echo "========================================"
echo ""
echo "Utilisez ./stop_servers.sh pour tout fermer."
