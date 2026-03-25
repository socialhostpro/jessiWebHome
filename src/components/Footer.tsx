import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Twitter, Github, Linkedin, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">Jessica AI</span>
            </Link>
            <p className="text-sm text-slate-500 max-w-xs">
              The next-generation agentic AI system designed to act like a smart digital partner for professionals and teams.
            </p>
            <div className="flex items-center gap-4 text-slate-400">
              <Twitter className="h-5 w-5 cursor-pointer hover:text-indigo-600" />
              <Github className="h-5 w-5 cursor-pointer hover:text-indigo-600" />
              <Linkedin className="h-5 w-5 cursor-pointer hover:text-indigo-600" />
              <Mail className="h-5 w-5 cursor-pointer hover:text-indigo-600" />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-900">Product</h4>
            <ul className="flex flex-col gap-2 text-sm text-slate-500">
              <li><Link to="/#features" className="hover:text-indigo-600">Features</Link></li>
              <li><Link to="/#how-it-works" className="hover:text-indigo-600">How it Works</Link></li>
              <li><Link to="/#pricing" className="hover:text-indigo-600">Pricing</Link></li>
              <li><Link to="/#faq" className="hover:text-indigo-600">FAQ</Link></li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-900">Company</h4>
            <ul className="flex flex-col gap-2 text-sm text-slate-500">
              <li><Link to="/about" className="hover:text-indigo-600">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-indigo-600">Careers</Link></li>
              <li><Link to="/blog" className="hover:text-indigo-600">Blog</Link></li>
              <li><Link to="/contact" className="hover:text-indigo-600">Contact</Link></li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-900">Legal</h4>
            <ul className="flex flex-col gap-2 text-sm text-slate-500">
              <li><Link to="/privacy" className="hover:text-indigo-600">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-indigo-600">Terms of Service</Link></li>
              <li><Link to="/cookies" className="hover:text-indigo-600">Cookie Policy</Link></li>
              <li><Link to="/security" className="hover:text-indigo-600">Security</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200 pt-8 text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Jessica AI Agentic AI System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
