#!/bin/bash
echo "Arret des serveurs BlockProperty..."
echo ""
echo "[ATTENTION] Cela va fermer DE FORCE tous les processus Node.js."
echo "Si vous avez d'autres projets Node en cours, fermez-les manuellement."
echo ""
read -p "Etes-vous sur de vouloir tuer TOUS les processus Node.js ? (o/n) : " confirm

if [[ "$confirm" == "o" || "$confirm" == "O" || "$confirm" == "y" || "$confirm" == "Y" ]]; then
    # Kill all node processes
    pkill -f node
    echo ""
    echo "Tous les processus Node ont ete termines."
else
    echo "Operation annulee."
fi
