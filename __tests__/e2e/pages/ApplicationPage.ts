import { Page } from '@playwright/test';

export class ApplicationsPage {
  constructor(private page: Page) {}

  // ─── Locators ─────────────────────────────────────────────────────────────
  heading = () =>
    this.page.getByRole('heading', { name: 'Application Tracker' });

  newApplicationButton = () =>
    this.page.getByRole('button', { name: '+ New Application' });

  companyInput = () =>
    this.page.getByPlaceholder('e.g. Canva');

  roleInput = () =>
    this.page.getByPlaceholder('e.g. Senior QA Engineer');

  saveButton = () =>
    this.page.getByRole('button', { name: '📋 Save Application' });

  applicationsCount = () =>
    this.page.getByText(/Your Applications \(\d+\)/);

  backToHome = () =>
    this.page.getByRole('link', { name: '← Back to Home' });

  // ─── Actions ──────────────────────────────────────────────────────────────
  async goto() {
    await this.page.goto('/applications');
  }

  async openNewApplicationForm() {
    await this.newApplicationButton().click();
  }

  async saveApplication(company: string, role: string) {
    await this.companyInput().fill(company);
    await this.roleInput().fill(role);
    await this.saveButton().click();
  }

  async getApplicationsCount(): Promise<number> {
    const text = await this.applicationsCount().textContent();
    const match = text?.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  }
}