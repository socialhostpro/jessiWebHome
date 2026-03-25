import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, googleProvider, signInWithPopup } from '@/src/lib/firebase';
import { Button } from '@/src/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';
import { Sparkles, Mail, Lock, ArrowRight, CheckCircle2, ShieldCheck, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { PLANS } from '@/src/types';

export const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const [consentTerms, setConsentTerms] = useState(false);
  const [consentData, setConsentData] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignup = async () => {
    if (!consentTerms || !consentData) {
      toast.error('Please accept the terms and data processing consent.');
      return;
    }
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error('Failed to sign up with Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentTerms || !consentData) {
      toast.error('Please accept the terms and data processing consent.');
      return;
    }
    toast.info('Email signup is not configured. Please use Google signup for this demo.');
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-12">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 max-w-6xl w-full">
        <div className="hidden lg:flex flex-col justify-center gap-8">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <Sparkles className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">Jessica AI</span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900">
            Start your journey with <span className="gradient-text">Jessica AI</span>
          </h1>
          <p className="text-xl text-slate-600">
            Join 5,000+ professionals who are already using Jessica AI to automate their work and amplify their productivity.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-indigo-600 shrink-0" />
              <div>
                <h4 className="font-bold text-slate-900">Agentic AI Assistance</h4>
                <p className="text-sm text-slate-500">Intelligent support that understands your goals.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-6 w-6 text-indigo-600 shrink-0" />
              <div>
                <h4 className="font-bold text-slate-900">Enterprise Security</h4>
                <p className="text-sm text-slate-500">Your data is encrypted and protected at all times.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Eye className="h-6 w-6 text-indigo-600 shrink-0" />
              <div>
                <h4 className="font-bold text-slate-900">Transparent Data Use</h4>
                <p className="text-sm text-slate-500">You control how your information is processed.</p>
              </div>
            </div>
          </div>
        </div>

        <Card className="w-full border-none shadow-2xl premium-shadow">
          <CardHeader className="space-y-1 text-center lg:text-left">
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription>
              Choose your plan and start your Jessica AI subscription
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 gap-4">
              <Button variant="outline" onClick={handleGoogleSignup} disabled={loading} className="gap-2">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-4 w-4" />
                Continue with Google
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500">Or sign up with email</span>
              </div>
            </div>
            <form onSubmit={handleEmailSignup} className="grid gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="fullName">Full Name</label>
                <Input 
                  id="fullName" 
                  placeholder="John Doe" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="email">Email</label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="password">Password</label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-700">Select Plan</label>
                <div className="grid grid-cols-3 gap-2">
                  {PLANS.map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`flex flex-col items-center justify-center rounded-xl border p-3 transition-all ${
                        selectedPlan === plan.id 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-600' 
                          : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xs font-bold uppercase tracking-wider">{plan.name}</span>
                      <span className="text-sm font-bold">${plan.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    id="consentTerms" 
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    checked={consentTerms}
                    onChange={(e) => setConsentTerms(e.target.checked)}
                  />
                  <label htmlFor="consentTerms" className="text-xs text-slate-500 leading-relaxed">
                    I agree to the <Link to="/terms" className="text-indigo-600 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</Link>.
                  </label>
                </div>
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    id="consentData" 
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    checked={consentData}
                    onChange={(e) => setConsentData(e.target.checked)}
                  />
                  <label htmlFor="consentData" className="text-xs text-slate-500 leading-relaxed">
                    I consent to the processing of my personal data to provide personalized AI assistance and improve the agentic experience.
                  </label>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full mt-4">
                {loading ? 'Creating account...' : 'Create Account'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-wrap items-center justify-center gap-1 text-sm text-slate-500">
            Already have an account? 
            <Link to="/login" className="font-medium text-indigo-600 hover:underline">
              Log in
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
