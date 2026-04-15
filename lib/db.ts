import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// ─── LEADS TABLE ────────────────────────────────────────────────────────────
export const leads = sqliteTable('leads', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  type: text('type').notNull().default('outbound'),
  company: text('company').notNull(),
  role: text('role').notNull(),
  priority: text('priority').notNull().default('warm'),
  notes: text('notes'),
  source: text('source'),
  url: text('url'),
  applyBefore: text('apply_before'),
  employmentType: text('employment_type'),
  rateAmount: text('rate_amount'),
  contractDuration: text('contract_duration'),
  workArrangement: text('work_arrangement'),
  location: text('location'),
  contactName: text('contact_name'),
  contactVia: text('contact_via'),
  contactDetail: text('contact_detail'),
  theyAskedFor: text('they_asked_for'),
  respondBy: text('respond_by'),
  currentRoleType: text('current_role_type'),
  currentRate: text('current_rate'),
  expectedRate: text('expected_rate'),
  availability: text('availability'),
  noticePeriod: text('notice_period'),
  workRights: text('work_rights'),
  vevoCopy: text('vevo_copy').default('not_yet'),
  resumeSent: text('resume_sent').default('not_yet'),
  responseNotes: text('response_notes'),
  status: text('status').notNull().default('new'),
  createdAt: text('created_at').notNull(),
});

// ─── APPLICATIONS TABLE ──────────────────────────────────────────────────────
export const applications = sqliteTable('applications', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  leadId: integer('lead_id'),                            // optional link to lead

  // Basic details
  company: text('company').notNull(),
  role: text('role').notNull(),
  employmentType: text('employment_type'),
  location: text('location'),
  workArrangement: text('work_arrangement'),
  jobUrl: text('job_url'),

  // How applied
  appliedVia: text('applied_via'),
  // linkedin_easy / company_portal / email / recruiter
  dateApplied: text('date_applied').notNull(),

  // Documents
  resumeVersion: text('resume_version'),
  coverLetterSent: text('cover_letter_sent').default('no'),
  portfolioSent: text('portfolio_sent').default('no'),

  // Compensation
  salaryDiscussed: text('salary_discussed').default('no'),
  salaryDetails: text('salary_details'),

  // Contacts
  hiringManager: text('hiring_manager'),
  recruiterName: text('recruiter_name'),
  internalContact: text('internal_contact'),

  // Status
  status: text('status').notNull().default('applied'),
  // applied / under_review / interviewing / offer / accepted / rejected / withdrawn
  lastActivityDate: text('last_activity_date'),
  nextAction: text('next_action'),
  nextActionDate: text('next_action_date'),

  // Closed details
  rejectionReason: text('rejection_reason'),
  feedbackReceived: text('feedback_received').default('no'),
  feedbackNotes: text('feedback_notes'),
  withdrawalReason: text('withdrawal_reason'),

  notes: text('notes'),
  jdText: text('jd_text'),
  createdAt: text('created_at').notNull(),
});

// ─── INTERVIEW ROUNDS TABLE ──────────────────────────────────────────────────
export const interviewRounds = sqliteTable('interview_rounds', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  applicationId: integer('application_id').notNull(),
  roundNumber: integer('round_number').notNull(),
  roundType: text('round_type').notNull(),
  scheduledDate: text('scheduled_date'),
  duration: text('duration'),                        // for interview rounds only
  submissionDeadline: text('submission_deadline'),   // for take_home and online_assessment only
  interviewerName: text('interviewer_name'),
  interviewerRole: text('interviewer_role'),
  notes: text('notes'),
  outcome: text('outcome').default('pending'),
  createdAt: text('created_at').notNull(),
});

// ─── DATABASE CONNECTION ─────────────────────────────────────────────────────
const dbPath = process.env.NODE_ENV === 'test' ? ':memory:' : 'talentcompass.db';
const sqlite = new Database(dbPath);
export const db = drizzle(sqlite);

