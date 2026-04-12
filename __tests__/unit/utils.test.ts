// ─── Utility functions copied from leads page for testing ───────────────────
const rateLabel = (empType: string): string => {
  if (empType === 'contract_daily') return '💰 Daily Rate';
  if (empType === 'contract_hourly') return '💰 Hourly Rate';
  return '💰 Annual CTC';
};

const ratePlaceholder = (empType: string): string => {
  if (empType === 'contract_daily') return 'e.g. $850/day + super';
  if (empType === 'contract_hourly') return 'e.g. $120/hr + super';
  return 'e.g. $185k + super';
};

const priorityColor = (priority: string): string => {
  if (priority === 'hot') return 'bg-red-500';
  if (priority === 'warm') return 'bg-yellow-500';
  return 'bg-slate-400';
};

const priorityEmoji = (priority: string): string => {
  if (priority === 'hot') return '🔥';
  if (priority === 'warm') return '☀️';
  return '❄️';
};

const hasDeadline = (roundType: string): boolean =>
  ['take_home', 'online_assessment'].includes(roundType);

// ─── Tests ───────────────────────────────────────────────────────────────────

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