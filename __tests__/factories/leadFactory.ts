// ─── Simple random helpers (no external library needed) ──────────────────────
const randomString = (prefix: string) => 
  `${prefix}_${Math.random().toString(36).substring(2, 8)}`;

const randomEmail = () => 
  `${randomString('user')}@${randomString('company')}.com`;

const randomUrl = () => 
  `https://www.${randomString('company')}.com/jobs`;

const futureDate = (daysFromNow: number) =>
  new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000)
    .toISOString().split('T')[0];

// ─── Valid Lead Payload (Outbound) ───────────────────────────────────────────
export const createLeadPayload = (overrides: Record<string, unknown> = {}) => ({
  company: randomString('Company'),
  role: 'Senior QA Engineer',
  type: 'outbound',
  priority: 'warm',
  source: 'linkedin',
  url: randomUrl(),
  employmentType: 'permanent',
  rateAmount: '$180k + super',
  workArrangement: 'hybrid',
  location: 'CBD Sydney',
  notes: randomString('notes'),
  status: 'new',
  ...overrides,
});

// ─── Inbound Lead Payload ────────────────────────────────────────────────────
export const createInboundLeadPayload = (overrides: Record<string, unknown> = {}) => ({
  company: randomString('Company'),
  role: 'Senior QA Engineer',
  type: 'inbound',
  priority: 'hot',
  source: null,
  employmentType: 'permanent',
  workArrangement: 'hybrid',
  location: 'CBD Sydney',
  contactName: randomString('Contact'),
  contactVia: 'email',
  contactDetail: randomEmail(),
  theyAskedFor: ['Resume', 'Current CTC/Rate'],
  respondBy: futureDate(7),
  currentRoleType: 'permanent',
  currentRate: '$170k + super',
  expectedRate: '$195k + super',
  availability: '2 weeks',
  noticePeriod: '1 month',
  workRights: 'Australian PR',
  resumeSent: 'not_yet',
  vevoCopy: 'not_yet',
  notes: randomString('notes'),
  ...overrides,
});

// ─── Contract Lead Payload ───────────────────────────────────────────────────
export const createContractLeadPayload = (overrides: Record<string, unknown> = {}) => ({
  ...createLeadPayload(),
  employmentType: 'contract_daily',
  rateAmount: '$850/day + super',
  contractDuration: '6 months',
  ...overrides,
});

// ─── Invalid Payloads (for negative tests) ───────────────────────────────────
export const missingCompanyPayload = () => {
  const payload = createLeadPayload();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { company, ...rest } = payload;
  return rest;
};

export const missingRolePayload = () => {
  const payload = createLeadPayload();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { role, ...rest } = payload;
  return rest;
};

export const emptyPayload = () => ({});

// ─── JD Text Generator ───────────────────────────────────────────────────────
export const createJDText = (role = 'Senior QA Engineer') => `
  We are looking for a ${role} to join our growing team in Sydney.

  About the Role:
  You will be responsible for designing and implementing 
  test automation frameworks across multiple squads.

  Key Responsibilities:
  - Design and implement test automation frameworks
  - Lead QA strategy across multiple squads
  - Mentor junior QA engineers
  - Drive shift-left testing practices

  Requirements:
  - 5+ years experience in test automation
  - Strong knowledge of Selenium/Playwright
  - Experience with CI/CD pipelines (GitHub Actions)
  - API testing experience with RestAssured or Supertest
  - Excellent communication skills

  Nice to have:
  - Experience with performance testing
  - Knowledge of security testing

  Location: Sydney, Australia (Hybrid)
  Salary: $185k + super
`;