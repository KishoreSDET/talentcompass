'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { rateLabel, ratePlaceholder, priorityColor, priorityEmoji, empTypeLabel } from '@/lib/utils';

type Lead = {
  id: number;
  type: string;
  company: string;
  role: string;
  priority: string;
  notes: string;
  source: string;
  url: string;
  applyBefore: string;
  employmentType: string;
  rateAmount: string;
  contractDuration: string;
  workArrangement: string;
  location: string;
  contactName: string;
  contactVia: string;
  contactDetail: string;
  theyAskedFor: string;
  respondBy: string;
  currentRoleType: string;
  currentRate: string;
  expectedRate: string;
  availability: string;
  noticePeriod: string;
  workRights: string;
  vevoCopy: string;
  resumeSent: string;
  responseNotes: string;
  status: string;
  createdAt: string;
};

const emptyForm = {
  type: 'outbound',
  company: '',
  role: '',
  priority: 'warm',
  notes: '',
  source: 'linkedin',
  url: '',
  applyBefore: '',
  employmentType: 'permanent',
  rateAmount: '',
  contractDuration: '',
  workArrangement: 'hybrid',
  location: '',
  contactName: '',
  contactVia: 'email',
  contactDetail: '',
  theyAskedFor: [] as string[],
  respondBy: '',
  currentRoleType: 'permanent',
  currentRate: '',
  expectedRate: '',
  availability: '',
  noticePeriod: '',
  workRights: '',
  vevoCopy: 'not_yet',
  resumeSent: 'not_yet',
  responseNotes: '',
};

