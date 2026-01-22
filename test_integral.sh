#!/bin/bash
echo "========================================================="
echo "SCRIPT DE TEST INTEGRAL - BLOCKPROPERTY"
echo "========================================================="

# 1. Nettoyage et Compilation
npx hardhat clean
npx hardhat compile

# 2. Execution des tests avec Gas Reporting
# L'export permet de définir la variable d'environnement pour ce shell
export REPORT_GAS=true
npx hardhat test

echo "========================================================="
echo "TEST TERMINE - VERIFIEZ LES LOGS CI-DESSUS"
echo "========================================================="
