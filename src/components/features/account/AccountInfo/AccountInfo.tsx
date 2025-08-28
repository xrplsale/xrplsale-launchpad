'use client';

import { useState } from 'react';
import { getAccountInfo, type AccountInfo } from '@/lib/api-simple';

export default function AccountInfoDashboard() {
  const [accountAddress, setAccountAddress] = useState('');
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accountAddress.trim()) {
      setError('Please enter an XRPL address');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await getAccountInfo(accountAddress.trim());
      
      if (data) {
        setAccountInfo(data);
      } else {
        setError('Account not found or invalid address');
      }
    } catch (err) {
      setError('Failed to fetch account information');
    } finally {
      setLoading(false);
    }
  };

  const formatXRP = (drops: string) => {
    return (parseInt(drops) / 1000000).toFixed(6);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-white">XRPL Account Lookup</h2>
        
        <form onSubmit={handleLookup} className="flex gap-4 mb-6">
          <input
            type="text"
            value={accountAddress}
            onChange={(e) => setAccountAddress(e.target.value)}
            placeholder="Enter XRPL address (rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH)"
            className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !accountAddress.trim()}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-600 disabled:to-slate-600 text-white rounded-lg font-semibold transition-all disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Lookup'}
          </button>
        </form>

        {error && (
          <div className="p-3 bg-red-600/20 border border-red-600/50 rounded-lg mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}
      </div>

      {accountInfo && (
        <div className="space-y-6">
          {/* Account Data */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-white">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-700 rounded-lg p-4">
                <h4 className="text-slate-400 text-sm">Account Address</h4>
                <p className="text-white font-mono break-all">{accountInfo.account_data.Account}</p>
              </div>
              <div className="bg-slate-700 rounded-lg p-4">
                <h4 className="text-slate-400 text-sm">XRP Balance</h4>
                <p className="text-xl font-bold text-green-400">{formatXRP(accountInfo.account_data.Balance)} XRP</p>
              </div>
              <div className="bg-slate-700 rounded-lg p-4">
                <h4 className="text-slate-400 text-sm">Sequence Number</h4>
                <p className="text-white">{accountInfo.account_data.Sequence}</p>
              </div>
              <div className="bg-slate-700 rounded-lg p-4">
                <h4 className="text-slate-400 text-sm">Owner Count</h4>
                <p className="text-white">{accountInfo.account_data.OwnerCount}</p>
              </div>
            </div>
          </div>

          {/* Trustlines */}
          {accountInfo.trustlines && accountInfo.trustlines.length > 0 && (
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-white">Trustlines</h3>
              <div className="space-y-3">
                {accountInfo.trustlines.map((trustline, index) => (
                  <div key={index} className="bg-slate-700 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-white">{trustline.currency}</p>
                        <p className="text-slate-400 text-sm font-mono">{trustline.issuer}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white">{parseFloat(trustline.balance).toFixed(6)}</p>
                        <p className="text-slate-400 text-sm">Limit: {parseFloat(trustline.limit).toFixed(0)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Transactions */}
          {accountInfo.recent_transactions && accountInfo.recent_transactions.length > 0 && (
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-white">Recent Transactions</h3>
              <div className="space-y-3">
                {accountInfo.recent_transactions.slice(0, 5).map((tx, index) => (
                  <div key={index} className="bg-slate-700 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-white">{tx.transaction.TransactionType}</p>
                        <p className="text-slate-400 text-sm font-mono">
                          Hash: {tx.transaction.hash?.substring(0, 16)}...
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`px-2 py-1 rounded text-xs ${
                          tx.validated ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'
                        }`}>
                          {tx.validated ? 'Validated' : 'Pending'}
                        </p>
                        {tx.transaction.Fee && (
                          <p className="text-slate-400 text-sm">
                            Fee: {formatXRP(tx.transaction.Fee)} XRP
                          </p>
                        )}
                      </div>
                    </div>
                    {tx.transaction.Amount && (
                      <div className="mt-2">
                        <p className="text-sm text-slate-300">
                          Amount: {typeof tx.transaction.Amount === 'string' ? 
                            formatXRP(tx.transaction.Amount) + ' XRP' : 
                            JSON.stringify(tx.transaction.Amount)
                          }
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}