'use client';

import { useState } from 'react';
import { authenticateWallet, type AuthResponse, type User } from '@/lib/api-simple';

interface WalletAuthProps {
  onAuthSuccess?: (user: User, sessionToken: string) => void;
  onAuthError?: (error: string) => void;
}

export default function WalletAuth({ onAuthSuccess, onAuthError }: WalletAuthProps) {
  const [walletAddress, setWalletAddress] = useState('');
  const [signature, setSignature] = useState('');
  const [message, setMessage] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!walletAddress || !signature || !message) {
      setError('Wallet address, signature, and message are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await authenticateWallet(walletAddress, signature, message, publicKey || undefined);
      
      if (response?.success && response.user && response.session_token) {
        setSuccess(true);
        onAuthSuccess?.(response.user, response.session_token);
      } else {
        const errorMsg = response?.message || 'Authentication failed';
        setError(errorMsg);
        onAuthError?.(errorMsg);
      }
    } catch (err) {
      const errorMsg = 'Authentication request failed';
      setError(errorMsg);
      onAuthError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const generateMessage = () => {
    const timestamp = new Date().toISOString();
    const msg = `Sign this message to authenticate with XRPL.Sale at ${timestamp}`;
    setMessage(msg);
  };

  if (success) {
    return (
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-green-600 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Authentication Successful!</h3>
          <p className="text-slate-300">Your wallet has been authenticated successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-6">Wallet Authentication</h2>
      
      <form onSubmit={handleAuth} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Wallet Address *
          </label>
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH"
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Message *
            <button
              type="button"
              onClick={generateMessage}
              className="ml-2 px-2 py-1 text-xs bg-purple-600 hover:bg-purple-700 rounded transition-colors"
              disabled={loading}
            >
              Generate
            </button>
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message to sign..."
            rows={3}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Signature *
          </label>
          <textarea
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            placeholder="Signature from your wallet..."
            rows={3}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Public Key (Optional)
          </label>
          <input
            type="text"
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
            placeholder="Public key from your wallet (optional)"
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={loading}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-600/20 border border-red-600/50 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !walletAddress || !signature || !message}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-600 disabled:to-slate-600 text-white py-3 px-6 rounded-lg font-semibold transition-all disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Authenticating...
            </div>
          ) : (
            'Authenticate Wallet'
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-slate-700 rounded-lg">
        <h3 className="text-sm font-semibold text-slate-300 mb-2">How to authenticate:</h3>
        <ol className="text-xs text-slate-400 space-y-1 list-decimal list-inside">
          <li>Click "Generate" to create a message</li>
          <li>Sign the message with your XRPL wallet</li>
          <li>Paste the signature above</li>
          <li>Click "Authenticate Wallet"</li>
        </ol>
      </div>
    </div>
  );
}