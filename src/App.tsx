import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Home, Wallet, PiggyBank, Receipt, CreditCard, Menu, X, LogOut } from 'lucide-react';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import { supabase } from './lib/supabase';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Despesas from './pages/Despesas';
import Investimentos from './pages/Investimentos';
import Dividas from './pages/Dividas';
import Dashboard from './pages/Dashboard';

const AppContent: React.FC = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { user } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Wallet className="h-6 w-6" />
            <h1 className="text-xl font-bold">FinControl</h1>
          </div>
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-1 hover:text-blue-200 transition-colors">
              <Home size={18} />
              <span>Início</span>
            </Link>
            <Link to="/despesas" className="flex items-center space-x-1 hover:text-blue-200 transition-colors">
              <Receipt size={18} />
              <span>Despesas</span>
            </Link>
            <Link to="/investimentos" className="flex items-center space-x-1 hover:text-blue-200 transition-colors">
              <PiggyBank size={18} />
              <span>Investimentos</span>
            </Link>
            <Link to="/dividas" className="flex items-center space-x-1 hover:text-blue-200 transition-colors">
              <CreditCard size={18} />
              <span>Dívidas</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 hover:text-blue-200 transition-colors"
            >
              <LogOut size={18} />
              <span>Sair</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-500 text-white">
          <div className="container mx-auto px-4 py-2">
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="flex items-center space-x-2 p-2 hover:bg-blue-600 rounded transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                <Home size={18} />
                <span>Início</span>
              </Link>
              <Link 
                to="/despesas" 
                className="flex items-center space-x-2 p-2 hover:bg-blue-600 rounded transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                <Receipt size={18} />
                <span>Despesas</span>
              </Link>
              <Link 
                to="/investimentos" 
                className="flex items-center space-x-2 p-2 hover:bg-blue-600 rounded transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                <PiggyBank size={18} />
                <span>Investimentos</span>
              </Link>
              <Link 
                to="/dividas" 
                className="flex items-center space-x-2 p-2 hover:bg-blue-600 rounded transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                <CreditCard size={18} />
                <span>Dívidas</span>
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="flex items-center space-x-2 p-2 hover:bg-blue-600 rounded transition-colors w-full text-left"
              >
                <LogOut size={18} />
                <span>Sair</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/despesas" element={<Despesas />} />
          <Route path="/investimentos" element={<Investimentos />} />
          <Route path="/dividas" element={<Dividas />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 FinControl - Sistema de Controle Financeiro</p>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <AppContent />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;