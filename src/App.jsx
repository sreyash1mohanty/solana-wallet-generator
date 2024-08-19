import { useState } from 'react';
import Header from './components/Header.jsx';
import { generateMnemonic } from "bip39";
import SeedBox from './components/SeedBox.jsx';
import { SolWallet } from './components/SolWallet.jsx';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
export default function App() {
  const [mnemonic, setMnemonic] = useState("");
  const [alertvis,setAlertvis]=useState(false);
  const handleGenerateMnemonic = async () => {
    const mn = await generateMnemonic();
    setMnemonic(mn);
  };
  return (
    <div className="root min-h-screen bg-black text-white">
      <Header />
      <Collapse in={alertvis}>
            <Alert 
                sx={{ 
                    ml: 24,
                    mt: 4,
                    mb: 2, 
                    color: '#fcfcfc', 
                    backgroundColor: '#0d0d0e', 
                    width: '80%',
                    textAlign: 'center',
                    transition: 'all 0.1s ease-in-out', 
                }}
            >
                Wallet Created!!!
            </Alert>
        </Collapse>
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
          <SolWallet mnemonic={mnemonic}  setAlertvis={setAlertvis}/>
        </>
      )}
    </div>
  );
}










