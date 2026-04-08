'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Lead = {
  id: number;
  company: string;
  role: string;
  source: string;
  url: string;
  notes: string;
  priority: string;
  status: string;
  createdAt: string;
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    company: '',
    role: '',
    source: 'linkedin',
    url: '',
    notes: '',
    priority: 'warm',
  });

  const fetchLeads = async () => {
    const res = await fetch('/api/leads');
    const data = await res.json();
    setLeads(data);
  };

  useEffect(() => {
    fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    if (!form.company || !form.role) {
      alert('Please enter at least company and role');
      return;
    }
    setLoading(true);
    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ company: '', role: '', source: 'linkedin', url: '', notes: '', priority: 'warm' });
    await fetchLeads();
    setLoading(false);
  };

  const priorityColor = (priority: string) => {
    if (priority === 'hot') return 'bg-red-500';
    if (priority === 'warm') return 'bg-yellow-500';
    return 'bg-slate-400';
  };

  const priorityEmoji = (priority: string) => {
    if (priority === 'hot') return '🔥';
    if (priority === 'warm') return '☀️';
    return '❄️';
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 text-white p-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-blue-300 text-sm hover:underline">← Back to Home</Link>
          <h1 className="text-3xl font-bold mt-2">⚡ Quick Capture</h1>
          <p className="text-slate-400 mt-1">Spotted a role? Save it in seconds before it slips away.</p>
        </div>

        {/* Form */}
        <div className="bg-white/10 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-300 mb-1 block">Company *</label>
              <input
                className="w-full bg-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="e.g. Canva"
                value={form.company}
                onChange={e => setForm({ ...form, company: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm text-slate-300 mb-1 block">Role *</label>
              <input
                className="w-full bg-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="e.g. Senior QA Engineer"
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm text-slate-300 mb-1 block">Source</label>
              <select
                className="w-full bg-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.source}
                onChange={e => setForm({ ...form, source: e.target.value })}
              >
                <option value="linkedin">💼 LinkedIn</option>
                <option value="seek">🔍 Seek</option>
                <option value="careers_page">🏢 Company Career Page</option>
                <option value="recruiter_outreach">📩 Recruiter Outreach</option>
                <option value="referral">👤 Referral</option>
                <option value="community">💬 Community / Event</option>
                <option value="other">🌐 Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-300 mb-1 block">Priority</label>
              <select
                className="w-full bg-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.priority}
                onChange={e => setForm({ ...form, priority: e.target.value })}
              >
                <option value="hot">🔥 Hot</option>
                <option value="warm">☀️ Warm</option>
                <option value="maybe">❄️ Maybe</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-slate-300 mb-1 block">
                {form.source === 'referral' && '👤 Referred by'}
                {form.source === 'recruiter_outreach' && '📧 Recruiter email / phone'}
                {form.source === 'community' && '💬 Event or group name'}
                {form.source === 'other' && '🌐 Where from?'}
                {!['referral', 'recruiter_outreach', 'community', 'other'].includes(form.source) && '🔗 URL'}
              </label>
              <input
                className="w-full bg-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder={
                  form.source === 'referral' ? 'e.g. John Smith (ex-Atlassian)' :
                  form.source === 'recruiter_outreach' ? 'e.g. recruiter@canva.com or 0412 345 678' :
                  form.source === 'community' ? 'e.g. Sydney Tech Jobs Slack' :
                  form.source === 'other' ? 'e.g. WhatsApp group, SMS' :
                  'https://...'
                }
                value={form.url}
                onChange={e => setForm({ ...form, url: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-slate-300 mb-1 block">Notes</label>
              <textarea
                className="w-full bg-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Anything you want to remember about this role..."
                rows={3}
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
              />
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-4 w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-800 text-white font-semibold py-3 rounded-xl transition"
          >
            {loading ? 'Saving...' : '⚡ Save Lead'}
          </button>
        </div>

        {/* Leads List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Leads ({leads.length})</h2>
          {leads.length === 0 && (
            <div className="text-center text-slate-400 py-12">
              No leads yet — spot a role and save it above! 👆
            </div>
          )}
          <div className="space-y-4">
            {leads.map(lead => (
              <div key={lead.id} className="bg-white/10 rounded-2xl p-5 hover:bg-white/15 transition">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${priorityColor(lead.priority)}`} />
                      <h3 className="font-semibold text-lg">{lead.company}</h3>
                      <span className="text-slate-400 text-sm">{priorityEmoji(lead.priority)} {lead.priority}</span>
                    </div>
                    <p className="text-blue-200 mt-1">{lead.role}</p>
                    {lead.url && (
                      <a href={lead.url} target="_blank" className="text-sm text-blue-400 hover:underline mt-1 block">
                        🔗 {lead.source} link
                      </a>
                    )}
                    {lead.notes && (
                      <p className="text-slate-400 text-sm mt-2">📝 {lead.notes}</p>
                    )}
                  </div>
                  <span className="text-xs text-slate-500">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}