
const fs = require('fs');
const path = require('path');

// Properties list
const properties = [
    { id: 0, name: "MAISON", value: 10, description: "Un appartement confortable en centre-ville." },
    { id: 1, name: "GARE", value: 15, description: "Une gare ferroviaire avec fort trafic." },
    { id: 2, name: "HOTEL", value: 25, description: "Hôtel de luxe avec vue sur la mer." },
    { id: 3, name: "VILLA", value: 20, description: "Villa avec piscine et grand jardin." },
    { id: 4, name: "SUPERMARCHE", value: 30, description: "Supermarché d'une grande chaîne nationale." },
    { id: 5, name: "USINE", value: 40, description: "Usine de production industrielle." },
    { id: 6, name: "CHATEAU", value: 50, description: "Monument historique classé." }
];

// Ensure metadata directory exists
const outDir = path.join(__dirname, '../metadata');
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
}

// Generate JSON files
properties.forEach(p => {
    const data = {
        name: p.name,
        type: p.name, // Project Requirement
        description: p.description,
        value: p.value, // Project Requirement
        image: "ipfs://QmPlaceholderImage", // Placeholder for image
        hash: `ipfs://QmDoc${p.name}`, // Placeholder for associated document (Propriété Document)
        attributes: [
            { trait_type: "Category", value: p.name },
            { trait_type: "Initial Price", value: p.value }
        ]
    };

    const filePath = path.join(outDir, `${p.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Generated: ${filePath}`);
});

console.log("\n==================================================");
console.log("METADATA GENERATED SUCCESSFULLY!");
console.log("==================================================");
console.log("Next Steps:");
console.log("1. Go to https://app.pinata.cloud/");
console.log("2. Click 'Add Files' -> 'Folder'");
console.log(`3. Select the folder: ${outDir}`);
console.log("4. Copy the CID given by Pinata (e.g., QmXyZ...)");
console.log("5. We will update the Smart Contract with this CID.");
