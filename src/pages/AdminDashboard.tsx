import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Shield, Mail, Phone, Loader2, RefreshCw, Users, Calendar, ArrowLeft, AlertTriangle } from 'lucide-react';

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  stage: string;
  message: string;
  createdAt: string;
}

const ADMIN_KEY = 'prospero2026';
const API_URL = '/api/leads';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [key, setKey] = useState(ADMIN_KEY);

  useEffect(() => {
    if (authenticated) fetchLeads();
  }, [authenticated, key]);

  const fetchLeads = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}?key=${encodeURIComponent(key)}`, {
        headers: { 'x-admin-key': key },
      });
      const data = await res.json();
      if (res.ok) {
        setLeads(data.leads || []);
        setTotal(data.total || 0);
      } else {
        setError(data.error || 'Failed to fetch leads');
      }
    } catch {
      setError('Network error. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_KEY) {
      setAuthenticated(true);
      setKey(password);
    } else {
      setError('Invalid password');
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center px-6">
        <div className="max-w-sm w-full">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-text-muted hover:text-accent-gold transition-colors text-sm mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Back to site
          </button>
          <div className="text-center mb-8">
            <Shield className="w-12 h-12 text-accent-gold mx-auto mb-4" />
            <h1 className="font-display text-2xl text-text-primary mb-2">Admin Dashboard</h1>
            <p className="text-text-muted text-sm">Enter your admin key to view leads</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Admin key"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              className="w-full bg-bg-secondary border border-[rgba(200,150,62,0.15)] rounded-card px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-gold transition-colors"
              autoFocus
            />
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button type="submit" className="btn-primary w-full">Access Dashboard</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <div className="bg-bg-secondary border-b border-[rgba(200,150,62,0.15)]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-accent-gold" />
            <div>
              <h1 className="font-display text-lg text-text-primary">Prospero Leads</h1>
              <p className="text-text-muted text-xs">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchLeads}
              className="p-2 rounded-lg bg-bg-elevated text-text-muted hover:text-accent-gold transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/')}
              className="text-sm text-text-muted hover:text-accent-gold transition-colors"
            >
              Back to site
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-bg-secondary rounded-card p-4 border border-[rgba(200,150,62,0.15)]">
            <Users className="w-5 h-5 text-accent-gold mb-2" />
            <p className="text-2xl font-display font-medium text-text-primary">{total}</p>
            <p className="text-text-muted text-xs">Total Leads</p>
          </div>
          <div className="bg-bg-secondary rounded-card p-4 border border-[rgba(200,150,62,0.15)]">
            <Calendar className="w-5 h-5 text-accent-gold mb-2" />
            <p className="text-2xl font-display font-medium text-text-primary">
              {leads.filter((l) => {
                const d = new Date(l.createdAt);
                const now = new Date();
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
              }).length}
            </p>
            <p className="text-text-muted text-xs">This Month</p>
          </div>
          <div className="bg-bg-secondary rounded-card p-4 border border-[rgba(200,150,62,0.15)]">
            <Mail className="w-5 h-5 text-accent-gold mb-2" />
            <p className="text-2xl font-display font-medium text-text-primary">
              {new Set(leads.map((l) => l.email)).size}
            </p>
            <p className="text-text-muted text-xs">Unique Emails</p>
          </div>
          <div className="bg-bg-secondary rounded-card p-4 border border-[rgba(200,150,62,0.15)]">
            <Phone className="w-5 h-5 text-accent-gold mb-2" />
            <p className="text-2xl font-display font-medium text-text-primary">
              {leads.filter((l) => l.phone).length}
            </p>
            <p className="text-text-muted text-xs">With Phone</p>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-accent-gold animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-bg-secondary rounded-card p-8 text-center border border-red-500/20">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <p className="text-red-400 text-sm">{error}</p>
            <p className="text-text-muted text-xs mt-2">
              Make sure your MongoDB URI is configured in Vercel environment variables.
            </p>
          </div>
        ) : leads.length === 0 ? (
          <div className="bg-bg-secondary rounded-card p-8 text-center border border-[rgba(200,150,62,0.15)]">
            <p className="text-text-muted">No leads yet. Leads will appear here when people submit the contact form.</p>
          </div>
        ) : (
          <div className="bg-bg-secondary rounded-card border border-[rgba(200,150,62,0.15)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[rgba(200,150,62,0.15)]">
                    <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">Name</th>
                    <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">Email</th>
                    <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3 hidden md:table-cell">Phone</th>
                    <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Stage</th>
                    <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3 hidden xl:table-cell">Message</th>
                    <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead._id} className="border-b border-[rgba(200,150,62,0.08)] hover:bg-bg-elevated/30 transition-colors">
                      <td className="px-4 py-3 text-sm text-text-primary font-medium">{lead.name || '-'}</td>
                      <td className="px-4 py-3 text-sm">
                        <a href={`mailto:${lead.email}`} className="text-accent-gold hover:text-accent-amber transition-colors">
                          {lead.email}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-sm text-text-secondary hidden md:table-cell">{lead.phone || '-'}</td>
                      <td className="px-4 py-3 text-sm text-text-secondary hidden lg:table-cell">{lead.stage || '-'}</td>
                      <td className="px-4 py-3 text-sm text-text-muted hidden xl:table-cell max-w-xs truncate">{lead.message || '-'}</td>
                      <td className="px-4 py-3 text-xs text-text-muted whitespace-nowrap">{formatDate(lead.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