const today = new Date().toISOString().split('T')[0];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [mounted, setMounted] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const fetchLeads = async () => {
    const res = await fetch('/api/leads');
    const data = await res.json();
    setLeads(data);
  };

  useEffect(() => {
    const initialize = async () => {
      setMounted(true);
      const res = await fetch('/api/leads');
      const data = await res.json();
      setLeads(data);
    };
    initialize();
  }, []);

  const toggleAskedFor = (item: string) => {
    setForm(prev => ({
      ...prev,
      theyAskedFor: prev.theyAskedFor.includes(item)
        ? prev.theyAskedFor.filter(i => i !== item)
        : [...prev.theyAskedFor, item],
    }));
  };

  const handleEdit = (lead: Lead) => {
    setEditingId(lead.id);
    setForm({
      ...emptyForm,
      ...lead,
      theyAskedFor: lead.theyAskedFor
        ? lead.theyAskedFor.split(',')
        : [],
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async () => {
    if (!form.company || !form.role) {
      alert('Please enter at least company and role');
      return;
    }
    setLoading(true);

    if (editingId) {
      await fetch('/api/leads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId, ...form }),
      });
      setEditingId(null);
    } else {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }

    setForm(emptyForm);
    await fetchLeads();
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/leads?id=${id}`, { method: 'DELETE' });
    setDeleteConfirmId(null);
    await fetchLeads();
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 text-white p-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-blue-300 text-sm hover:underline">← Back to Home</Link>
          <h1 className="text-3xl font-bold mt-2">⚡ Quick Capture</h1>
          <p className="text-slate-400 mt-1">Spotted a role? Save it in seconds before it slips away.</p>
        </div>

        {/* Type Toggle */}
        <div className="flex gap-3 mb-6">
          <button
            type="button"
            onClick={() => setForm(prev => ({ ...prev, type: 'outbound' }))}
            className={`flex-1 py-3 rounded-xl font-semibold transition ${form.type === 'outbound' ? 'bg-blue-500' : 'bg-white/10 hover:bg-white/20'}`}
          >
            🔍 I Found a Role
          </button>
          <button
            type="button"
            onClick={() => setForm(prev => ({ ...prev, type: 'inbound' }))}
            className={`flex-1 py-3 rounded-xl font-semibold transition ${form.type === 'inbound' ? 'bg-blue-500' : 'bg-white/10 hover:bg-white/20'}`}
          >
            📩 Someone Reached Out
          </button>
        </div>

        {/* Form */}
        <div className="bg-white/10 rounded-2xl p-6 mb-8 space-y-4">

          {/* Edit mode banner */}
          {editingId && (
            <div className="bg-yellow-500/20 border border-yellow-500/40 rounded-xl px-4 py-3 flex items-center justify-between">
              <span className="text-yellow-300 text-sm font-semibold">✏️ Editing lead — make your changes and save</span>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-yellow-300 hover:text-white text-sm underline"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Common Fields */}
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
            <div>
              <label className="text-sm text-slate-300 mb-1 block">Employment Type</label>
              <select
                className="w-full bg-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.employmentType}
                onChange={e => setForm({ ...form, employmentType: e.target.value })}
              >
                <option value="permanent">💼 Permanent</option>
                <option value="contract_daily">📋 Contract - Daily Rate</option>
                <option value="contract_hourly">📋 Contract - Hourly Rate</option>
                <option value="contract_annual">📋 Contract - Annual CTC</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-300 mb-1 block">{rateLabel(form.employmentType)}</label>
              <input
                className="w-full bg-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder={ratePlaceholder(form.employmentType)}
                value={form.rateAmount}
                onChange={e => setForm({ ...form, rateAmount: e.target.value })}
              />
            </div>
            {form.employmentType !== 'permanent' && (
              <div>
                <label className="text-sm text-slate-300 mb-1 block">Contract Duration</label>
                <input
                  className="w-full bg-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="e.g. 6 months, 12 months"
                  value={form.contractDuration}
                  onChange={e => setForm({ ...form, contractDuration: e.target.value })}
                />
              </div>
            )}
            <div>
              <label className="text-sm text-slate-300 mb-1 block">Work Arrangement</label>
              <select
                className="w-full bg-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.workArrangement}
                onChange={e => setForm({ ...form, workArrangement: e.target.value })}
              >
                <option value="hybrid">🔄 Hybrid</option>
                <option value="remote">🏠 Remote</option>
                <option value="onsite">🏢 Onsite</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-300 mb-1 block">
                {form.workArrangement === 'remote' ? '🌏 Remote - Country Restriction' : '📍 Location'}
              </label>
              <input
                className="w-full bg-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder={form.workArrangement === 'remote' ? 'e.g. Australia only / Worldwide' : 'e.g. CBD, Pyrmont, Surry Hills'}
                value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
              />
            </div>
          </div>

          {/* Outbound specific */}
          {form.type === 'outbound' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div>
                <label className="text-sm text-slate-300 mb-1 block">Source</label>
                <select
                  className="w-full bg-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={form.source}
                  onChange={e => setForm({ ...form, source: e.target.value })}
                >
                  <option value="linkedin">💼 LinkedIn</option>
                  <option value="seek">🔍 Seek</option>
                  <option value="career_page">🏢 Company Career Page</option>
                  <option value="referral">👤 Referral</option>
                  <option value="community">💬 Community / Event</option>
                  <option value="other">🌐 Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-1 block">
                  {form.source === 'referral' ? '👤 Referred by' :
                    form.source === 'community' ? '💬 Where' : '🔗 URL'}
                </label>
                <input
                  className="w-full bg-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder={
                    form.source === 'referral' ? 'e.g. John Smith (ex-Atlassian)' :
                      form.source === 'community' ? 'e.g. Sydney Tech Jobs Slack' :
                        'https://...'
                  }
                  value={form.url}
                  onChange={e => setForm({ ...form, url: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-1 block">⏰ Apply Before</label>
                <input
                  type="date"
                  min={today}
                  className="w-full bg-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={form.applyBefore}
                  onChange={e => setForm({ ...form, applyBefore: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Inbound specific */}
          {form.type === 'inbound' && (
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300 mb-1 block">👤 Contact Name</label>
                  <input
                    className="w-full bg-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="e.g. Sarah from Atlassian"
                    value={form.contactName}
                    onChange={e => setForm({ ...form, contactName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-1 block">Contacted via</label>
                  <select
                    className="w-full bg-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.contactVia}
                    onChange={e => setForm({ ...form, contactVia: e.target.value })}
                  >
                    <option value="email">📧 Email</option>
                    <option value="phone">📞 Phone</option>
                    <option value="linkedin">💼 LinkedIn Message</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-1 block">
                    {form.contactVia === 'email' ? '📧 Their Email' :
                      form.contactVia === 'phone' ? '📞 Their Number' :
                        '💼 Their LinkedIn'}
                  </label>
                  <input
                    className="w-full bg-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder={
                      form.contactVia === 'email' ? 'recruiter@company.com' :
                        form.contactVia === 'phone' ? '+61 4XX XXX XXX' :
                          'linkedin.com/in/...'
                    }
                    value={form.contactDetail}
                    onChange={e => setForm({ ...form, contactDetail: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-1 block">⏰ Respond By</label>
                  <input
                    type="date"
                    min={today}
                    className="w-full bg-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.respondBy}
                    onChange={e => setForm({ ...form, respondBy: e.target.value })}
                  />
                </div>
              </div>

              {/* They asked for */}
              <div>
                <label className="text-sm text-slate-300 mb-2 block">They asked for</label>
                <div className="flex flex-wrap gap-2">
                  {['Resume', 'Current CTC/Rate', 'Expected CTC/Rate', 'Availability',
                    'Notice Period', 'Work Rights', 'VEVO Copy'].map(item => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleAskedFor(item)}
                        className={`px-3 py-1 rounded-full text-sm transition ${form.theyAskedFor.includes(item)
                          ? 'bg-blue-500 text-white'
                          : 'bg-white/10 text-slate-300 hover:bg-white/20'
                          }`}
                      >
                        {item}
                      </button>
                    ))}
                </div>
              </div>

              {/* Your responses */}
              <div className="border-t border-white/10 pt-4">
                <label className="text-sm text-blue-300 mb-3 block font-semibold">📝 What you responded</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-300 mb-1 block">Your Current Role Type</label>
                    <select
                      className="w-full bg-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={form.currentRoleType}
                      onChange={e => setForm({ ...form, currentRoleType: e.target.value })}
                    >
                      <option value="permanent">💼 Permanent</option>
                      <option value="contract_daily">📋 Contract - Daily Rate</option>
                      <option value="contract_hourly">📋 Contract - Hourly Rate</option>
                      <option value="contract_annual">📋 Contract - Annual CTC</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-slate-300 mb-1 block">{rateLabel(form.currentRoleType)} (Current)</label>
                    <input
                      className="w-full bg-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder={ratePlaceholder(form.currentRoleType)}
                      value={form.currentRate}
                      onChange={e => setForm({ ...form, currentRate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-300 mb-1 block">{rateLabel(form.employmentType)} (Expected)</label>
                    <input
                      className="w-full bg-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder={ratePlaceholder(form.employmentType)}
                      value={form.expectedRate}
                      onChange={e => setForm({ ...form, expectedRate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-300 mb-1 block">Availability</label>
                    <input
                      className="w-full bg-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="e.g. 2 weeks / Immediate"
                      value={form.availability}
                      onChange={e => setForm({ ...form, availability: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-300 mb-1 block">Notice Period</label>
                    <input
                      className="w-full bg-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="e.g. 1 month"
                      value={form.noticePeriod}
                      onChange={e => setForm({ ...form, noticePeriod: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-300 mb-1 block">Work Rights</label>
                    <input
                      className="w-full bg-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="e.g. Australian PR, no sponsorship needed"
                      value={form.workRights}
                      onChange={e => setForm({ ...form, workRights: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-300 mb-1 block">Resume Sent?</label>
                    <select
                      className="w-full bg-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={form.resumeSent}
                      onChange={e => setForm({ ...form, resumeSent: e.target.value })}
                    >
                      <option value="not_yet">Not Yet</option>
                      <option value="yes">✅ Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-slate-300 mb-1 block">VEVO Copy Sent?</label>
                    <select
                      className="w-full bg-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={form.vevoCopy}
                      onChange={e => setForm({ ...form, vevoCopy: e.target.value })}
                    >
                      <option value="not_yet">Not Yet</option>
                      <option value="yes">✅ Yes</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm text-slate-300 mb-1 block">Response Notes</label>
                    <textarea
                      className="w-full bg-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Anything else you said or promised..."
                      rows={2}
                      value={form.responseNotes}
                      onChange={e => setForm({ ...form, responseNotes: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="pt-4 border-t border-white/10">
            <label className="text-sm text-slate-300 mb-1 block">Notes</label>
            <textarea
              className="w-full bg-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Anything you want to remember about this role..."
              rows={2}
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-800 text-white font-semibold py-3 rounded-xl transition"
          >
            {loading ? 'Saving...' : editingId ? '✏️ Update Lead' : '⚡ Save Lead'}
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

                {/* Delete confirmation */}
                {deleteConfirmId === lead.id && (
                  <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-4 py-3 mb-3 flex items-center justify-between">
                    <span className="text-red-300 text-sm">Are you sure you want to delete this lead?</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleDelete(lead.id)}
                        className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded-lg"
                      >
                        Yes, delete
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(null)}
                        className="bg-white/10 hover:bg-white/20 text-white text-sm px-3 py-1 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`w-2 h-2 rounded-full ${priorityColor(lead.priority)}`} />
                      <h3 className="font-semibold text-lg">{lead.company}</h3>
                      <span className="text-slate-400 text-sm">{priorityEmoji(lead.priority)} {lead.priority}</span>
                      <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">
                        {lead.type === 'inbound' ? '📩 Inbound' : '🔍 Outbound'}
                      </span>
                      {lead.employmentType && (
                        <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">
                          {empTypeLabel(lead.employmentType)}
                        </span>
                      )}
                      {lead.workArrangement && (
                        <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">
                          {lead.workArrangement === 'remote' ? '🏠 Remote' :
                            lead.workArrangement === 'hybrid' ? '🔄 Hybrid' : '🏢 Onsite'}
                        </span>
                      )}
                    </div>
                    <p className="text-blue-200 mt-1">{lead.role}</p>
                    {lead.location && <p className="text-slate-400 text-sm mt-1">📍 {lead.location}</p>}
                    {lead.rateAmount && (
                      <p className="text-green-400 text-sm mt-1">
                        💰 {lead.rateAmount}{lead.contractDuration ? ` · ${lead.contractDuration}` : ''}
                      </p>
                    )}
                    {lead.type === 'inbound' && lead.contactName && (
                      <p className="text-slate-400 text-sm mt-1">👤 {lead.contactName}</p>
                    )}
                    {lead.type === 'inbound' && lead.respondBy && (
                      <p className="text-yellow-400 text-sm mt-1">
                        ⏰ Respond by {new Date(lead.respondBy).toLocaleDateString()}
                      </p>
                    )}
                    {lead.type === 'outbound' && lead.applyBefore && (
                      <p className="text-yellow-400 text-sm mt-1">
                        ⏰ Apply before {new Date(lead.applyBefore).toLocaleDateString()}
                      </p>
                    )}
                    {lead.url && (
                      <a href={lead.url} target="_blank" className="text-sm text-blue-400 hover:underline mt-1 block">
                        🔗 View posting
                      </a>
                    )}
                    {lead.notes && <p className="text-slate-400 text-sm mt-2">📝 {lead.notes}</p>}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 ml-4">
                    <span className="text-xs text-slate-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleEdit(lead)}
                      className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg transition"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(lead.id)}
                      className="text-xs bg-red-500/20 hover:bg-red-500/40 text-red-300 px-3 py-1 rounded-lg transition"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}