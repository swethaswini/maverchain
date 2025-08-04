import React, { useState, useEffect } from 'react';
import { useContract } from '../contexts/ContractContext';
import { useWallet } from '../contexts/WalletContext';
import MagicLoader from '../components/MagicLoader';
import { GlowingCards, GlowingCard } from '../components/GlowingCards';
import BackButton from '../components/BackButton';

const HealthRecords = () => {
  const { account } = useWallet();
  const { getHealthRecords, addHealthRecord } = useContract();
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newRecord, setNewRecord] = useState({
    patientId: '',
    diagnosis: '',
    prescription: '',
    notes: ''
  });

  useEffect(() => {
    if (account) {
      loadHealthRecords();
    }
  }, [account]);

  const loadHealthRecords = async () => {
    if (!account) return;

    try {
      setLoading(true);
      const records = await getHealthRecords(account);
      setHealthRecords(records);
    } catch (error) {
      console.error('❌ Error loading health records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    if (!newRecord.patientId || !newRecord.diagnosis) return;

    try {
      setLoading(true);
      await addHealthRecord(
        newRecord.patientId,
        newRecord.diagnosis,
        newRecord.prescription,
        newRecord.notes
      );
      setNewRecord({ patientId: '', diagnosis: '', prescription: '', notes: '' });
      await loadHealthRecords();
      alert('Health record added successfully!');
    } catch (error) {
      console.error('❌ Error adding health record:', error);
      alert('Error adding health record: ' + error.message);
    } finally {
      setLoading(false);
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
                  <h1 className="text-4xl font-bold text-white mb-2">📋 Health Records</h1>
                  <p className="text-lg text-white/80 mb-4">
                    Manage patient health records and medical history
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
                    <div className="text-2xl font-bold text-white">Health Records</div>
                    <div className="text-white/70">Patient Care</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <GlowingCards enableGlow={true} glowRadius={30} glowOpacity={0.8} gap="2rem" maxWidth="100%" padding="2rem">
            {/* Add New Record */}
            <GlowingCard glowColor="#10b981" className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                Add Health Record
              </h2>
              
              <form onSubmit={handleAddRecord} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-white/90 mb-2">
                    Patient ID
                  </label>
                  <input
                    type="text"
                    value={newRecord.patientId}
                    onChange={(e) => setNewRecord({...newRecord, patientId: e.target.value})}
                    placeholder="Enter patient ID"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-white/50 backdrop-blur-sm"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-white/90 mb-2">
                    Diagnosis
                  </label>
                  <input
                    type="text"
                    value={newRecord.diagnosis}
                    onChange={(e) => setNewRecord({...newRecord, diagnosis: e.target.value})}
                    placeholder="Enter diagnosis"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-white/50 backdrop-blur-sm"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-white/90 mb-2">
                    Prescription
                  </label>
                  <textarea
                    value={newRecord.prescription}
                    onChange={(e) => setNewRecord({...newRecord, prescription: e.target.value})}
                    placeholder="Enter prescription details"
                    rows="3"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-white/50 backdrop-blur-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-white/90 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={newRecord.notes}
                    onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                    placeholder="Additional notes"
                    rows="2"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-white/50 backdrop-blur-sm"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 font-semibold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <MagicLoader size={20} particleCount={2} speed={0.8} className="mr-2" />
                      Adding...
                    </div>
                  ) : (
                    'Add Record'
                  )}
                </button>
              </form>
            </GlowingCard>

            {/* Health Records List */}
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
                <button
                  onClick={loadHealthRecords}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 font-semibold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <MagicLoader size={20} particleCount={2} speed={0.8} className="mr-2" />
                      Loading...
                    </div>
                  ) : (
                    'Refresh Records'
                  )}
                </button>
                
                {loading && healthRecords.length === 0 ? (
                  <div className="text-center py-8">
                    <MagicLoader size={48} particleCount={3} speed={0.8} className="mb-4" />
                    <p className="text-white/60">Loading health records...</p>
                  </div>
                ) : healthRecords.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {healthRecords.map((record, index) => (
                      <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-bold text-white">Patient #{record.patientId}</h3>
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                            {new Date(record.timestamp * 1000).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-white/80 text-sm space-y-1">
                          <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
                          {record.prescription && <p><strong>Prescription:</strong> {record.prescription}</p>}
                          {record.notes && <p><strong>Notes:</strong> {record.notes}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-white/40 text-6xl mb-4">📋</div>
                    <h3 className="text-lg font-medium text-white mb-2">No health records</h3>
                    <p className="text-white/60">Health records will appear here once added.</p>
                  </div>
                )}
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
                  <div className="text-2xl font-bold text-white">{healthRecords.length}</div>
                  <div className="text-white/60 text-sm">Total Records</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-center">
                  <div className="text-2xl font-bold text-white">
                    {healthRecords.filter(record => record.diagnosis).length}
                  </div>
                  <div className="text-white/60 text-sm">With Diagnosis</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-center">
                  <div className="text-2xl font-bold text-white">
                    {healthRecords.filter(record => record.prescription).length}
                  </div>
                  <div className="text-white/60 text-sm">With Prescription</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-center">
                  <div className="text-2xl font-bold text-white">
                    {new Set(healthRecords.map(record => record.patientId)).size}
                  </div>
                  <div className="text-white/60 text-sm">Unique Patients</div>
                </div>
              </div>
            </GlowingCard>

            {/* Information */}
            <GlowingCard glowColor="#f59e0b" className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                About Health Records
              </h2>
              
              <div className="space-y-4">
                <p className="text-white/80 text-sm">
                  Securely manage and track patient health records on the blockchain for enhanced privacy and accessibility.
                </p>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <h3 className="font-bold text-white mb-3">Security Features</h3>
                  <div className="space-y-2 text-white/80 text-sm">
                    <div className="flex items-center">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>Blockchain encryption</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>Access control</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>Audit trail</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>Data integrity</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>HIPAA compliance</span>
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

export default HealthRecords;
