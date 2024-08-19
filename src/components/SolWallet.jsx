import { useState, useEffect } from "react";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import bs58 from "bs58";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import WalletIcon from '@mui/icons-material/Wallet';
export function SolWallet({ mnemonic,setAlertvis}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [publicKeys, setPublicKeys] = useState([]);
    const [privateKeys, setPrivateKeys] = useState([]);
    const [visibleKeys, setVisibleKeys] = useState({});
    const [copied, setCopied] = useState(false);
    const [open, setOpen] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(null);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
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
            setAlertvis(true);
            setTimeout(()=>setAlertvis(false),2000);
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

    const handleDeleteConfirmation = (index) => {
        setDeleteIndex(index);
        setOpen(true);
    };

    const handleDelete = () => {
        setPublicKeys(publicKeys.filter((_, i) => i !== deleteIndex));
        setPrivateKeys(privateKeys.filter((_, i) => i !== deleteIndex));
        const newVisibleKeys = { ...visibleKeys };
        delete newVisibleKeys[deleteIndex];
        setVisibleKeys(newVisibleKeys);
        setOpen(false);
    };

    const handleAllDelete = () => {
        setPublicKeys([]);
        setPrivateKeys([]);
        setVisibleKeys({});
        setDeleteIndex(null);
        setOpen(false);
        
    };
    const handleDeleteAllConfirmation = () => {
        setOpen(true);
    };

    return (
        
        <div className="mt-8 flex flex-col items-center">
            <div className="flex space-x-4">
                <button
                    onClick={handleAddWallet}
                    className="bg-white text-black py-2 px-4 rounded-lg mb-8 hover:-translate-y-1"
                >
                    Add Wallet
                </button>
                <button
                    onClick={handleDeleteAllConfirmation}
                    className="bg-red-900 text-white py-2 px-4 rounded-lg mb-8 hover:-translate-y-1"
                >
                    Clear Wallets
                </button>
            </div>
            <div className="bg-black text-white p-3 rounded-lg w-2/3 mx-auto mt-8">
                {publicKeys.map((p, index) => (
                    <div
                        key={index}
                        className="bg-black text-white p-6 rounded-lg mb-6 border-2 h-56"
                    >
                        <p className="text-lg font-mono mt-6 mb-2"> <WalletIcon className="mb-1 mr-1"></WalletIcon>Solana Wallet {index + 1}</p>
                        <p className="text-sm text-xl break-all mb-2">Public Key: {p}</p>
                        <div className="flex items-center justify-between">
                            <p className="text-sm break-all">
                                Private Key: {visibleKeys[index] ? privateKeys[index] : '••••••••••••••••••••••••••••••••••'}
                            </p>
                            <div className="flex items-center flex-col md:flex-row space-x-3">
                                <span onClick={() => toggleVisibility(index)} className="cursor-pointer">
                                    {visibleKeys[index] ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </span>
                                <span onClick={()=>handleCopy(visibleKeys[index] ? privateKeys[index] : p)} className="cursor-pointer">
                                    <ContentCopyIcon />
                                </span>
                                <span onClick={() => handleDeleteConfirmation(index)} className="cursor-pointer">
                                    <DeleteIcon />
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

                    <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="responsive-dialog-title"
                PaperProps={{
                    sx: {
                        backgroundColor: 'black',
                        color: 'white',
                    },
                }}
            >
                <DialogTitle id="responsive-dialog-title" sx={{ color: 'white' }}>
                    {"Confirm Deletion"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: 'white' }}>
                        Are you sure you want to delete this wallet?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} sx={{ color: 'white' }}>
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} sx={{ color: 'red' }} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
        </Dialog>
        <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="responsive-dialog-title"
                PaperProps={{
                    sx: {
                        backgroundColor: 'black',
                        color: 'white',
                    },
                }}
            >
                <DialogTitle id="responsive-dialog-title" sx={{ color: 'white' }}>
                    {"Confirm Deletion"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: 'white' }}>
                        Are you sure you want to delete all wallets?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} sx={{ color: 'white' }}>
                        Cancel
                    </Button>
                    <Button onClick={handleAllDelete} sx={{ color: 'red' }} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
        </Dialog>

        </div>
    );
}
