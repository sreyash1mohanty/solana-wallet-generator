import { useState } from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
export default function SeedBox({ seedPhrase }) {
    const [copied, setCopied] = useState(false);

    // Split the seed phrase into individual words
    const words = seedPhrase.split(' ');

    const handleCopy = () => {
        setCopied(true);
        navigator.clipboard.writeText(seedPhrase);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-black text-white p-3 rounded-lg w-2/3 mx-auto mt-8">
            <p className="text-lg ml-3 font-semibold mb-2">
                <strong>Seed Phrase:</strong>
            </p>
            <div className="grid grid-cols-4 gap-2 bg-gray-900 text-white p-4 rounded mb-4">
                {words.map((word, index) => (
                    <div
                        key={index}
                        className="bg-gray-800 text-white p-2 rounded text-center"
                    >
                        {word}
                    </div>
                ))}
            </div>
            <div className="flex items-center justify-center mt-4">
                <span
                    className="text-white rounded cursor-pointer flex items-center"
                    onClick={handleCopy}
                >
                    {copied ? 'Copied' : 'Copy'}
                    <ContentCopyIcon className='ml-2' />
                </span>
            </div>
        </div>
    );
}


    