// ─── CREATE TABLES ───────────────────────────────────────────────────────────
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL DEFAULT 'outbound',
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'warm',
    notes TEXT,
    source TEXT,
    url TEXT,
    apply_before TEXT,
    employment_type TEXT,
    rate_amount TEXT,
    contract_duration TEXT,
    work_arrangement TEXT,
    location TEXT,
    contact_name TEXT,
    contact_via TEXT,
    contact_detail TEXT,
    they_asked_for TEXT,
    respond_by TEXT,
    current_role_type TEXT,
    current_rate TEXT,
    expected_rate TEXT,
    availability TEXT,
    notice_period TEXT,
    work_rights TEXT,
    vevo_copy TEXT DEFAULT 'not_yet',
    resume_sent TEXT DEFAULT 'not_yet',
    response_notes TEXT,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TEXT NOT NULL
  )
`);

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    employment_type TEXT,
    location TEXT,
    work_arrangement TEXT,
    job_url TEXT,
    applied_via TEXT,
    date_applied TEXT NOT NULL,
    resume_version TEXT,
    cover_letter_sent TEXT DEFAULT 'no',
    portfolio_sent TEXT DEFAULT 'no',
    salary_discussed TEXT DEFAULT 'no',
    salary_details TEXT,
    hiring_manager TEXT,
    recruiter_name TEXT,
    internal_contact TEXT,
    status TEXT NOT NULL DEFAULT 'applied',
    last_activity_date TEXT,
    next_action TEXT,
    next_action_date TEXT,
    rejection_reason TEXT,
    feedback_received TEXT DEFAULT 'no',
    feedback_notes TEXT,
    withdrawal_reason TEXT,
    notes TEXT,
    jd_text TEXT,
    created_at TEXT NOT NULL
  )
`);

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS interview_rounds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    application_id INTEGER NOT NULL,
    round_number INTEGER NOT NULL,
    round_type TEXT NOT NULL,
    scheduled_date TEXT,
    duration TEXT,
    submission_deadline TEXT,
    interviewer_name TEXT,
    interviewer_role TEXT,
    notes TEXT,
    outcome TEXT DEFAULT 'pending',
    created_at TEXT NOT NULL
  )
`);

// ─── SAFE MIGRATIONS ─────────────────────────────────────────────────────────
const leadsColumns = (sqlite.prepare(`PRAGMA table_info(leads)`).all() as { name: string }[]).map(c => c.name);
// Safe migrations for applications
const appColumns = (sqlite.prepare(`PRAGMA table_info(applications)`).all() as { name: string }[]).map(c => c.name);
const appNewCols = [
  { name: 'jd_text', definition: 'TEXT' },
];
for (const col of appNewCols) {
  if (!appColumns.includes(col.name)) {
    sqlite.exec(`ALTER TABLE applications ADD COLUMN ${col.name} ${col.definition}`);
  }
}
const leadsNewCols = [
  { name: 'apply_before', definition: 'TEXT' },
  { name: 'rate_amount', definition: 'TEXT' },
  { name: 'current_role_type', definition: 'TEXT' },
  { name: 'current_rate', definition: 'TEXT' },
  { name: 'expected_rate', definition: 'TEXT' },
  { name: 'vevo_copy', definition: 'TEXT DEFAULT \'not_yet\'' },
];
for (const col of leadsNewCols) {
  if (!leadsColumns.includes(col.name)) {
    sqlite.exec(`ALTER TABLE leads ADD COLUMN ${col.name} ${col.definition}`);
  }
}

// Safe migrations for interview_rounds
const roundColumns = (sqlite.prepare(`PRAGMA table_info(interview_rounds)`).all() as { name: string }[]).map(c => c.name);
const roundNewCols = [
  { name: 'submission_deadline', definition: 'TEXT' },
];
for (const col of roundNewCols) {
  if (!roundColumns.includes(col.name)) {
    sqlite.exec(`ALTER TABLE interview_rounds ADD COLUMN ${col.name} ${col.definition}`);
  }
}