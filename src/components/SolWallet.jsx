import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

export function SolWallet({ mnemonic }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [publicKeys, setPublicKeys] = useState([]);
  const [privateKeys, setPrivateKeys] = useState([]);
  const [visibleKeys, setVisibleKeys] = useState({});

  const handleAddWallet = () => {
    const seed = mnemonicToSeed(mnemonic);
    const path = `m/44'/501'/${currentIndex}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const keypair = Keypair.fromSecretKey(secret);

    setCurrentIndex(currentIndex + 1);
    setPublicKeys([...publicKeys, keypair.publicKey]);
    setPrivateKeys([...privateKeys, Buffer.from(secret).toString('hex')]);
    setVisibleKeys({ ...visibleKeys, [currentIndex]: false });
  };

  const toggleVisibility = (index) => {
    setVisibleKeys({ ...visibleKeys, [index]: !visibleKeys[index] });
  };

  return (
    <div className="mt-8 flex flex-col items-center">
      <button
        onClick={handleAddWallet}
        className="bg-red-500 text-white py-2 px-4 rounded-lg mb-8"
      >
        Add Wallet
      </button>
      <div className="bg-gray-900 text-white p-3 rounded-lg w-2/3 mx-auto mt-8">
        {publicKeys.map((p, index) => (
          <div
            key={index}
            className="bg-gray-800 text-white p-6 rounded-lg shadow-lg mb-6 border-2 border-white"
          >
            <p className="text-lg font-semibold mb-2">Wallet {index + 1}</p>
            <p className="text-sm break-all mb-2">Public Key: {p.toBase58()}</p>
            <div className="flex items-center justify-between">
              <p className="text-sm break-all">
                Private Key: {visibleKeys[index] ? privateKeys[index] : '••••••••••••••••••••••••••••••••••'}
              </p>
              <span
                onClick={() => toggleVisibility(index)}
                className="cursor-pointer"
              >
                {visibleKeys[index] ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
