import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const leads = sqliteTable('leads', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  type: text('type').notNull().default('outbound'),
  company: text('company').notNull(),
  role: text('role').notNull(),
  priority: text('priority').notNull().default('warm'),
  notes: text('notes'),

  // Outbound fields
  source: text('source'),
  url: text('url'),
  applyBefore: text('apply_before'),

  // Role details
  employmentType: text('employment_type'),
  // permanent / contract_daily / contract_hourly / contract_annual
  rateAmount: text('rate_amount'),
  // daily rate / hourly rate / annual ctc depending on employment type
  contractDuration: text('contract_duration'),
  workArrangement: text('work_arrangement'),
  location: text('location'),

  // Inbound fields
  contactName: text('contact_name'),
  contactVia: text('contact_via'),
  contactDetail: text('contact_detail'),
  theyAskedFor: text('they_asked_for'),
  respondBy: text('respond_by'),

  // Your responses — current role
  currentRoleType: text('current_role_type'),
  // permanent / contract_daily / contract_hourly / contract_annual
  currentRate: text('current_rate'),
  // stores CTC or daily/hourly rate depending on currentRoleType

  // Your responses — expected for new role
  expectedRate: text('expected_rate'),
  // stores expected CTC or daily/hourly rate depending on employmentType

  availability: text('availability'),
  noticePeriod: text('notice_period'),
  workRights: text('work_rights'),
  vevoCopy: text('vevo_copy').default('no'),
  resumeSent: text('resume_sent').default('not_yet'),
  responseNotes: text('response_notes'),

  status: text('status').notNull().default('new'),
  createdAt: text('created_at').notNull(),
});

const sqlite = new Database('talentcompass.db');
export const db = drizzle(sqlite);

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
    vevo_copy TEXT DEFAULT 'no',
    resume_sent TEXT DEFAULT 'not_yet',
    response_notes TEXT,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TEXT NOT NULL
  )
`);

// Safe migrations — only add columns if they don't exist
const existingColumns = sqlite.prepare(`PRAGMA table_info(leads)`).all() as { name: string }[];
const columnNames = existingColumns.map(col => col.name);

const newColumns: { name: string; definition: string }[] = [
  { name: 'apply_before', definition: 'TEXT' },
  { name: 'rate_amount', definition: 'TEXT' },
  { name: 'current_role_type', definition: 'TEXT' },
  { name: 'current_rate', definition: 'TEXT' },
  { name: 'expected_rate', definition: 'TEXT' },
  { name: 'vevo_copy', definition: 'TEXT DEFAULT \'no\'' },
];

for (const col of newColumns) {
  if (!columnNames.includes(col.name)) {
    sqlite.exec(`ALTER TABLE leads ADD COLUMN ${col.name} ${col.definition}`);
  }
}