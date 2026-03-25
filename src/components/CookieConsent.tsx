import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/Button';
import { ShieldCheck, X } from 'lucide-react';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed bottom-6 left-6 right-6 z-[100] md:left-auto md:right-6 md:max-w-md"
        >
          <div className="glass-dark rounded-2xl p-6 shadow-2xl border border-slate-800/50 text-white">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg">Cookie Consent</h3>
                  <button 
                    onClick={() => setIsVisible(false)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  We use cookies to enhance your experience, analyze site traffic, and support our agentic AI features. By clicking "Accept", you agree to our use of cookies.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button 
                    variant="premium" 
                    size="sm" 
                    className="flex-1"
                    onClick={handleAccept}
                  >
                    Accept All
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                    onClick={handleDecline}
                  >
                    Decline
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
