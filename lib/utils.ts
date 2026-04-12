// ─── Rate Label ──────────────────────────────────────────────────────────────
export const rateLabel = (empType: string): string => {
  if (empType === 'contract_daily') return '💰 Daily Rate';
  if (empType === 'contract_hourly') return '💰 Hourly Rate';
  return '💰 Annual CTC';
};

// ─── Rate Placeholder ────────────────────────────────────────────────────────
export const ratePlaceholder = (empType: string): string => {
  if (empType === 'contract_daily') return 'e.g. $850/day + super';
  if (empType === 'contract_hourly') return 'e.g. $120/hr + super';
  return 'e.g. $185k + super';
};

// ─── Priority Color ──────────────────────────────────────────────────────────
export const priorityColor = (priority: string): string => {
  if (priority === 'hot') return 'bg-red-500';
  if (priority === 'warm') return 'bg-yellow-500';
  return 'bg-slate-400';
};

// ─── Priority Emoji ──────────────────────────────────────────────────────────
export const priorityEmoji = (priority: string): string => {
  if (priority === 'hot') return '🔥';
  if (priority === 'warm') return '☀️';
  return '❄️';
};

// ─── Has Deadline ────────────────────────────────────────────────────────────
export const hasDeadline = (roundType: string): boolean =>
  ['take_home', 'online_assessment'].includes(roundType);

// ─── Employment Type Label ───────────────────────────────────────────────────
export const empTypeLabel = (empType: string): string => {
  if (empType === 'contract_daily') return '📋 Contract (Daily)';
  if (empType === 'contract_hourly') return '📋 Contract (Hourly)';
  if (empType === 'contract_annual') return '📋 Contract (Annual)';
  return '💼 Permanent';
};

// ─── Status Config ───────────────────────────────────────────────────────────
export const statusConfig: Record<string, {
  label: string;
  color: string;
  emoji: string;
}> = {
  applied:      { label: 'Applied',      color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',  emoji: '🟡' },
  under_review: { label: 'Under Review', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40',        emoji: '🔵' },
  interviewing: { label: 'Interviewing', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40',  emoji: '🎯' },
  offer:        { label: 'Offer',        color: 'bg-green-500/20 text-green-300 border-green-500/40',     emoji: '💰' },
  accepted:     { label: 'Accepted',     color: 'bg-green-600/20 text-green-400 border-green-600/40',     emoji: '✅' },
  rejected:     { label: 'Rejected',     color: 'bg-red-500/20 text-red-300 border-red-500/40',           emoji: '❌' },
  withdrawn:    { label: 'Withdrawn',    color: 'bg-slate-500/20 text-slate-300 border-slate-500/40',     emoji: '🚪' },
};

// ─── Round Type Label ────────────────────────────────────────────────────────
export const roundTypeLabel: Record<string, string> = {
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