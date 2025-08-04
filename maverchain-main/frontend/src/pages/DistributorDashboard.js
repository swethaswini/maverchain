import React, { useState, useEffect } from 'react';
import { useContract } from '../contexts/ContractContext';
import { useWallet } from '../contexts/WalletContext';
import { useLanguage } from '../contexts/LanguageContext';
import MagicLoader from '../components/MagicLoader';
import { SAMPLE_ACCOUNTS } from '../config/contracts';
import { RoleStatus } from '../components/RoleProtection';
import { GlowingCards, GlowingCard } from '../components/GlowingCards';
import BackButton from '../components/BackButton';
import QRCodeDisplay from '../components/QRCodeDisplay';
import InventoryManagement from '../components/InventoryManagement';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const DistributorDashboard = () => {
  const { account } = useWallet();
  const { getDistributorBatches, transferToHospital, userRole, createBatch } = useContract();
  const { t } = useLanguage();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [transferModal, setTransferModal] = useState({
    isOpen: false,
    batch: null,
    selectedHospital: ''
  });
  const [dispatchNotifications, setDispatchNotifications] = useState([]);
  
  // New state for enhanced features
  const [qrArrivals, setQrArrivals] = useState([]);
  const [hospitalRequests, setHospitalRequests] = useState([]);
  const [manufacturerRequests, setManufacturerRequests] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const [activeTab, setActiveTab] = useState('inventory');
  const [selectedMedicine, setSelectedMedicine] = useState('All Medicines');
  const [selectedTimeframe, setSelectedTimeframe] = useState('Day');

  // Sample data for enhanced features
  const medicines = ['Paracetamol 500mg', 'Amoxicillin 250mg', 'Insulin Glargine', 'Covishield Vaccine', 'Azithromycin 500mg'];
  
  // Sample QR arrivals from manufacturer
  const sampleQrArrivals = [
    {
      id: 1,
      drugName: 'Paracetamol 500mg',
      quantity: 500,
      manufacturer: 'Aurobindo Pharma',
      qrCode: 'QR_PARA_001_2025_08_04',
      timestamp: Date.now() - 3600000,
      status: 'pending'
    },
    {
      id: 2,
      drugName: 'Insulin Glargine',
      quantity: 300,
      manufacturer: 'Strides Pharma',
      qrCode: 'QR_INSU_002_2025_08_04',
      timestamp: Date.now() - 7200000,
      status: 'pending'
    }
  ];

  // Sample hospital requests with rural/urban logic
  const sampleHospitalRequests = [
    {
      id: 1,
      hospitalName: 'Rural Health Center',
      location: 'Rural Tamil Nadu',
      type: 'rural',
      drugName: 'Paracetamol 500mg',
      quantity: 200,
      urgency: 'high',
      distance: 150,
      timestamp: Date.now() - 1800000
    },
    {
      id: 2,
      hospitalName: 'Apollo Hospitals',
      location: 'Chennai, TN',
      type: 'urban',
      drugName: 'Insulin Glargine',
      quantity: 100,
      urgency: 'medium',
      distance: 50,
      timestamp: Date.now() - 3600000
    },
    {
      id: 3,
      hospitalName: 'Rural Medical Center',
      location: 'Rural Karnataka',
      type: 'rural',
      drugName: 'Amoxicillin 250mg',
      quantity: 150,
      urgency: 'medium',
      distance: 200,
      timestamp: Date.now() - 5400000
    },
    {
      id: 4,
      hospitalName: 'City General Hospital',
      location: 'Bangalore, KA',
      type: 'urban',
      drugName: 'Covishield Vaccine',
      quantity: 300,
      urgency: 'high',
      distance: 75,
      timestamp: Date.now() - 7200000
    }
  ];

  // Sample inventory data for charts
  const sampleInventoryData = [
    { name: 'Paracetamol 500mg', stock: 1500, demand: 1200, status: 'optimal' },
    { name: 'Amoxicillin 250mg', stock: 800, demand: 1000, status: 'low' },
    { name: 'Insulin Glargine', stock: 2000, demand: 1800, status: 'optimal' },
    { name: 'Covishield Vaccine', stock: 500, demand: 800, status: 'critical' },
    { name: 'Azithromycin 500mg', stock: 1200, demand: 1100, status: 'optimal' }
  ];

  useEffect(() => {
    if (account) {
      loadDistributorBatches();
      loadDispatchNotifications();
      loadQrArrivals();
      loadHospitalRequests();
      loadInventoryData();
    }
  }, [account]);

  const loadDispatchNotifications = () => {
    // Load dispatch notifications from localStorage (simulating blockchain events)
    const notifications = JSON.parse(localStorage.getItem('dispatchNotifications') || '[]');
    setDispatchNotifications(notifications);
  };

  const loadQrArrivals = () => {
    setQrArrivals(sampleQrArrivals);
  };

  const loadHospitalRequests = () => {
    // Sort hospital requests based on rural/urban logic (2:1 ratio)
    const sortedRequests = [...sampleHospitalRequests].sort((a, b) => {
      // First, group by urgency
      if (a.urgency !== b.urgency) {
        const urgencyOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
      }
      
      // Within same urgency, prioritize rural (2:1 ratio)
      if (a.type === 'rural' && b.type === 'urban') return -1;
      if (a.type === 'urban' && b.type === 'rural') return 1;
      
      // If both same type, sort by distance (closer first)
      return a.distance - b.distance;
    });
    
    setHospitalRequests(sortedRequests);
  };

  const loadInventoryData = () => {
    setInventoryData(sampleInventoryData);
  };

  const acceptStock = async (qrArrival) => {
    try {
      setLoading(true);
      
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update QR arrival status
      setQrArrivals(prev => prev.map(item => 
        item.id === qrArrival.id 
          ? { ...item, status: 'accepted', acceptedAt: Date.now() }
          : item
      ));

      // Log to admin dashboard
      const adminLog = {
        type: 'stock_accepted',
        distributor: account,
        drugName: qrArrival.drugName,
        quantity: qrArrival.quantity,
        manufacturer: qrArrival.manufacturer,
        timestamp: Date.now(),
        transactionHash: `0x${Math.random().toString(16).substr(2, 40)}`
      };
      
      const existingLogs = JSON.parse(localStorage.getItem('adminActivityLogs') || '[]');
      existingLogs.unshift(adminLog);
      localStorage.setItem('adminActivityLogs', JSON.stringify(existingLogs));

      alert('Stock accepted and logged to blockchain!');
    } catch (error) {
      console.error('Error accepting stock:', error);
      alert('Error accepting stock: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const requestFromManufacturer = async (drugName, quantity) => {
    try {
      setLoading(true);
      
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const request = {
        id: Date.now(),
        drugName,
        quantity,
        distributor: account,
        timestamp: Date.now(),
        status: 'pending',
        transactionHash: `0x${Math.random().toString(16).substr(2, 40)}`
      };
      
      setManufacturerRequests(prev => [request, ...prev]);

      // Log to admin dashboard
      const adminLog = {
        type: 'manufacturer_request',
        distributor: account,
        drugName,
        quantity,
        timestamp: Date.now(),
        transactionHash: request.transactionHash
      };
      
      const existingLogs = JSON.parse(localStorage.getItem('adminActivityLogs') || '[]');
      existingLogs.unshift(adminLog);
      localStorage.setItem('adminActivityLogs', JSON.stringify(existingLogs));

      alert('Request sent to manufacturer!');
    } catch (error) {
      console.error('Error requesting from manufacturer:', error);
      alert('Error requesting from manufacturer: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fulfillHospitalRequest = async (request) => {
    try {
      setLoading(true);
      
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Remove fulfilled request
      setHospitalRequests(prev => prev.filter(r => r.id !== request.id));

      // Log to admin dashboard
      const adminLog = {
        type: 'hospital_request_fulfilled',
        distributor: account,
        hospital: request.hospitalName,
        drugName: request.drugName,
        quantity: request.quantity,
        timestamp: Date.now(),
        transactionHash: `0x${Math.random().toString(16).substr(2, 40)}`
      };
      
      const existingLogs = JSON.parse(localStorage.getItem('adminActivityLogs') || '[]');
      existingLogs.unshift(adminLog);
      localStorage.setItem('adminActivityLogs', JSON.stringify(existingLogs));

      alert('Hospital request fulfilled!');
    } catch (error) {
      console.error('Error fulfilling hospital request:', error);
      alert('Error fulfilling hospital request: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'optimal': return 'bg-green-100 text-green-800';
      case 'low': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const loadDistributorBatches = async () => {
    if (!account) return;

    try {
      setLoading(true);
      console.log('🔍 Loading distributor batches for account:', account);
      const distributorBatches = await getDistributorBatches(account);
      console.log('✅ Distributor batches loaded:', distributorBatches);
      setBatches(distributorBatches);
    } catch (error) {
      console.error('❌ Error loading distributor batches:', error);
    } finally {
      setLoading(false);
    }
  };

  const openTransferModal = (batch) => {
    setTransferModal({
      isOpen: true,
      batch: batch,
      selectedHospital: ''
    });
  };

  const closeTransferModal = () => {
    setTransferModal({
      isOpen: false,
      batch: null,
      selectedHospital: ''
    });
  };

  const handleTransfer = async () => {
    if (!transferModal.selectedHospital) {
      alert('Please select a hospital');
      return;
    }

    try {
      setLoading(true);
      await transferToHospital(transferModal.batch.id, transferModal.selectedHospital);
      closeTransferModal();
      await loadDistributorBatches();
      alert('Batch transferred successfully!');
    } catch (error) {
      console.error('❌ Error transferring batch:', error);
      alert('Error transferring batch: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getBatchStatusColor = (status) => {
    switch (status) {
      case 0: return 'bg-green-100 text-green-800';
      case 1: return 'bg-yellow-100 text-yellow-800';
      case 2: return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0: return 'Available';
      case 1: return 'In Transit';
      case 2: return 'Delivered';
      default: return 'Unknown';
    }
  };

  // Sample hospitals for transfer
  const hospitals = [
    { address: SAMPLE_ACCOUNTS.hospital.address, name: 'Central Hospital' },
    { address: '0x8ba1f109551bD432803012645Hac136c300cc22d', name: 'Regional Medical Center' },
    { address: '0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec', name: 'City General Hospital' }
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
                  <h1 className="text-4xl font-bold text-white mb-2">🚚 {t.distributor.title}</h1>
                  <p className="text-lg text-white/80 mb-4">
                    {t.distributor.description}
                  </p>
                  {account && (
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-white/70 bg-white/10 px-3 py-1 rounded-full">
                        {t.common.connected}: {account.slice(0, 6)}...{account.slice(-4)}
                      </span>
                      <RoleStatus />
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <BackButton />
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{t.distributor.role}</div>
                    <div className="text-white/70">{t.distributor.roleDescription}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 mb-6">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'inventory' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              📦 {t.distributor.inventory}
            </button>
            <button
              onClick={() => setActiveTab('qr-arrivals')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'qr-arrivals' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              📱 {t.distributor.qrArrivals}
            </button>
            <button
              onClick={() => setActiveTab('hospital-requests')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'hospital-requests' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              🏥 {t.distributor.hospitalRequests}
            </button>
            <button
              onClick={() => setActiveTab('manufacturer-requests')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'manufacturer-requests' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              🏭 {t.distributor.manufacturerRequests}
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'analytics' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              📊 {t.distributor.analytics}
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'inventory' && (
            <InventoryManagement />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsDashboard />
          )}

        {/* Hospital Requests Tab */}
        {activeTab === 'hospital-requests' && (
          <div className="space-y-6">
            <GlowingCard glowColor="#ef4444" className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                {t.distributor.hospitalRequests}
              </h2>
              
              <div className="mb-4 p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
                <h3 className="text-white font-semibold mb-2">🏥 Priority Logic (2:1 Rural:Urban)</h3>
                <p className="text-white/80 text-sm">
                  Requests are prioritized by urgency first, then by rural/urban ratio (2 rural for every 1 urban), 
                  then by distance (closer hospitals first).
                </p>
              </div>
              
              <div className="space-y-4">
                {hospitalRequests.length > 0 ? (
                  hospitalRequests.map((request, index) => (
                    <div key={request.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-bold text-white text-lg">{request.hospitalName}</h4>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              request.type === 'rural' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {request.type === 'rural' ? '🏘️ Rural' : '🏙️ Urban'}
                            </span>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getUrgencyColor(request.urgency)}`}>
                              {request.urgency.toUpperCase()} {request.urgency === 'high' ? '🔥' : request.urgency === 'medium' ? '⚡' : '📋'}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mb-2">
                            <div>
                              <p className="text-white/70 text-sm font-semibold">{t.distributor.hospital}</p>
                              <p className="text-white">{request.hospitalName}</p>
                            </div>
                            <div>
                              <p className="text-white/70 text-sm font-semibold">{t.distributor.quantity}</p>
                              <p className="text-white font-bold">{request.quantity} units</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mb-2">
                            <div>
                              <p className="text-white/70 text-sm font-semibold">Drug</p>
                              <p className="text-white">{request.drugName}</p>
                            </div>
                            <div>
                              <p className="text-white/70 text-sm font-semibold">{t.distributor.distance}</p>
                              <p className="text-white">{request.distance} km</p>
                            </div>
                          </div>
                          <p className="text-white/50 text-xs">
                            {t.distributor.timestamp}: {new Date(request.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span className="text-white/60 text-sm">Priority #{index + 1}</span>
                          <button
                            onClick={() => fulfillHospitalRequest(request)}
                            disabled={loading}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                          >
                            {loading ? (
                              <div className="flex items-center">
                                <MagicLoader size={16} particleCount={2} speed={0.8} className="mr-2" />
                                Fulfilling...
                              </div>
                            ) : (
                              `✅ ${t.distributor.fulfillRequest}`
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-white/40 text-4xl mb-4">🏥</div>
                    <p className="text-white/60">{t.distributor.noHospitalRequests}</p>
                    <p className="text-white/40 text-sm mt-2">{t.distributor.noHospitalRequestsDescription}</p>
                  </div>
                )}
              </div>
            </GlowingCard>
          </div>
        )}

        {/* Manufacturer Requests Tab */}
        {activeTab === 'manufacturer-requests' && (
          <div className="space-y-6">
            <GlowingCard glowColor="#f59e0b" className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                {t.distributor.manufacturerRequests}
              </h2>
              
              {/* Request Form */}
              <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
                <h3 className="text-white font-semibold mb-4">🏭 Request Stock from Manufacturer</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-white/90 mb-2">
                      {t.distributor.drugName}
                    </label>
                    <select
                      value={selectedMedicine}
                      onChange={(e) => setSelectedMedicine(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white backdrop-blur-sm"
                    >
                      <option value="All Medicines">Select Medicine</option>
                      {medicines.map((medicine, index) => (
                        <option key={index} value={medicine}>{medicine}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white/90 mb-2">
                      {t.distributor.quantity}
                    </label>
                    <input
                      type="number"
                      placeholder="Enter quantity"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white backdrop-blur-sm"
                      id="requestQuantity"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        const quantity = document.getElementById('requestQuantity').value;
                        if (selectedMedicine !== 'All Medicines' && quantity) {
                          requestFromManufacturer(selectedMedicine, parseInt(quantity));
                          document.getElementById('requestQuantity').value = '';
                        } else {
                          alert('Please select a medicine and enter quantity');
                        }
                      }}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 text-white px-6 py-3 rounded-lg hover:from-yellow-700 hover:to-yellow-800 disabled:opacity-50 font-semibold transition-all duration-300"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <MagicLoader size={16} particleCount={2} speed={0.8} className="mr-2" />
                          Sending Request...
                        </div>
                      ) : (
                        ` ${t.distributor.requestStock}`
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Request History */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold mb-4"> Request History</h3>
                {manufacturerRequests.length > 0 ? (
                  manufacturerRequests.map((request) => (
                    <div key={request.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-bold text-white text-lg mb-2">{request.drugName}</h4>
                          <div className="grid grid-cols-2 gap-4 mb-2">
                            <div>
                              <p className="text-white/70 text-sm font-semibold">{t.distributor.quantity}</p>
                              <p className="text-white font-bold">{request.quantity} units</p>
                            </div>
                            <div>
                              <p className="text-white/70 text-sm font-semibold">{t.distributor.status}</p>
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {request.status === 'pending' ? '⏳ Pending' : '✅ Approved'}
                              </span>
                            </div>
                          </div>
                          <p className="text-white/50 text-xs">
                            {t.distributor.timestamp}: {new Date(request.timestamp).toLocaleString()}
                          </p>
                          {request.transactionHash && (
                            <p className="text-white/50 text-xs font-mono mt-1">
                              TX: {request.transactionHash.slice(0, 10)}...{request.transactionHash.slice(-8)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-white/40 text-4xl mb-4">🏭</div>
                    <p className="text-white/60">{t.distributor.noManufacturerRequests}</p>
                    <p className="text-white/40 text-sm mt-2">{t.distributor.noManufacturerRequestsDescription}</p>
                  </div>
                )}
              </div>
            </GlowingCard>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Inventory Status Overview */}
            <GlowingCard glowColor="#8b5cf6" className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                Inventory Status - Last 90 Days
              </h2>
              
              <div className="space-y-6">
                {/* Filters */}
                <div className="flex space-x-4">
                  <select
                    value={selectedMedicine}
                    onChange={(e) => setSelectedMedicine(e.target.value)}
                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white backdrop-blur-sm"
                  >
                    <option value="All Medicines">All Medicines</option>
                    {medicines.map((medicine, index) => (
                      <option key={index} value={medicine}>{medicine}</option>
                    ))}
                  </select>
                  <select
                    value={selectedTimeframe}
                    onChange={(e) => setSelectedTimeframe(e.target.value)}
                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white backdrop-blur-sm"
                  >
                    <option value="Day">Day</option>
                    <option value="Week">Week</option>
                    <option value="Month">Month</option>
                  </select>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                     Download PDF Report
                  </button>
                </div>

                {/* Inventory Status Bars */}
                <div className="space-y-4">
                  {inventoryData.map((item, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-white font-semibold">{item.name}</h3>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                          {item.status.toUpperCase()}
                        </span>
                      </div>
                      
                      {/* Stock Level Visualization */}
                      <div className="relative h-8 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${
                            item.status === 'optimal' ? 'bg-green-500' : 
                            item.status === 'low' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${(item.stock / Math.max(item.stock, item.demand)) * 100}%` }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {item.stock} / {Math.max(item.stock, item.demand)} units
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                        <div>
                          <span className="text-white/70">Stock:</span>
                          <span className="text-white ml-2">{item.stock} units</span>
                        </div>
                        <div>
                          <span className="text-white/70">Demand:</span>
                          <span className="text-white ml-2">{item.demand} units</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GlowingCard>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cold Chain */}
              <GlowingCard glowColor="#06b6d4" className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center mr-2">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                   Cold Chain
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Temperature:</span>
                    <span className="text-green-400">2-8°C ✓</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Humidity:</span>
                    <span className="text-green-400">45% ✓</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Status:</span>
                    <span className="text-green-400">Optimal</span>
                  </div>
                </div>
              </GlowingCard>

              {/* Compliance */}
              <GlowingCard glowColor="#10b981" className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-2">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  ✔ Compliance
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Regulatory:</span>
                    <span className="text-green-400">Compliant ✓</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Audit Score:</span>
                    <span className="text-green-400">98%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Last Check:</span>
                    <span className="text-white">2 days ago</span>
                  </div>
                </div>
              </GlowingCard>

              {/* Delivery Network */}
              <GlowingCard glowColor="#f59e0b" className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mr-2">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                   Delivery Network
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Active Routes:</span>
                    <span className="text-white">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">On-Time Rate:</span>
                    <span className="text-green-400">94%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Avg Delivery:</span>
                    <span className="text-white">2.3 days</span>
                  </div>
                </div>
              </GlowingCard>
            </div>

            {/* Live Blockchain Feed */}
            <GlowingCard glowColor="#6366f1" className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                Live Blockchain Feed
              </h2>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {[
                  { action: "Paracetamol 500mg delivery confirmed", time: "Just now", icon: "📦" },
                  { action: "Insulin Glargine stock level updated", time: "Just now", icon: "📊" },
                  { action: "Amoxicillin 250mg quality verification completed", time: "2m ago", icon: "✅" },
                  { action: "Covishield Vaccine supply request submitted", time: "5m ago", icon: "🔄" },
                  { action: "Azithromycin 500mg inventory count verified", time: "15m ago", icon: "📋" }
                ].map((feed, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-lg">{feed.icon}</span>
                    <div className="flex-1">
                      <p className="text-white text-sm">{feed.action}</p>
                    </div>
                    <span className="text-white/50 text-xs">{feed.time}</span>
                  </div>
                ))}
              </div>
            </GlowingCard>
          </div>
        )}

        {/* QR Arrivals Tab */}
        {activeTab === 'qr-arrivals' && (
          <div className="space-y-6">
            <GlowingCard glowColor="#10b981" className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1zm12 0h2a1 1 0 001-1V6a1 1 0 00-1-1h-2a1 1 0 00-1 1v1a1 1 0 001 1zM5 20h2a1 1 0 001-1v-1a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1z" />
                  </svg>
                </div>
                {t.distributor.qrArrivals}
              </h2>
              
              <div className="space-y-4">
                {qrArrivals.length > 0 ? (
                  qrArrivals.map((arrival) => (
                    <div key={arrival.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h4 className="font-bold text-white text-lg mb-2">{arrival.drugName}</h4>
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                              <p className="text-white/70 text-sm font-semibold">{t.distributor.quantity}</p>
                              <p className="text-white text-lg font-bold">{arrival.quantity} units</p>
                            </div>
                            <div>
                              <p className="text-white/70 text-sm font-semibold">{t.distributor.manufacturer}</p>
                              <p className="text-white">{arrival.manufacturer}</p>
                            </div>
                          </div>
                          <p className="text-white/50 text-xs">
                            {t.distributor.timestamp}: {new Date(arrival.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`px-3 py-2 text-sm font-semibold rounded-full ${
                            arrival.status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {arrival.status === 'accepted' ? '✅ Accepted' : '⏳ Pending'}
                          </span>
                          {arrival.status === 'pending' && (
                            <button
                              onClick={() => acceptStock(arrival)}
                              disabled={loading}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                            >
                              {loading ? (
                                <div className="flex items-center">
                                  <MagicLoader size={16} particleCount={2} speed={0.8} className="mr-2" />
                                  Accepting...
                                </div>
                              ) : (
                                `✅ ${t.distributor.acceptStock}`
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {/* QR Code Display */}
                      <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                        <h5 className="text-white font-semibold mb-2">QR Code</h5>
                        <div className="flex justify-center">
                          <QRCodeDisplay value={arrival.qrCode} size={120} />
                        </div>
                        <p className="text-white/60 text-xs text-center mt-2 font-mono">
                          {arrival.qrCode}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-white/40 text-4xl mb-4">📱</div>
                    <p className="text-white/60">{t.distributor.noQrArrivals}</p>
                    <p className="text-white/40 text-sm mt-2">{t.distributor.noQrArrivalsDescription}</p>
                  </div>
                )}
              </div>
            </GlowingCard>
          </div>
        )}



          {/* Transfer Modal */}
          {transferModal.isOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full mx-4 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">Transfer Batch #{transferModal.batch?.id}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-white/90 mb-2">
                      Select Hospital
                    </label>
                    <select
                      value={transferModal.selectedHospital}
                      onChange={(e) => setTransferModal({...transferModal, selectedHospital: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-white backdrop-blur-sm"
                    >
                      <option value="">Choose a hospital...</option>
                      {hospitals.map((hospital, index) => (
                        <option key={index} value={hospital.address}>
                          {hospital.name} ({hospital.address.slice(0, 6)}...{hospital.address.slice(-4)})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleTransfer}
                      disabled={loading || !transferModal.selectedHospital}
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 font-semibold transition-all duration-300"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <MagicLoader size={16} particleCount={2} speed={0.8} className="mr-2" />
                          Transferring...
                        </div>
                      ) : (
                        'Transfer'
                      )}
                    </button>
                    <button
                      onClick={closeTransferModal}
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

export default DistributorDashboard;
