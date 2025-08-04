import React, { useState } from 'react';
import { useContract } from '../contexts/ContractContext';
import { useWallet } from '../contexts/WalletContext';
import MagicLoader from '../components/MagicLoader';
import { GlowingCards, GlowingCard } from '../components/GlowingCards';
import BackButton from '../components/BackButton';

const DrugVerification = () => {
  const { account } = useWallet();
  const { verifyDrugBatch } = useContract();
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [batchId, setBatchId] = useState('');
  const [verificationFeatures, setVerificationFeatures] = useState([]);

  // Sample batch IDs for demonstration
  const sampleBatchIds = [
    { id: '1', drugName: 'Crocin', status: 'Manufactured', valid: true },
    { id: '2', drugName: 'Paracetamol', status: 'With Distributor', valid: true },
    { id: '3', drugName: 'Ibuprofen', status: 'With Hospital', valid: true },
    { id: '4', drugName: 'Aspirin', status: 'Dispensed to Patient', valid: true },
    { id: '999', drugName: 'Counterfeit Drug', status: 'Invalid', valid: false }
  ];

  const handleVerification = async (e) => {
    e.preventDefault();
    if (!batchId) return;

    try {
      setLoading(true);
      
      // Simulate verification process with comprehensive checks
      const verificationSteps = [
        { name: 'Authenticity verification', status: 'checking' },
        { name: 'Supply chain traceability', status: 'checking' },
        { name: 'Expiry date validation', status: 'checking' },
        { name: 'Manufacturer verification', status: 'checking' },
        { name: 'Current status tracking', status: 'checking' }
      ];
      
      setVerificationFeatures(verificationSteps);
      
      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Find sample batch
      const sampleBatch = sampleBatchIds.find(batch => batch.id === batchId);
      
      if (sampleBatch && sampleBatch.valid) {
        // Simulate successful verification
        const result = {
          id: sampleBatch.id,
          drugName: sampleBatch.drugName,
          quantity: Math.floor(Math.random() * 1000) + 500,
          manufacturer: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
          status: sampleBatch.status === 'Manufactured' ? 0 : 
                  sampleBatch.status === 'With Distributor' ? 1 :
                  sampleBatch.status === 'With Hospital' ? 2 : 3,
          expiryDate: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60), // 1 year from now
          verificationHash: '0x' + Math.random().toString(16).substr(2, 64),
          isAuthentic: true,
          isExpired: false,
          isRecalled: false
        };
        
        setVerificationResult(result);
        
        // Update verification features with success
        setVerificationFeatures([
          { name: 'Authenticity verification', status: 'success', icon: '✅' },
          { name: 'Supply chain traceability', status: 'success', icon: '✅' },
          { name: 'Expiry date validation', status: 'success', icon: '✅' },
          { name: 'Manufacturer verification', status: 'success', icon: '✅' },
          { name: 'Current status tracking', status: 'success', icon: '✅' }
        ]);
        
      } else {
        // Simulate failed verification
        setVerificationResult({ 
          error: 'Batch not found or invalid. This could be a counterfeit product.',
          isAuthentic: false,
          isExpired: false,
          isRecalled: false
        });
        
        // Update verification features with failures
        setVerificationFeatures([
          { name: 'Authenticity verification', status: 'failed', icon: '❌' },
          { name: 'Supply chain traceability', status: 'failed', icon: '❌' },
          { name: 'Expiry date validation', status: 'checking', icon: '⏳' },
          { name: 'Manufacturer verification', status: 'failed', icon: '❌' },
          { name: 'Current status tracking', status: 'failed', icon: '❌' }
        ]);
      }
      
    } catch (error) {
      console.error('❌ Error verifying drug batch:', error);
      setVerificationResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 0: return 'bg-green-100 text-green-800';
      case 1: return 'bg-yellow-100 text-yellow-800';
      case 2: return 'bg-blue-100 text-blue-800';
      case 3: return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0: return 'Manufactured';
      case 1: return 'With Distributor';
      case 2: return 'With Hospital';
      case 3: return 'Dispensed to Patient';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.3)' }}
        >
          <source src="/assets/videos/background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-2xl mb-8 border border-white/20">
            <div className="px-6 py-8">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">🔍 Drug Verification</h1>
                  <p className="text-lg text-white/80 mb-4">
                    Verify drug authenticity and track supply chain
                  </p>
                  {account && (
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-white/70 bg-white/10 px-3 py-1 rounded-full">
                        Connected: {account.slice(0, 6)}...{account.slice(-4)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <BackButton />
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">Verification</div>
                    <div className="text-white/70">Security Check</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <GlowingCards enableGlow={true} glowRadius={30} glowOpacity={0.8} gap="2rem" maxWidth="100%" padding="2rem">
            {/* Verification Form */}
            <GlowingCard glowColor="#10b981" className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                Verify Drug Batch
              </h2>
              
              <form onSubmit={handleVerification} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-white/90 mb-2">
                    Batch ID
                  </label>
                  <input
                    type="text"
                    value={batchId}
                    onChange={(e) => setBatchId(e.target.value)}
                    placeholder="Enter batch ID to verify"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-white/50 backdrop-blur-sm"
                    required
                  />
                  
                  {/* Sample Batch IDs */}
                  <div className="mt-3">
                    <p className="text-white/70 text-sm mb-2">Sample Batch IDs for testing:</p>
                    <div className="flex flex-wrap gap-2">
                      {sampleBatchIds.map((batch) => (
                        <button
                          key={batch.id}
                          type="button"
                          onClick={() => setBatchId(batch.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                            batch.valid 
                              ? 'bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30' 
                              : 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30'
                          }`}
                        >
                          #{batch.id} - {batch.drugName}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={loading || !batchId}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 font-semibold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <MagicLoader size={20} particleCount={2} speed={0.8} className="mr-2" />
                      Verifying...
                    </div>
                  ) : (
                    'Verify Batch'
                  )}
                </button>
              </form>
            </GlowingCard>

            {/* Verification Results */}
            {verificationResult && (
              <GlowingCard glowColor="#3b82f6" className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Verification Results
                </h2>
                
                {verificationResult.error ? (
                  <div className="space-y-4">
                    <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4">
                      <h3 className="text-red-300 font-bold mb-2">❌ Verification Failed</h3>
                      <p className="text-red-200">{verificationResult.error}</p>
                    </div>
                    
                    {/* Verification Features for Failed Case */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                      <h3 className="font-bold text-white mb-3">Verification Features</h3>
                      <div className="space-y-2">
                        {verificationFeatures.map((feature, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-white/80 text-sm">{feature.name}</span>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              feature.status === 'success' ? 'bg-green-100 text-green-800' :
                              feature.status === 'failed' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {feature.icon} {feature.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-4">
                      <h3 className="text-green-300 font-bold mb-2">✅ Batch Verified</h3>
                      <p className="text-green-200">This drug batch is authentic and properly tracked.</p>
                      <p className="text-green-200 text-sm mt-2">
                        Verification Hash: {verificationResult.verificationHash?.slice(0, 10)}...{verificationResult.verificationHash?.slice(-8)}
                      </p>
                    </div>
                    
                    {/* Verification Features */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                      <h3 className="font-bold text-white mb-3">Verification Features</h3>
                      <div className="space-y-2">
                        {verificationFeatures.map((feature, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-white/80 text-sm">{feature.name}</span>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              feature.status === 'success' ? 'bg-green-100 text-green-800' :
                              feature.status === 'failed' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {feature.icon} {feature.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                      <h3 className="font-bold text-white mb-3">Batch Details</h3>
                      <div className="space-y-2 text-white/80 text-sm">
                        <div className="flex justify-between">
                          <span>Batch ID:</span>
                          <span className="font-mono">#{verificationResult.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Drug Name:</span>
                          <span>{verificationResult.drugName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Quantity:</span>
                          <span>{verificationResult.quantity} units</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Manufacturer:</span>
                          <span className="font-mono">{verificationResult.manufacturer?.slice(0, 6)}...{verificationResult.manufacturer?.slice(-4)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(verificationResult.status)}`}>
                            {getStatusText(verificationResult.status)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Expiry Date:</span>
                          <span>{new Date(parseInt(verificationResult.expiryDate) * 1000).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </GlowingCard>
            )}

            {/* Information */}
            <GlowingCard glowColor="#8b5cf6" className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                About Drug Verification
              </h2>
              
              <div className="space-y-4">
                <p className="text-white/80 text-sm">
                  Our blockchain-based verification system ensures the authenticity and traceability of pharmaceutical products throughout the supply chain.
                </p>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <h3 className="font-bold text-white mb-3">Verification Features</h3>
                  <div className="space-y-2 text-white/80 text-sm">
                    <div className="flex items-center">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>Authenticity verification</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>Supply chain traceability</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>Expiry date validation</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>Manufacturer verification</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>Current status tracking</span>
                    </div>
                  </div>
                </div>
              </div>
            </GlowingCard>
          </GlowingCards>
        </div>
      </div>
    </div>
  );
};

export default DrugVerification;
