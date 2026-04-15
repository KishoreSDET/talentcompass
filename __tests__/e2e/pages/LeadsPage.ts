import { Page } from '@playwright/test';

export class LeadsPage {
  constructor(private page: Page) {}

  // ─── Locators ─────────────────────────────────────────────────────────────
  heading = () =>
    this.page.getByRole('heading', { name: 'Quick Capture' });

  outboundToggle = () =>
    this.page.getByRole('button', { name: '🔍 I Found a Role' });

  inboundToggle = () =>
    this.page.getByRole('button', { name: '📩 Someone Reached Out' });

  companyInput = () =>
    this.page.getByPlaceholder('e.g. Canva');

  roleInput = () =>
    this.page.getByPlaceholder('e.g. Senior QA Engineer');

  prioritySelect = () =>
    this.page.getByRole('combobox').first();

  notesInput = () =>
    this.page.getByPlaceholder('Anything you want to remember about this role...');

  saveButton = () =>
    this.page.getByRole('button', { name: '⚡ Save Lead' });

  leadsCount = () =>
    this.page.getByText(/Your Leads \(\d+\)/);

  backToHome = () =>
    this.page.getByRole('link', { name: '← Back to Home' });

  // ─── Actions ──────────────────────────────────────────────────────────────
  async goto() {
    await this.page.goto('/leads');
  }

  async saveLead(company: string, role: string, notes = '') {
    await this.companyInput().fill(company);
    await this.roleInput().fill(role);
    if (notes) await this.notesInput().fill(notes);
    await this.saveButton().click();
  }

  async selectOutbound() {
    await this.outboundToggle().click();
  }

  async selectInbound() {
    await this.inboundToggle().click();
  }

  async getLeadsCount(): Promise<number> {
    const text = await this.leadsCount().textContent();
    const match = text?.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  }
}