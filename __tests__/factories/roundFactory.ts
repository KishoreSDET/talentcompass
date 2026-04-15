const randomString = (prefix: string) =>
  `${prefix}_${Math.random().toString(36).substring(2, 8)}`;

const today = new Date().toISOString().split('T')[0];

const futureDate = (daysFromNow: number) =>
  new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000)
    .toISOString().split('T')[0];

// ─── Valid Round Payload ─────────────────────────────────────────────────────
export const createRoundPayload = (
  applicationId: number,
  overrides: Record<string, unknown> = {}
) => ({
  applicationId,
  roundNumber: 1,
  roundType: 'phone_screen',
  scheduledDate: today,
  duration: '45 mins',
  interviewerName: randomString('Interviewer'),
  interviewerRole: 'Engineering Manager',
  notes: randomString('notes'),
  outcome: 'pending',
  ...overrides,
});

// ─── Take Home Assignment Payload ────────────────────────────────────────────
export const createTakeHomePayload = (
  applicationId: number,
  overrides: Record<string, unknown> = {}
) => ({
  applicationId,
  roundNumber: 1,
  roundType: 'take_home',
  scheduledDate: today,
  submissionDeadline: futureDate(5),
  notes: 'Build a web + API test automation framework',
  outcome: 'pending',
  ...overrides,
});

// ─── Online Assessment Payload ───────────────────────────────────────────────
export const createOnlineAssessmentPayload = (
  applicationId: number,
  overrides: Record<string, unknown> = {}
) => ({
  applicationId,
  roundNumber: 1,
  roundType: 'online_assessment',
  scheduledDate: today,
  submissionDeadline: futureDate(3),
  notes: 'HackerRank — 2 coding problems, 90 minutes',
  outcome: 'pending',
  ...overrides,
});

// ─── Invalid Payloads ────────────────────────────────────────────────────────
export const missingRoundTypePayload = (applicationId: number) => {
  const payload = createRoundPayload(applicationId);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { roundType, ...rest } = payload;
  return rest;
};

export const missingApplicationIdPayload = () => {
  const payload = createRoundPayload(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { applicationId, ...rest } = payload;
  return rest;
};