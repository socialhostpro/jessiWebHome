import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/src/contexts/AuthContext';
import { Button } from '@/src/components/ui/Button';
import { Sparkles, LayoutDashboard, LogOut, User, ShieldCheck, Menu, X } from 'lucide-react';
import { auth, signOut } from '@/src/lib/firebase';

export const Navbar: React.FC = () => {
  const { user, profile, isAdmin } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin');

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const navLinks = [
    { name: 'Features', to: '/#features' },
    { name: 'How it Works', to: '/#how-it-works' },
    { name: 'Pricing', to: '/#pricing' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">Jessica AI</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {!isDashboard && navLinks.map((link) => (
            <Link 
              key={link.to} 
              to={link.to} 
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-2 md:gap-4">
              {isAdmin && (
                <Link to="/admin" className="hidden md:block">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    Admin
                  </Button>
                </Link>
              )}
              <Link to="/dashboard">
                <Button variant="outline" size="sm" className="gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Button>
              </Link>
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <img 
                  src={profile?.photoURL || `https://ui-avatars.com/api/?name=${profile?.displayName || user.email}`} 
                  alt="Avatar" 
                  className="h-8 w-8 rounded-full border border-slate-200"
                />
                <Button variant="ghost" size="icon" onClick={handleSignOut} title="Sign Out" className="hidden sm:flex">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button variant="premium" size="sm">Get Started</Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full border-b border-slate-200 bg-white p-6 shadow-xl md:hidden">
          <div className="flex flex-col gap-6">
            {!isDashboard && navLinks.map((link) => (
              <Link 
                key={link.to} 
                to={link.to} 
                className="text-lg font-medium text-slate-600 hover:text-indigo-600"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <div className="flex flex-col gap-4 pt-4 border-t border-slate-100">
                {isAdmin && (
                  <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-slate-600">
                    <ShieldCheck className="h-5 w-5" />
                    Admin Panel
                  </Link>
                )}
                <button 
                  onClick={() => { handleSignOut(); setIsMenuOpen(false); }}
                  className="flex items-center gap-2 text-red-600 font-medium"
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4 pt-4 border-t border-slate-100">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Log in</Button>
                </Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="premium" className="w-full">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
