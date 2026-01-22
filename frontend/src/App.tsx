
import { useState } from 'react';
import { ethers } from 'ethers';
import { PropertyTokenABI, PropertyExchangeABI, TOKEN_ADDRESS, EXCHANGE_ADDRESS } from './contracts';
import './App.css';

declare global {
  interface Window {
    ethereum: any;
  }
}

interface PropertyShares {
  id: number;
  name: string;
  shares: number;
  value: number;
  available: number;
}

function App() {
  const [account, setAccount] = useState<string | null>(null);
  const [properties, setProperties] = useState<PropertyShares[]>([]);
  const [totalShares, setTotalShares] = useState<number>(0);
  const [cooldown, setCooldown] = useState<number>(0);
  const [lockedUntil, setLockedUntil] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Input states
  const [buyAmount, setBuyAmount] = useState<{ [key: number]: string }>({ 0: "", 1: "", 2: "", 3: "", 4: "", 5: "", 6: "" });
  const [transferAmount, setTransferAmount] = useState<string>("");
  const [transferTo, setTransferTo] = useState<string>("");
  const [selectedProperty, setSelectedProperty] = useState<number>(0);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        if (network.chainId !== 31337n) {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x7a69' }],
            });
          } catch (switchError: any) {
            if (switchError.code === 4902) {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: '0x7a69',
                  chainName: 'Hardhat Localhost',
                  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                  rpcUrls: ['http://127.0.0.1:8545'],
                }],
              });
            } else {
              throw switchError;
            }
          }
        }
        const signer = await provider.getSigner();
        setAccount(await signer.getAddress());
        loadUserData(signer);
      } catch (err) {
        console.error(err);
        setError("Erreur de connexion au portefeuille");
      }
    } else {
      setError("Veuillez installer MetaMask");
    }
  };

  const loadUserData = async (signer: ethers.JsonRpcSigner) => {
    try {
      const tokenContract = new ethers.Contract(TOKEN_ADDRESS, PropertyTokenABI, signer);
      const exchangeContract = new ethers.Contract(EXCHANGE_ADDRESS, PropertyExchangeABI, signer);
      const address = await signer.getAddress();

      // Load timing constraints
      const lastTx = await exchangeContract.lastTransactionTime(address);
      const lock = await exchangeContract.lockedUntil(address);
      setCooldown(Number(lastTx));
      setLockedUntil(Number(lock));

      // Load total shares
      const total = await exchangeContract.getTotalShares(address);
      setTotalShares(Number(total));

      // Load each property
      const props: PropertyShares[] = [];
      const names = ["MAISON", "GARE", "HOTEL", "VILLA", "SUPERMARCHE", "USINE", "CHATEAU"];
      for (let i = 0; i <= 6; i++) {
        const shares = await tokenContract.balanceOf(address, i);
        const details = await tokenContract.getPropertyDetails(i);
        const available = await tokenContract.getAvailableSupply(i);
        props.push({
          id: i,
          name: names[i],
          shares: Number(shares),
          value: Number(details.value),
          available: Number(available)
        });
      }
      setProperties(props);
    } catch (err: any) {
      console.error(err);
      setError("Erreur de chargement des données (Contrats non déployés ?)");
    }
  };

  const acquireShares = async (propertyId: number) => {
    if (!account) return;
    const amount = parseInt(buyAmount[propertyId] || "0");
    if (amount <= 0 || amount > 100) {
      setError("Le montant doit être entre 1 et 100");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const exchangeContract = new ethers.Contract(EXCHANGE_ADDRESS, PropertyExchangeABI, signer);

      const tx = await exchangeContract.acquireShares(propertyId, amount);
      await tx.wait();
      alert(`Acquisition réussie de ${amount}% de la propriété !`);
      setBuyAmount({ ...buyAmount, [propertyId]: "" });
      loadUserData(signer);
    } catch (err: any) {
      setError(err.reason || err.message);
    }
    setLoading(false);
  };

  const transferShares = async () => {
    if (!account) return;
    const amount = parseInt(transferAmount || "0");
    if (amount <= 0) {
      setError("Montant invalide");
      return;
    }
    if (!transferTo || !ethers.isAddress(transferTo)) {
      setError("Adresse destinataire invalide");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tokenContract = new ethers.Contract(TOKEN_ADDRESS, PropertyTokenABI, signer);

      const tx = await tokenContract.safeTransferFrom(account, transferTo, selectedProperty, amount, "0x");
      await tx.wait();
      alert(`Transfert de ${amount}% réussi !`);
      setTransferAmount("");
      setTransferTo("");
      loadUserData(signer);
    } catch (err: any) {
      setError(err.reason || err.message);
    }
    setLoading(false);
  };

  const currentTime = Math.floor(Date.now() / 1000);
  const isCooldown = cooldown + 60 > currentTime;
  const isLocked = lockedUntil > currentTime;

  return (
    <div className="App">
      <header>
        <h1>BlockProperty - Immobilier Fractionné</h1>
        {!account ? (
          <button onClick={connectWallet}>Connecter MetaMask</button>
        ) : (
          <div>
            <p>Connecté : {account.substring(0, 6)}...{account.substring(38)}</p>
            <p>Parts Totales : {totalShares}/400 |
              Statut : {isCooldown ? "Cooldown (Attente)" : "Prêt"} | {isLocked ? "Verrouillé" : "Déverrouillé"}
            </p>
          </div>
        )}
      </header>

      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Transaction en cours...</div>}

      <main>
        <section className="market">
          <h2>Marché - Acheter des Parts</h2>
          <div className="card-grid">
            {properties.map(p => (
              <div key={p.id} className="card">
                <h3>{p.name}</h3>
                <p>Prix : {p.value} tokens / 1%</p>
                <p>Disponible : {p.available}%</p>
                <p>Vous possédez : {p.shares}%</p>
                <input
                  type="number"
                  placeholder="% à acheter (1-100)"
                  min="1"
                  max={p.available}
                  value={buyAmount[p.id]}
                  onChange={(e) => setBuyAmount({ ...buyAmount, [p.id]: e.target.value })}
                />
                <button
                  disabled={isCooldown || loading || p.available === 0}
                  onClick={() => acquireShares(p.id)}
                >
                  Acheter {buyAmount[p.id] || 0}%
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="portfolio">
          <h2>Votre Portfolio</h2>
          <div className="card-grid">
            {properties.filter(p => p.shares > 0).map(p => (
              <div key={p.id} className="card property-card">
                <h3>{p.name}</h3>
                <p>Vous possédez : <strong>{p.shares}%</strong></p>
                <p>Valeur : {p.shares * p.value} tokens</p>
              </div>
            ))}
          </div>
          {properties.every(p => p.shares === 0) && <p>Aucune part possédée pour le moment.</p>}
        </section>

        <section className="transfer">
          <h2>Transférer des Parts</h2>
          <div className="card">
            <label>Propriété :</label>
            <select value={selectedProperty} onChange={(e) => setSelectedProperty(Number(e.target.value))}>
              {properties.filter(p => p.shares > 0).map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.shares}% possédés)</option>
              ))}
            </select>
            <label>Montant (%) :</label>
            <input
              type="number"
              placeholder="% à transférer"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
            />
            <label>Adresse Destinataire :</label>
            <input
              type="text"
              placeholder="0x..."
              value={transferTo}
              onChange={(e) => setTransferTo(e.target.value)}
            />
            <button
              disabled={isCooldown || isLocked || loading || properties.every(p => p.shares === 0)}
              onClick={transferShares}
            >
              Transférer
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
