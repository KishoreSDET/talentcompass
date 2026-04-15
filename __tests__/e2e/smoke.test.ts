import { test, expect } from '@playwright/test';
import { LandingPage } from './pages/LandingPage';
import { LeadsPage } from './pages/LeadsPage';
import { ApplicationsPage } from './pages/ApplicationPage';

// ─── Landing Page Tests ───────────────────────────────────────────────────────
test.describe('Landing Page', () => {

  test('shows TalentCompass branding', async ({ page }) => {
    const landingPage = new LandingPage(page);
    await landingPage.goto();

    await expect(landingPage.logo()).toBeVisible();
    await expect(landingPage.tagline()).toBeVisible();
  });

  test('shows all 4 feature tiles', async ({ page }) => {
    const landingPage = new LandingPage(page);
    await landingPage.goto();

    await expect(landingPage.quickCaptureTile()).toBeVisible();
    await expect(landingPage.applicationTrackerTile()).toBeVisible();
    await expect(landingPage.companyDiscoveryTile()).toBeVisible();
    await expect(landingPage.dashboardTile()).toBeVisible();
  });

  test('navigates to Quick Capture when tile clicked', async ({ page }) => {
    const landingPage = new LandingPage(page);
    await landingPage.goto();
    await landingPage.clickQuickCapture();

    await expect(page).toHaveURL('/leads');
  });

  test('navigates to Application Tracker when tile clicked', async ({ page }) => {
    const landingPage = new LandingPage(page);
    await landingPage.goto();
    await landingPage.clickApplicationTracker();

    await expect(page).toHaveURL('/applications');
  });

});

// ─── Quick Capture Tests ──────────────────────────────────────────────────────
test.describe('Quick Capture', () => {

  test('page loads with correct heading', async ({ page }) => {
    const leadsPage = new LeadsPage(page);
    await leadsPage.goto();

    await expect(leadsPage.heading()).toBeVisible();
  });

  test('shows outbound and inbound toggle buttons', async ({ page }) => {
    const leadsPage = new LeadsPage(page);
    await leadsPage.goto();

    await expect(leadsPage.outboundToggle()).toBeVisible();
    await expect(leadsPage.inboundToggle()).toBeVisible();
  });

  test('saves a lead successfully and updates count', async ({ page }) => {
    const leadsPage = new LeadsPage(page);
    await leadsPage.goto();

    const countBefore = await leadsPage.getLeadsCount();
    await leadsPage.saveLead('E2E Test Company', 'Senior QA Engineer');
    const countAfter = await leadsPage.getLeadsCount();

    expect(countAfter).toBeGreaterThan(countBefore);
  });

  test('shows lead in list after saving', async ({ page }) => {
    const leadsPage = new LeadsPage(page);
    await leadsPage.goto();

    await leadsPage.saveLead('UniqueE2ECompany', 'QA Lead');
    await expect(page.getByText('UniqueE2ECompany').first()).toBeVisible();
  });

  test('navigates back to home', async ({ page }) => {
    const leadsPage = new LeadsPage(page);
    await leadsPage.goto();

    await leadsPage.backToHome().click();
    await expect(page).toHaveURL('/');
  });

});

// ─── Application Tracker Tests ────────────────────────────────────────────────
test.describe('Application Tracker', () => {

  test('page loads with correct heading', async ({ page }) => {
    const applicationsPage = new ApplicationsPage(page);
    await applicationsPage.goto();

    await expect(applicationsPage.heading()).toBeVisible();
  });

  test('shows new application button', async ({ page }) => {
    const applicationsPage = new ApplicationsPage(page);
    await applicationsPage.goto();

    await expect(applicationsPage.newApplicationButton()).toBeVisible();
  });

  test('opens form when new application clicked', async ({ page }) => {
    const applicationsPage = new ApplicationsPage(page);
    await applicationsPage.goto();
    await applicationsPage.openNewApplicationForm();

    await expect(applicationsPage.companyInput()).toBeVisible();
    await expect(applicationsPage.saveButton()).toBeVisible();
  });

  test('saves application and updates count', async ({ page }) => {
    const applicationsPage = new ApplicationsPage(page);
    await applicationsPage.goto();

    const countBefore = await applicationsPage.getApplicationsCount();
    await applicationsPage.openNewApplicationForm();
    await applicationsPage.saveApplication('E2E Canva', 'Senior QA Engineer');
    const countAfter = await applicationsPage.getApplicationsCount();

    expect(countAfter).toBeGreaterThan(countBefore);
  });

  test('navigates back to home', async ({ page }) => {
    const applicationsPage = new ApplicationsPage(page);
    await applicationsPage.goto();

    await applicationsPage.backToHome().click();
    await expect(page).toHaveURL('/');
  });

});