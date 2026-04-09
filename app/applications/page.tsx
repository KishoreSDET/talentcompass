'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Application = {
  id: number;
  leadId: number;
  company: string;
  role: string;
  employmentType: string;
  location: string;
  workArrangement: string;
  jobUrl: string;
  appliedVia: string;
  dateApplied: string;
  resumeVersion: string;
  coverLetterSent: string;
  portfolioSent: string;
  salaryDiscussed: string;
  salaryDetails: string;
  hiringManager: string;
  recruiterName: string;
  internalContact: string;
  status: string;
  lastActivityDate: string;
  nextAction: string;
  nextActionDate: string;
  rejectionReason: string;
  feedbackReceived: string;
  feedbackNotes: string;
  withdrawalReason: string;
  notes: string;
  createdAt: string;
};

type InterviewRound = {
  id: number;
  applicationId: number;
  roundNumber: number;
  roundType: string;
  scheduledDate: string;
  duration: string;
  interviewerName: string;
  interviewerRole: string;
  notes: string;
  outcome: string;
  createdAt: string;
};

const emptyForm = {
  company: '',
  role: '',
  employmentType: 'permanent',
  location: '',
  workArrangement: 'hybrid',
  jobUrl: '',
  appliedVia: 'company_portal',
  dateApplied: new Date().toISOString().split('T')[0],
  resumeVersion: '',
  coverLetterSent: 'no',
  portfolioSent: 'no',
  salaryDiscussed: 'no',
  salaryDetails: '',
  hiringManager: '',
  recruiterName: '',
  internalContact: '',
  nextAction: '',
  nextActionDate: '',
  notes: '',
};

const emptyRoundForm = {
  roundType: 'phone_screen',
  scheduledDate: '',
  duration: '',
  interviewerName: '',
  interviewerRole: '',
  notes: '',
  outcome: 'pending',
};

