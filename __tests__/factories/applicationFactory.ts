import { createJDText } from './leadFactory';

const randomString = (prefix: string) =>
  `${prefix}_${Math.random().toString(36).substring(2, 8)}`;

const futureDate = (daysFromNow: number) =>
  new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000)
    .toISOString().split('T')[0];

const today = new Date().toISOString().split('T')[0];

// ─── Valid Application Payload ───────────────────────────────────────────────
export const createApplicationPayload = (overrides: Record<string, unknown> = {}) => ({
  company: randomString('Company'),
  role: 'Senior QA Engineer',
  employmentType: 'permanent',
  location: 'CBD Sydney',
  workArrangement: 'hybrid',
  jobUrl: `https://www.${randomString('company')}.com/jobs`,
  appliedVia: 'company_portal',
  dateApplied: today,
  resumeVersion: 'Resume_QA_Senior_v2',
  coverLetterSent: 'yes',
  portfolioSent: 'no',
  salaryDiscussed: 'yes',
  salaryDetails: '$185k + super discussed',
  hiringManager: randomString('Manager'),
  recruiterName: randomString('Recruiter'),
  internalContact: randomString('Contact'),
  nextAction: 'Follow up if no response',
  nextActionDate: futureDate(7),
  jdText: createJDText('Senior QA Engineer'),
  notes: randomString('notes'),
  ...overrides,
});

// ─── Contract Application Payload ────────────────────────────────────────────
export const createContractApplicationPayload = (overrides: Record<string, unknown> = {}) => ({
  ...createApplicationPayload(),
  employmentType: 'contract_daily',
  salaryDetails: '$850/day + super discussed',
  ...overrides,
});

// ─── Invalid Payloads ────────────────────────────────────────────────────────
export const missingCompanyPayload = () => {
  const payload = createApplicationPayload();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { company, ...rest } = payload;
  return rest;
};

export const missingRolePayload = () => {
  const payload = createApplicationPayload();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { role, ...rest } = payload;
  return rest;
};

export const missingDateAppliedPayload = () => {
  const payload = createApplicationPayload();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { dateApplied, ...rest } = payload;
  return rest;
};