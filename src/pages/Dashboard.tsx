import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import { db, collection, addDoc, query, where, orderBy, onSnapshot, Timestamp, doc, updateDoc } from '@/src/lib/firebase';
import { generateJessicaResponse } from '@/src/lib/gemini';
import { generateVeoVideo } from '@/src/lib/veo';
import { type ChatSession, type ChatMessage, PLANS } from '@/src/types';
import { Button } from '@/src/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';
import { Badge } from '@/src/components/ui/Badge';
import { 
  Sparkles, 
  MessageSquare, 
  CreditCard, 
  Settings, 
  LogOut, 
  Send, 
  Plus, 
  User, 
  Bot, 
  Video, 
  Image as ImageIcon,
  Loader2,
  ChevronRight,
  History,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Mail
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export const Dashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'chat' | 'video' | 'billing' | 'settings'>('overview');
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoPrompt, setVideoPrompt] = useState('');
  const [videoLoading, setVideoLoading] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'chat_sessions'),
      where('userId', '==', user.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const sessionsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatSession));
      setSessions(sessionsData);
    });

    return unsubscribe;
  }, [user]);

  useEffect(() => {
    if (!activeSession) {
      setMessages([]);
      return;
    }

    const q = query(
      collection(db, `chat_sessions/${activeSession.id}/messages`),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage));
      setMessages(messagesData);
      scrollToBottom();
    });

    return unsubscribe;
  }, [activeSession]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const createNewSession = async () => {
    if (!user) return;
    try {
      const newSession = {
        userId: user.uid,
        title: 'New Conversation',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      const docRef = await addDoc(collection(db, 'chat_sessions'), newSession);
      setActiveSession({ id: docRef.id, ...newSession });
      setActiveTab('chat');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create new session');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user || !activeSession) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    try {
      // Add user message to Firestore
      await addDoc(collection(db, `chat_sessions/${activeSession.id}/messages`), {
        sessionId: activeSession.id,
        role: 'user',
        content: userMessage,
        createdAt: Timestamp.now(),
      });

      // Update session title if it's the first message
      if (messages.length === 0) {
        await updateDoc(doc(db, 'chat_sessions', activeSession.id), {
          title: userMessage.slice(0, 30) + (userMessage.length > 30 ? '...' : ''),
          updatedAt: Timestamp.now(),
        });
      } else {
        await updateDoc(doc(db, 'chat_sessions', activeSession.id), {
          updatedAt: Timestamp.now(),
        });
      }

      // Generate AI response
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const aiResponse = await generateJessicaResponse(userMessage, history);

      // Add AI message to Firestore
      await addDoc(collection(db, `chat_sessions/${activeSession.id}/messages`), {
        sessionId: activeSession.id,
        role: 'assistant',
        content: aiResponse,
        createdAt: Timestamp.now(),
      });

    } catch (error) {
      console.error(error);
      toast.error('Failed to get response from Jessica AI');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!videoPrompt.trim()) return;
    setVideoLoading(true);
    try {
      const videoUrl = await generateVeoVideo(videoPrompt, selectedImage || undefined);
      setGeneratedVideo(videoUrl);
      toast.success('Video generated successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate video');
    } finally {
      setVideoLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const Sidebar = () => (
    <div className="flex h-full w-64 flex-col border-r border-slate-200 bg-white">
      <div className="p-6">
        <Button onClick={createNewSession} className="w-full gap-2" variant="premium">
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto px-3">
        <div className="space-y-1">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Sparkles className="h-4 w-4" />
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('chat')}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${activeTab === 'chat' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <MessageSquare className="h-4 w-4" />
            Jessica AI
          </button>
          <button 
            onClick={() => setActiveTab('video')}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${activeTab === 'video' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Video className="h-4 w-4" />
            Video Studio
          </button>
          <button 
            onClick={() => setActiveTab('billing')}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${activeTab === 'billing' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <CreditCard className="h-4 w-4" />
            Billing
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>
        </div>

        <div className="mt-8">
          <h4 className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Recent Chats</h4>
          <div className="mt-2 space-y-1">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => {
                  setActiveSession(session);
                  setActiveTab('chat');
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${activeSession?.id === session.id ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <History className="h-4 w-4 shrink-0" />
                <span className="truncate">{session.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
          <img 
            src={profile?.photoURL || `https://ui-avatars.com/api/?name=${profile?.displayName || user?.email}`} 
            alt="Avatar" 
            className="h-8 w-8 rounded-full border border-slate-200"
          />
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-bold text-slate-900">{profile?.displayName || 'User'}</p>
            <p className="truncate text-xs text-slate-500">{profile?.subscriptionPlan || 'Starter'} Plan</p>
          </div>
        </div>
      </div>
    </div>
  );

  const OverviewTab = () => (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back, {profile?.displayName?.split(' ')[0] || 'User'}!</h2>
        <p className="text-slate-500">Here's what's happening with your Jessica AI platform today.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="border-none shadow-sm premium-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Current Plan</CardTitle>
            <Badge variant="success" className="capitalize">{profile?.subscriptionPlan || 'Starter'}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {profile?.subscriptionStatus === 'active' ? 'Active Subscription' : 'No Active Plan'}
            </div>
            <p className="text-xs text-slate-500 mt-1">Next billing: {profile?.currentPeriodEnd ? format(profile.currentPeriodEnd.toDate(), 'MMM dd, yyyy') : 'N/A'}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm premium-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">AI Usage</CardTitle>
            <Sparkles className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">1,240 / 5,000</div>
            <div className="mt-2 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-indigo-600" style={{ width: '24.8%' }} />
            </div>
            <p className="text-xs text-slate-500 mt-2">Tokens resets in 12 days</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm premium-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Video Generations</CardTitle>
            <Video className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">3 / 10</div>
            <div className="mt-2 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-indigo-600" style={{ width: '30%' }} />
            </div>
            <p className="text-xs text-slate-500 mt-2">Generations resets in 12 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-none shadow-sm premium-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Jessica AI Access</CardTitle>
            <CardDescription>Quickly jump back into your conversations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sessions.slice(0, 3).map((session) => (
              <div key={session.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-4 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => { setActiveSession(session); setActiveTab('chat'); }}>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{session.title}</p>
                    <p className="text-xs text-slate-500">Last active: {format(session.updatedAt.toDate(), 'MMM dd, HH:mm')}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-300" />
              </div>
            ))}
            <Button variant="outline" className="w-full" onClick={createNewSession}>
              Start New Conversation
            </Button>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm premium-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Platform Support</CardTitle>
            <CardDescription>Need help with Jessica AI?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl bg-indigo-50 p-4">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                <h4 className="font-bold text-indigo-900">Priority Support</h4>
              </div>
              <p className="text-sm text-indigo-700">As a Professional user, you have access to priority email and chat support.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="gap-2">
                <FileText className="h-4 w-4" />
                Documentation
              </Button>
              <Button variant="outline" className="gap-2">
                <Mail className="h-4 w-4" />
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const ChatTab = () => (
    <div className="flex h-full flex-col">
      {!activeSession ? (
        <div className="flex flex-1 flex-col items-center justify-center p-12 text-center">
          <div className="mb-6 h-20 w-20 rounded-3xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Sparkles className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Ready to chat with Jessica AI?</h2>
          <p className="mt-2 text-slate-500 max-w-md">
            Select a conversation from the sidebar or start a new one to experience agentic AI support.
          </p>
          <Button onClick={createNewSession} className="mt-8 gap-2" size="lg" variant="premium">
            <Plus className="h-5 w-5" />
            Start New Conversation
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{activeSession.title}</h3>
                <p className="text-xs text-slate-500">Jessica AI Professional Agent</p>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
                <Bot className="h-12 w-12 mb-4 text-slate-300" />
                <p className="text-slate-400">Send a message to start the conversation.</p>
              </div>
            )}
            {messages.map((m) => (
              <div key={m.id} className={`flex items-start gap-4 ${m.role === 'assistant' ? '' : 'flex-row-reverse'}`}>
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${m.role === 'assistant' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  {m.role === 'assistant' ? <Sparkles className="h-5 w-5" /> : <User className="h-5 w-5" />}
                </div>
                <div className={`rounded-2xl px-4 py-3 text-sm max-w-[80%] ${m.role === 'assistant' ? 'bg-white border border-slate-100 shadow-sm text-slate-800' : 'bg-indigo-600 text-white shadow-md'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0">
                  <Sparkles className="h-5 w-5 animate-pulse" />
                </div>
                <div className="rounded-2xl px-4 py-3 bg-white border border-slate-100 shadow-sm">
                  <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t border-slate-200 bg-white p-6">
            <form onSubmit={handleSendMessage} className="flex gap-4">
              <Input 
                placeholder="Message Jessica AI..." 
                className="flex-1 h-12 rounded-xl"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
              <Button type="submit" size="icon" className="h-12 w-12 rounded-xl" disabled={loading || !input.trim()}>
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </>
      )}
    </div>
  );

  const VideoTab = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Video Studio</h2>
        <p className="text-slate-500">Generate premium agentic videos using Jessica's Veo engine.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card className="border-none shadow-sm premium-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Generation Settings</CardTitle>
            <CardDescription>Describe the video you want to create.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Prompt</label>
              <textarea 
                className="w-full min-h-[120px] rounded-xl border border-slate-200 p-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="A futuristic city with flying cars and neon lights, cinematic style..."
                value={videoPrompt}
                onChange={(e) => setVideoPrompt(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Reference Image (Optional)</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                  {selectedImage ? (
                    <img src={selectedImage} alt="Reference" className="h-full w-full object-cover rounded-xl" />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon className="w-8 h-8 mb-3 text-slate-400" />
                      <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    </div>
                  )}
                  <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                </label>
              </div>
            </div>

            <Button 
              className="w-full h-12 gap-2" 
              variant="premium" 
              onClick={handleGenerateVideo}
              disabled={videoLoading || !videoPrompt.trim()}
            >
              {videoLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating Video...
                </>
              ) : (
                <>
                  <Video className="h-5 w-5" />
                  Generate Video
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm premium-shadow flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">Result</CardTitle>
            <CardDescription>Your generated video will appear here.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center bg-slate-50 rounded-b-2xl m-6 mt-0 border border-slate-100">
            {generatedVideo ? (
              <video src={generatedVideo} controls className="w-full h-auto rounded-xl shadow-lg" />
            ) : videoLoading ? (
              <div className="flex flex-col items-center gap-4 text-slate-400">
                <Loader2 className="h-12 w-12 animate-spin" />
                <p className="text-sm font-medium">Jessica is crafting your video...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 text-slate-300">
                <Video className="h-16 w-16" />
                <p className="text-sm font-medium">No video generated yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const BillingTab = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Billing & Subscription</h2>
        <p className="text-slate-500">Manage your plan, payment methods, and billing history.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm premium-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Current Subscription</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-6 rounded-2xl bg-indigo-50 border border-indigo-100">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-indigo-900 capitalize">{profile?.subscriptionPlan || 'Starter'} Plan</h4>
                    <p className="text-sm text-indigo-700">Active since {profile?.createdAt ? format(profile.createdAt.toDate(), 'MMM dd, yyyy') : 'N/A'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-indigo-900">${PLANS.find(p => p.id === (profile?.subscriptionPlan || 'starter'))?.price}/mo</p>
                  <Badge variant="success">Active</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-medium text-slate-500 uppercase">Next Billing Date</p>
                  <p className="text-sm font-bold text-slate-900">{profile?.currentPeriodEnd ? format(profile.currentPeriodEnd.toDate(), 'MMM dd, yyyy') : 'N/A'}</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-medium text-slate-500 uppercase">Payment Method</p>
                  <div className="flex items-center gap-2 mt-1">
                    <CreditCard className="h-4 w-4 text-slate-400" />
                    <p className="text-sm font-bold text-slate-900">•••• 4242</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button className="flex-1">Upgrade Plan</Button>
                <Button variant="outline" className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50">Cancel Subscription</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm premium-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Invoice History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Invoice #INV-00{i}</p>
                        <p className="text-xs text-slate-500">Mar {25 - i}, 2026</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-slate-900">$99.00</span>
                      <Button variant="ghost" size="sm">Download</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm premium-shadow bg-slate-900 text-white">
            <CardHeader>
              <CardTitle className="text-lg">Usage Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">AI Tokens</span>
                  <span>1,240 / 5,000</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: '24.8%' }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Video Generations</span>
                  <span>3 / 10</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: '30%' }} />
                </div>
              </div>
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-slate-400">Your usage resets on April 12, 2026.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm premium-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-500">Have questions about your billing or subscription?</p>
              <Button variant="outline" className="w-full">Contact Billing Support</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const SettingsTab = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h2>
        <p className="text-slate-500">Manage your account preferences and data controls.</p>
      </div>

      <div className="space-y-6">
        <Card className="border-none shadow-sm premium-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Profile Information</CardTitle>
            <CardDescription>Update your personal details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Full Name</label>
                <Input defaultValue={profile?.displayName} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email Address</label>
                <Input defaultValue={profile?.email} disabled />
              </div>
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm premium-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Data & Privacy</CardTitle>
            <CardDescription>Control how your data is used by Jessica AI.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900">Personalized Memory</h4>
                <p className="text-sm text-slate-500">Allow Jessica to remember your preferences across sessions.</p>
              </div>
              <div className="h-6 w-11 rounded-full bg-indigo-600 relative cursor-pointer">
                <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white" />
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-6">
              <div>
                <h4 className="font-bold text-slate-900">Training Participation</h4>
                <p className="text-sm text-slate-500">Contribute your anonymized data to improve Jessica's intelligence.</p>
              </div>
              <div className="h-6 w-11 rounded-full bg-slate-200 relative cursor-pointer">
                <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white" />
              </div>
            </div>
            <div className="pt-6 border-t border-slate-100">
              <Button variant="outline" className="text-red-600 border-red-100 hover:bg-red-50">Delete Account & Data</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-slate-50 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'chat' && <ChatTab />}
        {activeTab === 'video' && <VideoTab />}
        {activeTab === 'billing' && <BillingTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </main>
    </div>
  );
};
