import React, { useState, useEffect } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import { db, collection, getDocs, query, orderBy, limit, onSnapshot } from '@/src/lib/firebase';
import { type UserProfile, type UsageRecord } from '@/src/types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  AlertCircle, 
  Search, 
  Filter, 
  MoreVertical, 
  ChevronRight,
  ShieldCheck,
  LayoutDashboard,
  MessageSquare,
  Video,
  Settings,
  HelpCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Badge } from '@/src/components/ui/Badge';
import { format } from 'date-fns';

const data = [
  { name: 'Mar 19', users: 400, revenue: 2400 },
  { name: 'Mar 20', users: 300, revenue: 1398 },
  { name: 'Mar 21', users: 200, revenue: 9800 },
  { name: 'Mar 22', users: 278, revenue: 3908 },
  { name: 'Mar 23', users: 189, revenue: 4800 },
  { name: 'Mar 24', users: 239, revenue: 3800 },
  { name: 'Mar 25', users: 349, revenue: 4300 },
];

const pieData = [
  { name: 'Starter', value: 400 },
  { name: 'Professional', value: 300 },
  { name: 'Enterprise', value: 100 },
];

const COLORS = ['#6366F1', '#818CF8', '#4F46E5'];

export const AdminDashboard: React.FC = () => {
  const { user, profile, isAdmin } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'subscriptions' | 'payments' | 'analytics'>('overview');

  useEffect(() => {
    if (!isAdmin) return;

    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map(doc => doc.data() as UserProfile);
      setUsers(usersData);
      setLoading(false);
    });

    return unsubscribe;
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-slate-50">
        <Card className="max-w-md text-center p-8">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <CardTitle className="text-2xl font-bold">Access Denied</CardTitle>
          <CardDescription className="mt-2">
            You do not have permission to access the admin dashboard.
          </CardDescription>
          <Button className="mt-6" onClick={() => window.location.href = '/'}>Return Home</Button>
        </Card>
      </div>
    );
  }

  const Sidebar = () => (
    <div className="flex h-full w-64 flex-col border-r border-slate-200 bg-white">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">Admin Panel</span>
        </div>
        <div className="space-y-1">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${activeTab === 'users' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Users className="h-4 w-4" />
            Users
          </button>
          <button 
            onClick={() => setActiveTab('subscriptions')}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${activeTab === 'subscriptions' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <CreditCard className="h-4 w-4" />
            Subscriptions
          </button>
          <button 
            onClick={() => setActiveTab('payments')}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${activeTab === 'payments' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <TrendingUp className="h-4 w-4" />
            Payments
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${activeTab === 'analytics' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <BarChart className="h-4 w-4" />
            Analytics
          </button>
        </div>
      </div>
      <div className="mt-auto p-6 space-y-1 border-t border-slate-200">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
          <Settings className="h-4 w-4" />
          Settings
        </button>
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
          <HelpCircle className="h-4 w-4" />
          Support
        </button>
      </div>
    </div>
  );

  const OverviewTab = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Platform Overview</h2>
          <p className="text-slate-500">Real-time snapshot of Jessica AI performance.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button className="gap-2">
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-sm premium-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Users</CardTitle>
            <Users className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">5,240</div>
            <p className="text-xs text-emerald-600 mt-1">+12% from last month</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm premium-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Active Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">4,120</div>
            <p className="text-xs text-emerald-600 mt-1">+8% from last month</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm premium-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">$142,400</div>
            <p className="text-xs text-emerald-600 mt-1">+15% from last month</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm premium-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Churn Rate</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">2.4%</div>
            <p className="text-xs text-red-500 mt-1">-0.5% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-none shadow-sm premium-shadow">
          <CardHeader>
            <CardTitle>Revenue Growth</CardTitle>
            <CardDescription>Monthly recurring revenue over the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="revenue" fill="#6366F1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm premium-shadow">
          <CardHeader>
            <CardTitle>Plan Distribution</CardTitle>
            <CardDescription>Breakdown of users by subscription plan.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 ml-4">
              {pieData.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-sm text-slate-600">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm premium-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Signups</CardTitle>
            <CardDescription>New users who joined the platform today.</CardDescription>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input placeholder="Search users..." className="pl-10" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500">
                  <th className="pb-4 font-medium">User</th>
                  <th className="pb-4 font-medium">Plan</th>
                  <th className="pb-4 font-medium">Status</th>
                  <th className="pb-4 font-medium">Joined</th>
                  <th className="pb-4 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u, i) => (
                  <tr key={i} className="group hover:bg-slate-50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={u.photoURL || `https://ui-avatars.com/api/?name=${u.displayName || u.email}`} 
                          alt="Avatar" 
                          className="h-8 w-8 rounded-full border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{u.displayName || 'User'}</p>
                          <p className="text-xs text-slate-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <Badge variant="secondary" className="capitalize">{u.subscriptionPlan || 'Starter'}</Badge>
                    </td>
                    <td className="py-4">
                      <Badge variant={u.subscriptionStatus === 'active' ? 'success' : 'outline'} className="capitalize">
                        {u.subscriptionStatus || 'None'}
                      </Badge>
                    </td>
                    <td className="py-4 text-slate-500">
                      {u.createdAt ? format(u.createdAt.toDate(), 'MMM dd, yyyy') : 'N/A'}
                    </td>
                    <td className="py-4 text-right">
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-slate-50 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab !== 'overview' && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="h-20 w-20 rounded-3xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6">
              <LayoutDashboard className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management</h2>
            <p className="text-slate-500 mt-2">This section is coming soon in the next platform update.</p>
          </div>
        )}
      </main>
    </div>
  );
};
