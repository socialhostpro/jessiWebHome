import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Brain, 
  Zap, 
  Shield, 
  Users, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  Plus, 
  Minus,
  Lock,
  Eye,
  CreditCard,
  User,
  LayoutDashboard
} from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/Card';
import { Badge } from '@/src/components/ui/Badge';
import { PLANS } from '@/src/types';

const Hero = () => (
  <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
    <div className="container mx-auto px-4 md:px-6">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-6"
        >
          <Badge variant="secondary" className="w-fit px-4 py-1 text-sm font-medium">
            Next-Generation Agentic AI
          </Badge>
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 md:text-7xl">
            Meet <span className="gradient-text">Jessica AI</span>
          </h1>
          <p className="text-xl text-slate-600 md:text-2xl">
            Your agentic AI partner for work, ideas, automation, and intelligent support. 
            Designed to adapt to you, not the other way around.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link to="/signup">
              <Button size="lg" variant="premium" className="w-full sm:w-auto">
                Start Your Subscription
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/#pricing">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                View Plans
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <img 
                  key={i}
                  src={`https://i.pravatar.cc/150?u=${i}`} 
                  alt="User" 
                  className="h-8 w-8 rounded-full border-2 border-white"
                />
              ))}
            </div>
            <span>Trusted by 5,000+ professionals</span>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="relative z-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl premium-shadow">
            <div className="flex h-10 items-center gap-2 border-b border-slate-100 bg-slate-50 px-4">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-amber-400" />
              <div className="h-3 w-3 rounded-full bg-emerald-400" />
            </div>
            <div className="p-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm text-slate-700 max-w-[80%]">
                    Jessica, can you help me organize my workflow for the new product launch?
                  </div>
                </div>
                <div className="flex items-start gap-3 justify-end">
                  <div className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm text-white max-w-[80%]">
                    Absolutely! I've analyzed your launch goals. I can set up a task board, automate your team updates, and generate a content calendar. Shall we start with the task board?
                  </div>
                  <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                    <Sparkles className="h-4 w-4" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <div className="text-xs font-medium text-slate-500 uppercase">Subscription</div>
                    <div className="text-sm font-bold text-slate-900">Professional Plan</div>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <div className="text-xs font-medium text-slate-500 uppercase">Usage</div>
                    <div className="text-sm font-bold text-slate-900">84% of limit</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 -z-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 -z-10 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />
        </motion.div>
      </div>
    </div>
  </section>
);