const statusConfig: Record<string, { label: string; color: string; emoji: string }> = {
  applied:      { label: 'Applied',       color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',  emoji: '🟡' },
  under_review: { label: 'Under Review',  color: 'bg-blue-500/20 text-blue-300 border-blue-500/40',        emoji: '🔵' },
  interviewing: { label: 'Interviewing',  color: 'bg-purple-500/20 text-purple-300 border-purple-500/40',  emoji: '🎯' },
  offer:        { label: 'Offer',         color: 'bg-green-500/20 text-green-300 border-green-500/40',     emoji: '💰' },
  accepted:     { label: 'Accepted',      color: 'bg-green-600/20 text-green-400 border-green-600/40',     emoji: '✅' },
  rejected:     { label: 'Rejected',      color: 'bg-red-500/20 text-red-300 border-red-500/40',           emoji: '❌' },
  withdrawn:    { label: 'Withdrawn',     color: 'bg-slate-500/20 text-slate-300 border-slate-500/40',     emoji: '🚪' },
};

const roundTypeLabel: Record<string, string> = {
  phone_screen:      '📞 Phone Screen',
  technical_1:       '💻 Technical Interview 1',
  technical_2:       '💻 Technical Interview 2',
  technical_3:       '💻 Technical Interview 3',
  system_design:     '🏗️ System Design',
  take_home:         '📝 Take Home Assignment',
  online_assessment: '💯 Online Assessment (Codility / HackerRank)',
  cultural_fit:      '🤝 Cultural Fit',
  hr_round:          '👔 HR Round',
  final:             '🎯 Final Round',
  other:             '📋 Other',
};

const hasDeadline = (roundType: string) =>
  ['take_home', 'online_assessment'].includes(roundType);
const today = new Date().toISOString().split('T')[0];

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [rounds, setRounds] = useState<Record<number, InterviewRound[]>>({});
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Application form
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Interview round form
  const [roundForm, setRoundForm] = useState(emptyRoundForm);
  const [addingRoundForId, setAddingRoundForId] = useState<number | null>(null);
  const [editingRoundId, setEditingRoundId] = useState<number | null>(null);
  const [deleteRoundConfirmId, setDeleteRoundConfirmId] = useState<number | null>(null);

  // Status update
  const [updatingStatusId, setUpdatingStatusId] = useState<number | null>(null);

  useEffect(() => { setMounted(true); }, []);

  const fetchApplications = async () => {
    const res = await fetch('/api/applications');
    const data = await res.json();
    setApplications(data);
    // fetch rounds for each application
    for (const app of data) {
      fetchRounds(app.id);
    }
  };

  const fetchRounds = async (applicationId: number) => {
    const res = await fetch(`/api/interview-rounds?applicationId=${applicationId}`);
    const data = await res.json();
    setRounds(prev => ({ ...prev, [applicationId]: data }));
  };

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    if (!form.company || !form.role || !form.dateApplied) {
      alert('Company, role and date applied are required');
      return;
    }
    setLoading(true);
    if (editingId) {
      await fetch('/api/applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId, ...form }),
      });
      setEditingId(null);
    } else {
      await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    setForm(emptyForm);
    setShowForm(false);
    await fetchApplications();
    setLoading(false);
  };

  const handleEdit = (app: Application) => {
    setEditingId(app.id);
    setForm({ ...emptyForm, ...app });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/applications?id=${id}`, { method: 'DELETE' });
    setDeleteConfirmId(null);
    await fetchApplications();
  };

  const handleStatusUpdate = async (id: number, status: string) => {
    await fetch('/api/applications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    setUpdatingStatusId(null);
    await fetchApplications();
  };

  const handleAddRound = async (applicationId: number) => {
    if (!roundForm.roundType) return;
    const appRounds = rounds[applicationId] || [];
    await fetch('/api/interview-rounds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        applicationId,
        roundNumber: appRounds.length + 1,
        ...roundForm,
      }),
    });
    // update application status to interviewing
    await fetch('/api/applications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: applicationId, status: 'interviewing' }),
    });
    setRoundForm(emptyRoundForm);
    setAddingRoundForId(null);
    await fetchApplications();
  };

  const handleEditRound = async (roundId: number) => {
    await fetch('/api/interview-rounds', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: roundId, ...roundForm }),
    });
    setEditingRoundId(null);
    setRoundForm(emptyRoundForm);
    await fetchApplications();
  };

  const handleDeleteRound = async (roundId: number, applicationId: number) => {
    await fetch(`/api/interview-rounds?id=${roundId}`, { method: 'DELETE' });
    setDeleteRoundConfirmId(null);
    await fetchRounds(applicationId);
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 text-white p-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <Link href="/" className="text-blue-300 text-sm hover:underline">← Back to Home</Link>
            <h1 className="text-3xl font-bold mt-2">📋 Application Tracker</h1>
            <p className="text-slate-400 mt-1">Track every application through to offer.</p>
          </div>
          <button
            type="button"
            onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptyForm); }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-5 py-2 rounded-xl transition"
          >
            {showForm ? '✕ Cancel' : '+ New Application'}
          </button>
        </div>

        {/* Application Form */}
        {showForm && (
          <div className="bg-white/10 rounded-2xl p-6 mb-8 space-y-4">
            {editingId && (
              <div className="bg-yellow-500/20 border border-yellow-500/40 rounded-xl px-4 py-3">
                <span className="text-yellow-300 text-sm font-semibold">✏️ Editing application</span>
              </div>
            )}

            {/* Basic Details */}
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
                <label className="text-sm text-slate-300 mb-1 block">📍 Location</label>
                <input
                  className="w-full bg-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="e.g. CBD, Pyrmont"
                  value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-1 block">🔗 Job URL</label>
                <input
                  className="w-full bg-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="https://..."
                  value={form.jobUrl}
                  onChange={e => setForm({ ...form, jobUrl: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-1 block">Applied Via</label>
                <select
                  className="w-full bg-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={form.appliedVia}
                  onChange={e => setForm({ ...form, appliedVia: e.target.value })}
                >
                  <option value="company_portal">🏢 Company Portal</option>
                  <option value="linkedin_easy">💼 LinkedIn Easy Apply</option>
                  <option value="email">📧 Email</option>
                  <option value="recruiter">👤 Recruiter</option>
                  <option value="seek">🔍 Seek</option>
                  <option value="referral">🤝 Referral</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-1 block">📅 Date Applied *</label>
                <input
                  type="date"
                  max={today}
                  className="w-full bg-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={form.dateApplied}
                  onChange={e => setForm({ ...form, dateApplied: e.target.value })}
                />
              </div>
            </div>

            {/* Documents */}
            <div className="pt-4 border-t border-white/10">
              <p className="text-sm text-blue-300 font-semibold mb-3">📄 Documents</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300 mb-1 block">Resume Version</label>
                  <input
                    className="w-full bg-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="e.g. Resume_Canva_QA_v2"
                    value={form.resumeVersion}
                    onChange={e => setForm({ ...form, resumeVersion: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-1 block">Cover Letter Sent?</label>
                  <select
                    className="w-full bg-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.coverLetterSent}
                    onChange={e => setForm({ ...form, coverLetterSent: e.target.value })}
                  >
                    <option value="no">No</option>
                    <option value="yes">✅ Yes</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-1 block">Portfolio / Samples Sent?</label>
                  <select
                    className="w-full bg-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.portfolioSent}
                    onChange={e => setForm({ ...form, portfolioSent: e.target.value })}
                  >
                    <option value="no">No</option>
                    <option value="yes">✅ Yes</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Compensation */}
            <div className="pt-4 border-t border-white/10">
              <p className="text-sm text-blue-300 font-semibold mb-3">💰 Compensation</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300 mb-1 block">Salary Discussed?</label>
                  <select
                    className="w-full bg-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.salaryDiscussed}
                    onChange={e => setForm({ ...form, salaryDiscussed: e.target.value })}
                  >
                    <option value="no">No</option>
                    <option value="yes">✅ Yes</option>
                  </select>
                </div>
                {form.salaryDiscussed === 'yes' && (
                  <div>
                    <label className="text-sm text-slate-300 mb-1 block">Details</label>
                    <input
                      className="w-full bg-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="e.g. $185k + super discussed"
                      value={form.salaryDetails}
                      onChange={e => setForm({ ...form, salaryDetails: e.target.value })}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Contacts */}
            <div className="pt-4 border-t border-white/10">
              <p className="text-sm text-blue-300 font-semibold mb-3">👥 Contacts</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300 mb-1 block">Hiring Manager</label>
                  <input
                    className="w-full bg-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="e.g. John Smith"
                    value={form.hiringManager}
                    onChange={e => setForm({ ...form, hiringManager: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-1 block">Recruiter Name</label>
                  <input
                    className="w-full bg-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="e.g. Sarah from Hays"
                    value={form.recruiterName}
                    onChange={e => setForm({ ...form, recruiterName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-1 block">Internal Contact</label>
                  <input
                    className="w-full bg-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="e.g. Mike (referred me)"
                    value={form.internalContact}
                    onChange={e => setForm({ ...form, internalContact: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Next Action */}
            <div className="pt-4 border-t border-white/10">
              <p className="text-sm text-blue-300 font-semibold mb-3">⏭️ Next Action</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300 mb-1 block">What</label>
                  <input
                    className="w-full bg-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="e.g. Follow up if no response"
                    value={form.nextAction}
                    onChange={e => setForm({ ...form, nextAction: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-1 block">By When</label>
                  <input
                    type="date"
                    min={today}
                    className="w-full bg-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.nextActionDate}
                    onChange={e => setForm({ ...form, nextActionDate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="pt-4 border-t border-white/10">
              <label className="text-sm text-slate-300 mb-1 block">Notes</label>
              <textarea
                className="w-full bg-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Anything else to note..."
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
              {loading ? 'Saving...' : editingId ? '✏️ Update Application' : '📋 Save Application'}
            </button>
          </div>
        )}

        {/* Applications List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Applications ({applications.length})</h2>
          {applications.length === 0 && (
            <div className="text-center text-slate-400 py-12">
              No applications yet — click &quot;+ New Application&quot; to add one! 👆
            </div>
          )}
          <div className="space-y-6">
            {applications.map(app => (
              <div key={app.id} className="bg-white/10 rounded-2xl p-5">

                {/* Delete confirmation */}
                {deleteConfirmId === app.id && (
                  <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-4 py-3 mb-3 flex items-center justify-between">
                    <span className="text-red-300 text-sm">Delete this application and all its interview rounds?</span>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => handleDelete(app.id)}
                        className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded-lg">
                        Yes, delete
                      </button>
                      <button type="button" onClick={() => setDeleteConfirmId(null)}
                        className="bg-white/10 hover:bg-white/20 text-white text-sm px-3 py-1 rounded-lg">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* App header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-lg">{app.company}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${statusConfig[app.status]?.color}`}>
                        {statusConfig[app.status]?.emoji} {statusConfig[app.status]?.label}
                      </span>
                      {app.workArrangement && (
                        <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">
                          {app.workArrangement === 'remote' ? '🏠 Remote' :
                           app.workArrangement === 'hybrid' ? '🔄 Hybrid' : '🏢 Onsite'}
                        </span>
                      )}
                    </div>
                    <p className="text-blue-200 mt-1">{app.role}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-slate-400">
                      {app.location && <span>📍 {app.location}</span>}
                      <span>📅 Applied {new Date(app.dateApplied).toLocaleDateString()}</span>
                      {app.appliedVia && <span>via {app.appliedVia.replace('_', ' ')}</span>}
                    </div>
                    {app.nextAction && (
                      <p className="text-yellow-400 text-sm mt-2">
                        ⏭️ {app.nextAction}
                        {app.nextActionDate ? ` by ${new Date(app.nextActionDate).toLocaleDateString()}` : ''}
                      </p>
                    )}
                    {app.salaryDiscussed === 'yes' && app.salaryDetails && (
                      <p className="text-green-400 text-sm mt-1">💰 {app.salaryDetails}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 ml-4">
                    <button type="button" onClick={() => handleEdit(app)}
                      className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg transition">
                      ✏️ Edit
                    </button>
                    <button type="button" onClick={() => setDeleteConfirmId(app.id)}
                      className="text-xs bg-red-500/20 hover:bg-red-500/40 text-red-300 px-3 py-1 rounded-lg transition">
                      🗑️ Delete
                    </button>
                    <button type="button" onClick={() => setUpdatingStatusId(updatingStatusId === app.id ? null : app.id)}
                      className="text-xs bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 px-3 py-1 rounded-lg transition">
                      🔄 Status
                    </button>
                  </div>
                </div>

                {/* Status updater */}
                {updatingStatusId === app.id && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-sm text-slate-300 mb-2">Update status to:</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(statusConfig).map(([key, val]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleStatusUpdate(app.id, key)}
                          className={`text-xs px-3 py-1 rounded-full border transition hover:opacity-80 ${val.color}`}
                        >
                          {val.emoji} {val.label}
                        </button>
                      ))}
                    </div>

                    {/* Rejection fields */}
                    {app.status === 'rejected' && (
                      <div className="mt-3 space-y-2">
                        <input
                          className="w-full bg-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                          placeholder="Rejection reason..."
                          onBlur={e => fetch('/api/applications', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: app.id, rejectionReason: e.target.value }),
                          })}
                        />
                        <textarea
                          className="w-full bg-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                          placeholder="Interview feedback notes (if received)..."
                          rows={2}
                          onBlur={e => fetch('/api/applications', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: app.id, feedbackNotes: e.target.value }),
                          })}
                        />
                      </div>
                    )}

                    {/* Withdrawal fields */}
                    {app.status === 'withdrawn' && (
                      <div className="mt-3">
                        <input
                          className="w-full bg-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                          placeholder="Withdrawal reason..."
                          onBlur={e => fetch('/api/applications', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: app.id, withdrawalReason: e.target.value }),
                          })}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Interview Rounds */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-slate-300">
                      🎯 Interview Rounds ({(rounds[app.id] || []).length})
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setAddingRoundForId(addingRoundForId === app.id ? null : app.id);
                        setRoundForm(emptyRoundForm);
                      }}
                      className="text-xs bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 px-3 py-1 rounded-lg transition"
                    >
                      + Add Round
                    </button>
                  </div>

                  {/* Rounds list */}
                  {(rounds[app.id] || []).map(round => (
                    <div key={round.id} className="bg-white/5 rounded-xl p-4 mb-2">

                      {/* Delete round confirmation */}
                      {deleteRoundConfirmId === round.id && (
                        <div className="bg-red-500/20 border border-red-500/40 rounded-lg px-3 py-2 mb-2 flex items-center justify-between">
                          <span className="text-red-300 text-xs">Delete this round?</span>
                          <div className="flex gap-2">
                            <button type="button"
                              onClick={() => handleDeleteRound(round.id, app.id)}
                              className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                              Yes
                            </button>
                            <button type="button"
                              onClick={() => setDeleteRoundConfirmId(null)}
                              className="bg-white/10 text-white text-xs px-2 py-1 rounded">
                              No
                            </button>
                          </div>
                        </div>
                      )}

                      {editingRoundId === round.id ? (
                        // Edit round form
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <select
                              className="bg-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none"
                              value={roundForm.roundType}
                              onChange={e => setRoundForm({ ...roundForm, roundType: e.target.value })}
                            >
                              {Object.entries(roundTypeLabel).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                              ))}
                            </select>
                            <select
                              className="bg-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none"
                              value={roundForm.outcome}
                              onChange={e => setRoundForm({ ...roundForm, outcome: e.target.value })}
                            >
                              <option value="pending">⏳ Pending</option>
                              <option value="passed">✅ Passed</option>
                              <option value="failed">❌ Failed</option>
                              <option value="withdrawn">🚪 Withdrawn</option>
                            </select>
                            <input
                              type="date"
                              className="bg-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none"
                              value={roundForm.scheduledDate}
                              onChange={e => setRoundForm({ ...roundForm, scheduledDate: e.target.value })}
                            />
                            {hasDeadline(roundForm.roundType) && (
                              <input
                                type="date"
                                min={today}
                                className="bg-red-900/40 border border-red-500/40 rounded-lg px-3 py-2 text-white text-sm focus:outline-none"
                                placeholder="Submission deadline"
                                value={roundForm.duration}
                                onChange={e => setRoundForm({ ...roundForm, duration: e.target.value })}
                              />
                            )}
                        {hasDeadline(roundForm.roundType) && (
                          <input
                            type="date"
                            min={today}
                            className="bg-red-900/40 border border-red-500/40 rounded-lg px-3 py-2 text-white text-sm focus:outline-none"
                            placeholder="Submission deadline"
                            value={roundForm.duration}
                            onChange={e => setRoundForm({ ...roundForm, duration: e.target.value })}
                          />
                        )}
                            <input
                              className="bg-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-400 focus:outline-none"
                              placeholder="Duration e.g. 45 mins"
                              value={roundForm.duration}
                              onChange={e => setRoundForm({ ...roundForm, duration: e.target.value })}
                            />
                            <input
                              className="bg-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-400 focus:outline-none"
                              placeholder="Interviewer name"
                              value={roundForm.interviewerName}
                              onChange={e => setRoundForm({ ...roundForm, interviewerName: e.target.value })}
                            />
                            <input
                              className="bg-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-400 focus:outline-none"
                              placeholder="Their role e.g. EM"
                              value={roundForm.interviewerRole}
                              onChange={e => setRoundForm({ ...roundForm, interviewerRole: e.target.value })}
                            />
                          </div>
                          <textarea
                            className="w-full bg-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-400 focus:outline-none"
                            placeholder="What was asked, topics covered..."
                            rows={2}
                            value={roundForm.notes}
                            onChange={e => setRoundForm({ ...roundForm, notes: e.target.value })}
                          />
                          <div className="flex gap-2">
                            <button type="button" onClick={() => handleEditRound(round.id)}
                              className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded-lg">
                              ✅ Save
                            </button>
                            <button type="button" onClick={() => setEditingRoundId(null)}
                              className="bg-white/10 text-white text-xs px-3 py-1 rounded-lg">
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        // Round display
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-semibold">Round {round.roundNumber}</span>
                              <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
                                {roundTypeLabel[round.roundType] || round.roundType}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                round.outcome === 'passed' ? 'bg-green-500/20 text-green-300' :
                                round.outcome === 'failed' ? 'bg-red-500/20 text-red-300' :
                                round.outcome === 'withdrawn' ? 'bg-slate-500/20 text-slate-300' :
                                'bg-yellow-500/20 text-yellow-300'
                              }`}>
                                {round.outcome === 'passed' ? '✅ Passed' :
                                 round.outcome === 'failed' ? '❌ Failed' :
                                 round.outcome === 'withdrawn' ? '🚪 Withdrawn' : '⏳ Pending'}
                              </span>
                            </div>
                            {round.scheduledDate && (
                              <p className="text-slate-400 text-xs mt-1">
                                📅 {new Date(round.scheduledDate).toLocaleDateString()}
                                {round.duration ? ` · ${round.duration}` : ''}
                              </p>
                            )}
                            {round.interviewerName && (
                              <p className="text-slate-400 text-xs mt-1">
                                👤 {round.interviewerName}
                                {round.interviewerRole ? ` (${round.interviewerRole})` : ''}
                              </p>
                            )}
                            {round.notes && (
                              <p className="text-slate-400 text-xs mt-1">📝 {round.notes}</p>
                            )}
                          </div>
                          <div className="flex gap-1 ml-2">
                            <button type="button"
                              onClick={() => {
                                setEditingRoundId(round.id);
                                setRoundForm({
                                  roundType: round.roundType,
                                  scheduledDate: round.scheduledDate || '',
                                  duration: round.duration || '',
                                  interviewerName: round.interviewerName || '',
                                  interviewerRole: round.interviewerRole || '',
                                  notes: round.notes || '',
                                  outcome: round.outcome || 'pending',
                                });
                              }}
                              className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded-lg">
                              ✏️
                            </button>
                            <button type="button"
                              onClick={() => setDeleteRoundConfirmId(round.id)}
                              className="text-xs bg-red-500/20 hover:bg-red-500/40 text-red-300 px-2 py-1 rounded-lg">
                              🗑️
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Add round form */}
                  {addingRoundForId === app.id && (
                    <div className="bg-white/5 rounded-xl p-4 mt-2 space-y-2">
                      <p className="text-sm text-purple-300 font-semibold">
                        + Round {(rounds[app.id] || []).length + 1}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          className="bg-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none"
                          value={roundForm.roundType}
                          onChange={e => setRoundForm({ ...roundForm, roundType: e.target.value })}
                        >
                          {Object.entries(roundTypeLabel).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                          ))}
                        </select>
                        <input
                          type="date"
                          className="bg-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none"
                          placeholder={hasDeadline(roundForm.roundType) ? 'Scheduled date' : 'Scheduled date'}
                          value={roundForm.scheduledDate}
                          onChange={e => setRoundForm({ ...roundForm, scheduledDate: e.target.value })}
                        />
                        {hasDeadline(roundForm.roundType) && (
                          <input
                            type="date"
                            min={today}
                            className="bg-red-900/40 border border-red-500/40 rounded-lg px-3 py-2 text-white text-sm focus:outline-none"
                            placeholder="Submission deadline"
                            value={roundForm.duration}
                            onChange={e => setRoundForm({ ...roundForm, duration: e.target.value })}
                          />
                        )}
                        <input
                          className="bg-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-400 focus:outline-none"
                          placeholder="Duration e.g. 45 mins"
                          value={roundForm.duration}
                          onChange={e => setRoundForm({ ...roundForm, duration: e.target.value })}
                        />
                        <input
                          className="bg-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-400 focus:outline-none"
                          placeholder="Interviewer name"
                          value={roundForm.interviewerName}
                          onChange={e => setRoundForm({ ...roundForm, interviewerName: e.target.value })}
                        />
                        <input
                          className="bg-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-400 focus:outline-none col-span-2"
                          placeholder="Their role e.g. Engineering Manager"
                          value={roundForm.interviewerRole}
                          onChange={e => setRoundForm({ ...roundForm, interviewerRole: e.target.value })}
                        />
                      </div>
                      <textarea
                        className="w-full bg-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-400 focus:outline-none"
                        placeholder="What was asked, topics covered, your notes..."
                        rows={3}
                        value={roundForm.notes}
                        onChange={e => setRoundForm({ ...roundForm, notes: e.target.value })}
                      />
                      <div className="flex gap-2">
                        <button type="button" onClick={() => handleAddRound(app.id)}
                          className="bg-purple-500 hover:bg-purple-600 text-white text-xs px-4 py-2 rounded-lg">
                          ✅ Save Round
                        </button>
                        <button type="button" onClick={() => setAddingRoundForId(null)}
                          className="bg-white/10 text-white text-xs px-4 py-2 rounded-lg">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}