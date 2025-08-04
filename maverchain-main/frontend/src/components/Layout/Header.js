import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSwitcher from '../LanguageSwitcher';

export function Header() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 bg-transparent backdrop-blur-lg border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <div className="flex items-center space-x-2">
                <img
                  src="/assets/images/medchain-logo.png"
                  alt="MaverChain Logo"
                  className="h-8 w-8 rounded-full object-cover"
                />
                <span className="text-xl font-bold text-white">MaverChain</span>
              </div>
            </Link>
            <nav className="hidden md:ml-10 md:flex space-x-8">
              <Link 
                to="/verify" 
                className="text-white hover:text-blue-300 transition-all duration-300 hover:drop-shadow-[0_0_10px_rgba(59,130,246,0.8)] font-medium"
              >
                {t.nav.verifyDrugs}
              </Link>
              <Link 
                to="/forecasting" 
                className="text-white hover:text-blue-300 transition-all duration-300 hover:drop-shadow-[0_0_10px_rgba(59,130,246,0.8)] font-medium"
              >
                {t.nav.forecasting}
              </Link>
              <Link 
                to="/health-records" 
                className="text-white hover:text-blue-300 transition-all duration-300 hover:drop-shadow-[0_0_10px_rgba(59,130,246,0.8)] font-medium"
              >
                {t.nav.healthRecords}
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            {user ? (
              <>
                <span className="text-sm text-white/80">
                  {user.role}
                </span>
                <button 
                  onClick={logout}
                  className="px-4 py-2 border border-white/30 rounded-lg text-white hover:bg-white/20 transition-all duration-300 hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                >
                  {t.nav.signOut}
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 border border-white/30 rounded-lg text-white hover:bg-white/20 transition-all duration-300 hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
