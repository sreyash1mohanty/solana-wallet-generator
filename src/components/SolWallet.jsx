import { useState ,useEffect} from "react";
import bs58 from "bs58";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
export function SolWallet({ mnemonic }) {
const [currentIndex, setCurrentIndex] = useState(0);
const [publicKeys, setPublicKeys] = useState([]);
const [privateKeys, setPrivateKeys] = useState([]);
const [visibleKeys, setVisibleKeys] = useState({});
const [copied, setCopied] = useState(false);

const handleCopy = (key) => {
        navigator.clipboard.writeText(key);
        setCopied(true);
        setTimeout(() => setCopied(false), 500);
};

const handleAddWallet = async () => {
        try {
        const seed = await mnemonicToSeed(mnemonic);
        const path = `m/44'/501'/${currentIndex}'/0'`;
        const derivedSeed = derivePath(path, seed.toString("hex")).key;
        const keypair = nacl.sign.keyPair.fromSeed(new Uint8Array(derivedSeed));
        const solanaKeypair = Keypair.fromSecretKey(keypair.secretKey);
        const base58SecretKey = bs58.encode(solanaKeypair.secretKey);
        
        setCurrentIndex(currentIndex + 1);
        setPublicKeys([...publicKeys, solanaKeypair.publicKey.toBase58()]);
        setPrivateKeys([...privateKeys, base58SecretKey]);
        setVisibleKeys({ ...visibleKeys, [currentIndex]: false });
        } catch (error) {
        console.error("Error generating wallet:", error);
        }
};
const toggleVisibility = (index) => {
        setVisibleKeys({ ...visibleKeys, [index]: !visibleKeys[index] });
};
const handleDelete = (index) => {
        setPublicKeys(publicKeys.filter((_, i) => i !== index));
        setPrivateKeys(privateKeys.filter((_, i) => i !== index));
        const newVisibleKeys = { ...visibleKeys };
        delete newVisibleKeys[index];
        setVisibleKeys(newVisibleKeys);
};
const handleAllDelete=()=>{
        setPublicKeys([]);
        setPrivateKeys([]);
        setVisibleKeys({});
};
    return (
        <div className="mt-8 flex flex-col items-center">
        <div className="flex  space-x-4">
            <button
                onClick={handleAddWallet}
                className="bg-white text-black py-2 px-4 rounded-lg mb-8  hover:-translate-y-1"
            >
                Add Wallet
            </button>
            <button
                onClick={handleAllDelete}
                className="bg-red-900 text-white py-2 px-4 rounded-lg mb-8  hover:-translate-y-1"
            >
                Clear Wallets
            </button>
        </div>
        <div className="bg-black text-white p-3 rounded-lg w-2/3 mx-auto mt-8">
            {publicKeys.map((p, index) => (
            <div
                key={index}
                className="bg-black text-white p-6 rounded-lg  mb-6 border-2  h-56 "

            >
                <p className="text-lg font-semibold mt-6 mb-2">Wallet {index + 1}</p>
                <p className="text-sm  text-xl break-all mb-2">Public Key: {p}</p>
                <div className="flex items-center justify-between">
                <p className="text-sm break-all">
                    Private Key: {visibleKeys[index] ? privateKeys[index] : '••••••••••••••••••••••••••••••••••'}
                </p>
                <div className="flex items-center flex-col md:flex-row space-x-3">
                    <span onClick={() => toggleVisibility(index)} className="cursor-pointer">
                    {visibleKeys[index] ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </span>
                    <span onClick={() => handleCopy(visibleKeys[index] ? privateKeys[index] : p)} className="cursor-pointer">
                        <ContentCopyIcon></ContentCopyIcon>
                    </span>
                    <span onClick={() => handleDelete(index)} className="cursor-pointer">
                    <DeleteIcon />
                    </span>
                </div>
                </div>
            </div>
            ))}
        </div>
        </div>
    );
}
