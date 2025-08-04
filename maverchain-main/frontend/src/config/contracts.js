// Contract addresses and configuration
import MedChainArtifact from '../contracts/MedChain.json';
import IPFSStorageArtifact from '../contracts/IPFSStorage.json';
import DrugVerificationArtifact from '../contracts/DrugVerification.json';

export const CONTRACTS = {
  MedChain: {
    address: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    abi: MedChainArtifact.abi
  },
  IPFSStorage: {
    address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    abi: IPFSStorageArtifact.abi
  },
  DrugVerification: {
    address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    abi: DrugVerificationArtifact.abi
  }
};

export const NETWORK_CONFIG = {
  localhost: {
    chainId: 31337,
    name: "Localhost 8545",
    rpcUrl: "http://127.0.0.1:8545"
  },
  bnbTestnet: {
    chainId: 97,
    name: "BNB Smart Chain Testnet",
    rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
    blockExplorerUrls: ["https://testnet.bscscan.com"],
    nativeCurrency: {
      name: "tBNB",
      symbol: "tBNB",
      decimals: 18
    }
  }
};

export const SAMPLE_ACCOUNTS = {
  manufacturer: {
    address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    name: "MedTech Industries"
  },
  distributor: {
    address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    name: "Global Medical Distributors"
  },
  hospital: {
    address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    name: "City General Hospital"
  },
  patients: [
    {
      address: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
      name: "John Doe",
      id: "P001"
    },
    {
      address: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
      name: "Jane Smith", 
      id: "P002"
    },
    {
      address: "0x976EA74026E726554dB657fA54763abd0C3a0aa9",
      name: "Robert Johnson",
      id: "P003"
    },
    {
      address: "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955",
      name: "Emily Davis",
      id: "P004"
    },
    {
      address: "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f",
      name: "Michael Wilson",
      id: "P005"
    }
  ]
};
