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
  source: text('source'),
  url: text('url'),
  contactName: text('contact_name'),
  contactVia: text('contact_via'),
  contactDetail: text('contact_detail'),
  theyAskedFor: text('they_asked_for'),
  respondBy: text('respond_by'),
  currentCtc: text('current_ctc'),
  expectedCtc: text('expected_ctc'),
  availability: text('availability'),
  noticePeriod: text('notice_period'),
  resumeSent: text('resume_sent').default('no'),
  responseNotes: text('response_notes'),
  status: text('status').notNull().default('new'),
  createdAt: text('created_at').notNull(),
});

const sqlite = new Database('talentcompass.db');
export const db = drizzle(sqlite);

// CREATE only if it doesn't exist — never drop
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
    contact_name TEXT,
    contact_via TEXT,
    contact_detail TEXT,
    they_asked_for TEXT,
    respond_by TEXT,
    current_ctc TEXT,
    expected_ctc TEXT,
    availability TEXT,
    notice_period TEXT,
    resume_sent TEXT DEFAULT 'no',
    response_notes TEXT,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TEXT NOT NULL
  )
`);