const Features = () => {
  const features = [
    {
      icon: <Brain className="h-6 w-6 text-indigo-600" />,
      title: "Agentic AI Assistance",
      description: "Jessica doesn't just chat; she acts. She understands context and takes initiative to support your goals."
    },
    {
      icon: <Zap className="h-6 w-6 text-indigo-600" />,
      title: "Personalized Memory",
      description: "The more you interact, the smarter Jessica gets. She remembers your preferences, projects, and style."
    },
    {
      icon: <Layers className="h-6 w-6 text-indigo-600" />,
      title: "Smart Workflow Support",
      description: "Automate repetitive tasks and streamline your business processes with intelligent workflow triggers."
    },
    {
      icon: <LayoutDashboard className="h-6 w-6 text-indigo-600" />,
      title: "Admin Dashboard Controls",
      description: "Full visibility and control over your AI platform usage, team members, and subscription settings."
    },
    {
      icon: <CreditCard className="h-6 w-6 text-indigo-600" />,
      title: "Subscription Management",
      description: "Easy billing, plan upgrades, and invoice management through our integrated Stripe-powered portal."
    },
    {
      icon: <Shield className="h-6 w-6 text-indigo-600" />,
      title: "Secure User Onboarding",
      description: "Enterprise-grade security from the moment you sign up, ensuring your data remains private and protected."
    },
    {
      icon: <Eye className="h-6 w-6 text-indigo-600" />,
      title: "Data Use Consent",
      description: "Transparent data practices with granular controls over how your information is processed and used."
    },
    {
      icon: <CheckCircle2 className="h-6 w-6 text-indigo-600" />,
      title: "Business-Ready",
      description: "Built for scale. Whether you're a solo creator or a large team, Jessica AI grows with your business."
    },
    {
      icon: <Users className="h-6 w-6 text-indigo-600" />,
      title: "Team Management",
      description: "Collaborate seamlessly. Assign roles, manage permissions, and share AI resources across your organization."
    }
  ];

  return (
    <section id="features" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Everything you need for <span className="gradient-text">Agentic AI</span>
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Jessica AI is packed with features designed to make your work life easier and more productive.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="h-full border-none shadow-sm premium-shadow-hover">
                <CardHeader>
                  <div className="mb-4 h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Choose your plan",
      description: "Select the subscription that best fits your needs, from individual use to enterprise teams."
    },
    {
      number: "02",
      title: "Create your account",
      description: "Quick and secure signup with Google or email. Your journey starts in seconds."
    },
    {
      number: "03",
      title: "Review data settings",
      description: "Transparently review and accept data use settings. You're always in control of your data."
    },
    {
      number: "04",
      title: "Launch Jessica AI",
      description: "Start interacting with your new agentic partner and manage your platform from the dashboard."
    }
  ];

  return (
    <section id="how-it-works" className="py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
            From zero to <span className="gradient-text">Jessica AI</span> in minutes
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={i} className="relative flex flex-col items-center text-center">
              <div className="mb-6 text-6xl font-black text-slate-100">{step.number}</div>
              <h3 className="mb-2 text-xl font-bold text-slate-900">{step.title}</h3>
              <p className="text-slate-600">{step.description}</p>
              {i < steps.length - 1 && (
                <div className="absolute top-12 left-full hidden h-0.5 w-full bg-slate-100 lg:block -z-10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Simple, <span className="gradient-text">Transparent</span> Pricing
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Choose the plan that's right for you. No hidden fees.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {PLANS.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative flex flex-col rounded-3xl border ${plan.isPopular ? 'border-indigo-600 shadow-xl' : 'border-slate-200'} bg-white p-8`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-4 py-1 text-xs font-bold text-white uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold tracking-tight text-slate-900">${plan.price}</span>
                  <span className="ml-1 text-slate-500">/mo</span>
                </div>
                <p className="mt-4 text-sm text-slate-500">{plan.description}</p>
              </div>
              <ul className="mb-8 flex-1 space-y-4">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm text-slate-600">
                    <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="mt-auto">
                <Button 
                  variant={plan.isPopular ? 'premium' : 'outline'} 
                  className="w-full"
                  size="lg"
                >
                  {plan.id === 'enterprise' ? 'Start Enterprise' : plan.isPopular ? 'Upgrade Now' : 'Get Started'}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const faqs = [
    {
      q: "What is Jessica AI?",
      a: "Jessica AI is an advanced agentic AI system designed to act like a smart digital partner. Unlike generic chatbots, Jessica can assist with communication, business support, task organization, and workflow automation."
    },
    {
      q: "How does billing work?",
      a: "We use Stripe for secure billing. You can choose a monthly plan, and your subscription will automatically renew. You can manage your billing, invoices, and plans from your account dashboard."
    },
    {
      q: "Can I change plans later?",
      a: "Yes! You can upgrade or downgrade your plan at any time from your billing dashboard. Changes will be reflected in your next billing cycle."
    },
    {
      q: "Is my data secure?",
      a: "Security is our top priority. We use enterprise-grade encryption and transparent data practices. You have full control over your data use settings during onboarding and in your account settings."
    },
    {
      q: "What is included in each subscription?",
      a: "Each plan offers different levels of access, from basic task support in the Starter plan to full platform-level insights and team management in the Enterprise plan."
    },
    {
      q: "Does Jessica AI support teams and business users?",
      a: "Absolutely. Our Enterprise plan is specifically designed for teams and agencies, offering advanced admin controls, team management, and priority support."
    }
  ];

  return (
    <section id="faq" className="py-24">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <button 
                className="flex w-full items-center justify-between p-6 text-left font-semibold text-slate-900"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                {faq.q}
                {openIndex === i ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              </button>
              {openIndex === i && (
                <div className="px-6 pb-6 text-slate-600">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Trust = () => (
  <section className="py-24 border-t border-slate-100">
    <div className="container mx-auto px-4 md:px-6">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-5xl mb-6">
            Trusted Security, <span className="gradient-text">Transparent</span> Data
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            We believe that AI should be built on trust. That's why we've implemented enterprise-grade security and transparent data practices from day one.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Secure Billing</h4>
                <p className="text-sm text-slate-500">Stripe-powered encrypted payment handling.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Encrypted Data</h4>
                <p className="text-sm text-slate-500">Your account and data are fully encrypted.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Eye className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Data Use Consent</h3>
              <p className="text-slate-400 text-sm">You're always in control.</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="h-5 w-5 rounded border border-white/20 bg-indigo-600 flex items-center justify-center">
                <CheckCircle2 className="h-3 w-3" />
              </div>
              <span className="text-sm">Platform Terms of Service</span>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="h-5 w-5 rounded border border-white/20 bg-indigo-600 flex items-center justify-center">
                <CheckCircle2 className="h-3 w-3" />
              </div>
              <span className="text-sm">Data Processing Agreement</span>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 opacity-50">
              <div className="h-5 w-5 rounded border border-white/20" />
              <span className="text-sm">Marketing Communications</span>
            </div>
          </div>
          <p className="mt-8 text-xs text-slate-400 leading-relaxed">
            By using Jessica AI, you agree to our responsible data use policy. We process your information to provide personalized assistance and improve your agentic experience. We never sell your data.
          </p>
        </div>
      </div>
    </div>
  </section>
);

const FinalCTA = () => (
  <section className="py-24 bg-indigo-600 relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-indigo-600 to-violet-700 -z-10" />
    <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
    
    <div className="container mx-auto px-4 md:px-6 text-center">
      <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl mb-6">
        Ready to start with Jessica AI?
      </h2>
      <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
        Launch your subscription and unlock a more intelligent platform experience today.
      </p>
      <div className="flex flex-col gap-4 sm:flex-row justify-center">
        <Link to="/signup">
          <Button size="lg" variant="secondary" className="w-full sm:w-auto px-12 py-6 text-lg font-bold">
            Start Subscription
          </Button>
        </Link>
        <Link to="/contact">
          <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent text-white border-white hover:bg-white/10 px-12 py-6 text-lg font-bold">
            Contact Sales
          </Button>
        </Link>
      </div>
    </div>
  </section>
);

export const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col">
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <Trust />
      <FAQ />
      <FinalCTA />
    </div>
  );
};
