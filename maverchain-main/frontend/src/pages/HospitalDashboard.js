import React, { useState, useEffect } from 'react';
import { useContract } from '../contexts/ContractContext';
import { useWallet } from '../contexts/WalletContext';
import MagicLoader from '../components/MagicLoader';
import { SAMPLE_ACCOUNTS } from '../config/contracts';
import { RoleStatus } from '../components/RoleProtection';
import { GlowingCards, GlowingCard } from '../components/GlowingCards';
import BackButton from '../components/BackButton';

const HospitalDashboard = () => {
  const { account } = useWallet();
  const { getHospitalBatches, dispenseToPatient, userRole } = useContract();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dispenseModal, setDispenseModal] = useState({
    isOpen: false,
    batch: null,
    selectedPatient: ''
  });

  useEffect(() => {
    if (account) {
      loadHospitalBatches();
    }
  }, [account]);

  const loadHospitalBatches = async () => {
    if (!account || !account.address) {
      console.warn("Account not available, cannot load hospital batches.");
      return;
    }

    try {
      setLoading(true);
      console.log('🔍 Loading hospital batches for account:', account.address);
      const hospitalBatches = await getHospitalBatches(account.address);
      console.log('✅ Hospital batches loaded:', hospitalBatches);
      setBatches(hospitalBatches);
    } catch (error) {
      console.error('❌ Error loading hospital batches:', error);
    } finally {
      setLoading(false);
    }
  };

  const openDispenseModal = (batch) => {
    setDispenseModal({
      isOpen: true,
      batch: batch,
      selectedPatient: ''
    });
  };

  const closeDispenseModal = () => {
    setDispenseModal({
      isOpen: false,
      batch: null,
      selectedPatient: ''
    });
  };

  const handleDispense = async () => {
    if (!dispenseModal.selectedPatient) {
      alert('Please select a patient');
      return;
    }

    try {
      setLoading(true);
      await dispenseToPatient(dispenseModal.batch.id, dispenseModal.selectedPatient);
      closeDispenseModal();
      await loadHospitalBatches();
      alert('Medication dispensed successfully!');
    } catch (error) {
      console.error('❌ Error dispensing medication:', error);
      alert('Error dispensing medication: ' + error.message);
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
      case 0: return 'Available';
      case 1: return 'In Transit';
      case 2: return 'Received';
      case 3: return 'Dispensed';
      default: return 'Unknown';
    }
  };

  // Check if account is available
  if (!account || !account.address) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <video
          autoPlay
          loop
          muted
          className="absolute inset-0 object-cover w-full h-full z-0 opacity-30"
          src="/assets/videos/background.mp4"
        ></video>
        <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
        <div className="relative z-20 flex flex-col items-center">
          <MagicLoader size={60} particleCount={3} speed={0.8} />
          <p className="mt-4 text-lg font-bold text-white">Please connect your wallet to view the Hospital Dashboard...</p>
        </div>
      </div>
    );
  }

  // Sample patients for dispensing
  const patients = [
    { address: SAMPLE_ACCOUNTS.patient.address, name: 'John Doe' },
    { address: '0x8ba1f109551bD432803012645Hac136c300cc22d', name: 'Jane Smith' },
    { address: '0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec', name: 'Mike Johnson' }
  ];

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
                  <h1 className="text-4xl font-bold text-white mb-2">🏥 Hospital Dashboard</h1>
                  <p className="text-lg text-white/80 mb-4">
                    Dispense drugs, manage patients, track usage
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
                    <div className="text-2xl font-bold text-white">Hospital</div>
                    <div className="text-white/70">Patient Care</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <GlowingCards enableGlow={true} glowRadius={30} glowOpacity={0.8} gap="2rem" maxWidth="100%" padding="2rem">
            {/* Inventory Management */}
            <GlowingCard glowColor="#ef4444" className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                Inventory Management
              </h2>
              
              <div className="space-y-4">
                <button
                  onClick={loadHospitalBatches}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg hover:from-red-700 hover:to-red-800 disabled:opacity-50 font-semibold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <MagicLoader size={20} particleCount={2} speed={0.8} className="mr-2" />
                      Loading...
                    </div>
                  ) : (
                    'Refresh Inventory'
                  )}
                </button>
                
                {loading && batches.length === 0 ? (
                  <div className="text-center py-8">
                    <MagicLoader size={48} particleCount={3} speed={0.8} className="mb-4" />
                    <p className="text-white/60">Loading inventory...</p>
                  </div>
                ) : batches.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {batches.map((batch) => (
                      <div key={batch.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-bold text-white">#{batch.id} - {batch.drugName}</h3>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(batch.status)}`}>
                            {getStatusText(batch.status)}
                          </span>
                        </div>
                        <div className="text-white/80 text-sm mb-3">
                          <p>Quantity: {batch.quantity} units</p>
                          <p>Manufacturer: {batch.manufacturer?.slice(0, 6)}...{batch.manufacturer?.slice(-4)}</p>
                          <p>Expiry: {new Date(parseInt(batch.expiryDate) * 1000).toLocaleDateString()}</p>
                        </div>
                        <div className="flex space-x-2">
                          {(batch.status === 2 || batch.status === '2' || Number(batch.status) === 2) && (
                            <button 
                              onClick={() => openDispenseModal(batch)}
                              className="bg-purple-600 text-white px-3 py-1 rounded text-xs hover:bg-purple-700 transition-colors"
                            >
                              💊 Dispense to Patient
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-white/40 text-6xl mb-4">🏥</div>
                    <h3 className="text-lg font-medium text-white mb-2">No inventory</h3>
                    <p className="text-white/60">No batches have been transferred to this hospital yet.</p>
                  </div>
                )}
              </div>
            </GlowingCard>

            {/* Patient Management */}
            <GlowingCard glowColor="#10b981" className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                Patient Management
              </h2>
              
              <div className="space-y-4">
                <p className="text-white/80 text-sm">
                  Manage patient records and dispense medications.
                </p>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <h3 className="font-bold text-white mb-3">Registered Patients</h3>
                  <div className="space-y-2">
                    {patients.map((patient, index) => (
                      <div key={index} className="flex justify-between items-center text-white/80 text-sm">
                        <span>{patient.name}</span>
                        <span className="font-mono">{patient.address.slice(0, 6)}...{patient.address.slice(-4)}</span>
                      </div>
                    ))}
                  </div>
                </div>
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
                  Access and manage patient health records securely.
                </p>
                
                <button
                  onClick={() => window.location.href = '/health-records'}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 font-semibold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
                >
                  View Health Records
                </button>
              </div>
            </GlowingCard>

            {/* Statistics */}
            <GlowingCard glowColor="#8b5cf6" className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                Statistics
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-center">
                  <div className="text-2xl font-bold text-white">{batches.length}</div>
                  <div className="text-white/60 text-sm">Total Batches</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-center">
                  <div className="text-2xl font-bold text-white">
                    {batches.filter(batch => batch.status === 2).length}
                  </div>
                  <div className="text-white/60 text-sm">Available</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-center">
                  <div className="text-2xl font-bold text-white">
                    {batches.filter(batch => batch.status === 3).length}
                  </div>
                  <div className="text-white/60 text-sm">Dispensed</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-center">
                  <div className="text-2xl font-bold text-white">
                    {batches.reduce((sum, batch) => sum + parseInt(batch.quantity || 0), 0)}
                  </div>
                  <div className="text-white/60 text-sm">Total Units</div>
                </div>
              </div>
            </GlowingCard>
          </GlowingCards>

          {/* Dispense Modal */}
          {dispenseModal.isOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full mx-4 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">Dispense Batch #{dispenseModal.batch?.id}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-white/90 mb-2">
                      Select Patient
                    </label>
                    <select
                      value={dispenseModal.selectedPatient}
                      onChange={(e) => setDispenseModal({...dispenseModal, selectedPatient: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white backdrop-blur-sm"
                    >
                      <option value="">Choose a patient...</option>
                      {patients.map((patient, index) => (
                        <option key={index} value={patient.address}>
                          {patient.name} ({patient.address.slice(0, 6)}...{patient.address.slice(-4)})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleDispense}
                      disabled={loading || !dispenseModal.selectedPatient}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 font-semibold transition-all duration-300"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <MagicLoader size={16} particleCount={2} speed={0.8} className="mr-2" />
                          Dispensing...
                        </div>
                      ) : (
                        'Dispense'
                      )}
                    </button>
                    <button
                      onClick={closeDispenseModal}
                      className="flex-1 bg-white/10 border border-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;
