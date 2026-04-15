import { Page } from '@playwright/test';

export class LandingPage {
  constructor(private page: Page) {}

  // ─── Locators ─────────────────────────────────────────────────────────────
  quickCaptureTile = () => 
    this.page.getByRole('heading', { name: 'Quick Capture' });
  
  applicationTrackerTile = () => 
    this.page.getByRole('heading', { name: 'Application Tracker' });
  
  companyDiscoveryTile = () => 
    this.page.getByRole('heading', { name: 'Company Discovery' });

  dashboardTile = () =>
    this.page.getByRole('heading', { name: 'Dashboard' });

  logo = () =>
    this.page.getByRole('heading', { name: 'TalentCompass' });

  tagline = () =>
    this.page.getByText('Your AI-powered job search companion');

  // ─── Actions ──────────────────────────────────────────────────────────────
  async goto() {
    await this.page.goto('/');
  }

  async clickQuickCapture() {
    await this.quickCaptureTile().click();
  }

  async clickApplicationTracker() {
    await this.applicationTrackerTile().click();
  }
}