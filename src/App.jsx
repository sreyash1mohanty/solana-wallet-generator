import { useState } from 'react';
import Header from './components/Header.jsx';
import { generateMnemonic } from "bip39";
import SeedBox from './components/SeedBox.jsx';
import { SolWallet } from './components/SolWallet.jsx';

export default function App() {
  const [mnemonic, setMnemonic] = useState("");

  const handleGenerateMnemonic = async () => {
    const mn = await generateMnemonic();
    setMnemonic(mn);
  };

  return (
    <div className="root min-h-screen bg-black text-white">
      <Header />
      <div className="flex items justify-center mt-20 space-x-4">
        {!mnemonic && (
          <button
            onClick={handleGenerateMnemonic}
            className="bg-white text-black py-2 px-4 rounded"
          >
            Create Seed Phrase
          </button>
        )}
      </div>
      {mnemonic && (
        <>
          <SeedBox seedPhrase={mnemonic} />
          <SolWallet mnemonic={mnemonic} />
        </>
      )}
    </div>
  );
}










