import React, { useState, useEffect } from 'react';
import { useContract } from '../contexts/ContractContext';
import { useWallet } from '../contexts/WalletContext';
import MagicLoader from '../components/MagicLoader';
import { SAMPLE_ACCOUNTS } from '../config/contracts';
import { RoleStatus } from '../components/RoleProtection';
import { GlowingCards, GlowingCard } from '../components/GlowingCards';
import BackButton from '../components/BackButton';

const PatientDashboard = () => {
  const { account } = useWallet();
  const { setupPatientRole, getPatientMedicationHistory, userRole } = useContract();
  const [medicationHistory, setMedicationHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [patientAddress, setPatientAddress] = useState('');

  useEffect(() => {
    if (account) {
      setPatientAddress(account);
      loadPatientData(account);
    }
  }, [account]);

  const loadPatientData = async (patientAddress) => {
    if (!patientAddress) return;

    try {
      setLoading(true);
      console.log('🔍 Loading patient data for:', patientAddress);
      const history = await getPatientMedicationHistory(patientAddress);
      console.log('✅ Patient medication history loaded:', history);
      setMedicationHistory(history);
    } catch (error) {
      console.error('❌ Error loading patient data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetupPatientRole = async () => {
    if (!account) return;

    try {
      setLoading(true);
      await setupPatientRole(account);
      alert('Patient role setup completed successfully!');
    } catch (error) {
      console.error('❌ Error setting up patient role:', error);
      alert('Error setting up patient role: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (patientAddress) {
      await loadPatientData(patientAddress);
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
                  <h1 className="text-4xl font-bold text-white mb-2">👤 Patient Dashboard</h1>
                  <p className="text-lg text-white/80 mb-4">
                    View medication history and manage health records
                  </p>
                  {account && (
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-white/70 bg-white/10 px-3 py-1 rounded-full">
                        Connected: {account.slice(0, 6)}...{account.slice(-4)}
                      </span>
                      <RoleStatus />
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <BackButton />
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">Patient</div>
                    <div className="text-white/70">Health Management</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <GlowingCards enableGlow={true} glowRadius={30} glowOpacity={0.8} gap="2rem" maxWidth="100%" padding="2rem">
            {/* Patient Setup */}
            <GlowingCard glowColor="#10b981" className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                Patient Setup
              </h2>
              
              <div className="space-y-4">
                <p className="text-white/80 text-sm">
                  Set up your patient role to access medication history and health records.
                </p>
                
                <button
                  onClick={handleSetupPatientRole}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 font-semibold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <MagicLoader size={20} particleCount={2} speed={0.8} className="mr-2" />
                      Setting up...
                    </div>
                  ) : (
                    'Setup Patient Role'
                  )}
                </button>
              </div>
            </GlowingCard>

            {/* Medication History */}
            <GlowingCard glowColor="#8b5cf6" className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                Medication History
              </h2>
              
              <div className="space-y-4">
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 font-semibold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <MagicLoader size={20} particleCount={2} speed={0.8} className="mr-2" />
                      Loading...
                    </div>
                  ) : (
                    'Refresh'
                  )}
                </button>
                
                {loading ? (
                  <div className="text-center py-8">
                    <MagicLoader size={48} particleCount={3} speed={0.8} />
                    <p className="mt-2 text-white/60">Loading medication history...</p>
                  </div>
                ) : medicationHistory.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {medicationHistory.map((medication, index) => (
                      <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-bold text-white">{medication.drugName}</h3>
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-300 border border-green-400/30">
                            Dispensed
                          </span>
                        </div>
                        <div className="text-white/80 text-sm">
                          <p>Quantity: {medication.quantity} units</p>
                          <p>Date: {new Date(medication.timestamp * 1000).toLocaleDateString()}</p>
                          <p>Hospital: {medication.hospital?.slice(0, 6)}...{medication.hospital?.slice(-4)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-white/40 text-6xl mb-4">💊</div>
                    <h3 className="text-lg font-medium text-white mb-2">No medication history</h3>
                    <p className="text-white/60">Your medication history will appear here once you receive prescriptions.</p>
                  </div>
                )}
              </div>
            </GlowingCard>

            {/* Health Records */}
            <GlowingCard glowColor="#3b82f6" className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                Health Records
              </h2>
              
              <div className="space-y-4">
                <p className="text-white/80 text-sm">
                  Access your complete health records and medical history.
                </p>
                
                <button
                  onClick={() => window.location.href = '/health-records'}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 font-semibold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
                >
                  View Health Records
                </button>
              </div>
            </GlowingCard>

            {/* Patient Info */}
            <GlowingCard glowColor="#f59e0b" className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                Patient Information
              </h2>
              
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/80">Patient ID:</span>
                      <span className="text-white font-mono">{account?.slice(0, 6)}...{account?.slice(-4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/80">Role:</span>
                      <span className="text-white capitalize">{userRole || 'Patient'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/80">Status:</span>
                      <span className="text-green-400">Active</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-white/60 text-xs">
                  Your health data is securely stored on the blockchain and can only be accessed by authorized healthcare providers.
                </p>
              </div>
            </GlowingCard>
          </GlowingCards>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
