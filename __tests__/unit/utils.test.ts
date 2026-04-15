import {
  rateLabel,
  ratePlaceholder,
  priorityColor,
  priorityEmoji,
  hasDeadline,
  empTypeLabel,
  statusConfig,
} from '@/lib/utils';

// ─── rateLabel ───────────────────────────────────────────────────────────────
describe('rateLabel', () => {
  it('returns Daily Rate for contract_daily', () => {
    expect(rateLabel('contract_daily')).toBe('💰 Daily Rate');
  });

  it('returns Hourly Rate for contract_hourly', () => {
    expect(rateLabel('contract_hourly')).toBe('💰 Hourly Rate');
  });

  it('returns Annual CTC for permanent', () => {
    expect(rateLabel('permanent')).toBe('💰 Annual CTC');
  });

  it('returns Annual CTC for contract_annual', () => {
    expect(rateLabel('contract_annual')).toBe('💰 Annual CTC');
  });

  it('returns Annual CTC for unknown type', () => {
    expect(rateLabel('unknown')).toBe('💰 Annual CTC');
  });

  it('returns Annual CTC for empty string', () => {
    expect(rateLabel('')).toBe('💰 Annual CTC');
  });
});

// ─── ratePlaceholder ─────────────────────────────────────────────────────────
describe('ratePlaceholder', () => {
  it('returns daily rate placeholder for contract_daily', () => {
    expect(ratePlaceholder('contract_daily')).toBe('e.g. $850/day + super');
  });

  it('returns hourly rate placeholder for contract_hourly', () => {
    expect(ratePlaceholder('contract_hourly')).toBe('e.g. $120/hr + super');
  });

  it('returns annual CTC placeholder for permanent', () => {
    expect(ratePlaceholder('permanent')).toBe('e.g. $185k + super');
  });

  it('returns annual CTC placeholder for unknown type', () => {
    expect(ratePlaceholder('unknown')).toBe('e.g. $185k + super');
  });
});

// ─── priorityColor ───────────────────────────────────────────────────────────
describe('priorityColor', () => {
  it('returns red for hot priority', () => {
    expect(priorityColor('hot')).toBe('bg-red-500');
  });

  it('returns yellow for warm priority', () => {
    expect(priorityColor('warm')).toBe('bg-yellow-500');
  });

  it('returns slate for maybe priority', () => {
    expect(priorityColor('maybe')).toBe('bg-slate-400');
  });

  it('returns slate for unknown priority', () => {
    expect(priorityColor('unknown')).toBe('bg-slate-400');
  });

  it('returns slate for empty string', () => {
    expect(priorityColor('')).toBe('bg-slate-400');
  });
});

// ─── priorityEmoji ───────────────────────────────────────────────────────────
describe('priorityEmoji', () => {
  it('returns fire emoji for hot', () => {
    expect(priorityEmoji('hot')).toBe('🔥');
  });

  it('returns sun emoji for warm', () => {
    expect(priorityEmoji('warm')).toBe('☀️');
  });

  it('returns snowflake for maybe', () => {
    expect(priorityEmoji('maybe')).toBe('❄️');
  });

  it('returns snowflake for unknown', () => {
    expect(priorityEmoji('unknown')).toBe('❄️');
  });
});

// ─── hasDeadline ─────────────────────────────────────────────────────────────
describe('hasDeadline', () => {
  it('returns true for take_home', () => {
    expect(hasDeadline('take_home')).toBe(true);
  });

  it('returns true for online_assessment', () => {
    expect(hasDeadline('online_assessment')).toBe(true);
  });

  it('returns false for phone_screen', () => {
    expect(hasDeadline('phone_screen')).toBe(false);
  });

  it('returns false for technical_1', () => {
    expect(hasDeadline('technical_1')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(hasDeadline('')).toBe(false);
  });
});

// ─── empTypeLabel ────────────────────────────────────────────────────────────
describe('empTypeLabel', () => {
  it('returns Contract Daily for contract_daily', () => {
    expect(empTypeLabel('contract_daily')).toBe('📋 Contract (Daily)');
  });

  it('returns Contract Hourly for contract_hourly', () => {
    expect(empTypeLabel('contract_hourly')).toBe('📋 Contract (Hourly)');
  });

  it('returns Contract Annual for contract_annual', () => {
    expect(empTypeLabel('contract_annual')).toBe('📋 Contract (Annual)');
  });

  it('returns Permanent for permanent', () => {
    expect(empTypeLabel('permanent')).toBe('💼 Permanent');
  });

  it('returns Permanent for unknown type', () => {
    expect(empTypeLabel('unknown')).toBe('💼 Permanent');
  });
});

// ─── statusConfig ────────────────────────────────────────────────────────────
describe('statusConfig', () => {
  it('has correct label for applied status', () => {
    expect(statusConfig['applied'].label).toBe('Applied');
  });

  it('has correct emoji for applied status', () => {
    expect(statusConfig['applied'].emoji).toBe('🟡');
  });

  it('has correct label for interviewing status', () => {
    expect(statusConfig['interviewing'].label).toBe('Interviewing');
  });

  it('has correct emoji for rejected status', () => {
    expect(statusConfig['rejected'].emoji).toBe('❌');
  });

  it('has correct label for accepted status', () => {
    expect(statusConfig['accepted'].label).toBe('Accepted');
  });

  it('has all 7 status types defined', () => {
    const expectedStatuses = [
      'applied', 'under_review', 'interviewing',
      'offer', 'accepted', 'rejected', 'withdrawn'
    ];
    expectedStatuses.forEach(status => {
      expect(statusConfig[status]).toBeDefined();
    });
  });
});