// @ts-check
const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

test.describe('CrochetKit AI — Critical User Flows', () => {

  test.beforeEach(async ({ page }) => {
    // Clear any persisted state that could interfere with tests
    await page.goto(BASE_URL);
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.reload();
    await page.waitForLoadState('networkidle');
  });

  test('Page loads and shows the materials form', async ({ page }) => {
    // Verify the page title
    await expect(page).toHaveTitle(/Crochet Project Planner/);

    // Verify the main form elements are visible
    const form = page.locator('#project-form');
    await expect(form).toBeVisible();

    // Verify yarn weight input has default value 4
    const yarnWeight = page.locator('#yarnWeightNumber');
    await expect(yarnWeight).toBeVisible();
    await expect(yarnWeight).toHaveValue('4');

    // Verify the "Find Projects" button is present
    const findBtn = page.locator('#findProjectsBtn');
    await expect(findBtn).toBeVisible();
    await expect(findBtn).toHaveText(/Find Projects/);

    // Verify yardage field has default value 100
    const yardage = page.locator('#yardageHave');
    await expect(yardage).toHaveValue('100');

    // Verify dark mode toggle button exists
    const darkToggle = page.locator('#darkToggle');
    await expect(darkToggle).toBeVisible();
  });

  test('Dark mode toggle switches data-theme attribute', async ({ page }) => {
    const darkToggle = page.locator('#darkToggle');

    // Initially, data-theme should not be 'dark' (unless OS prefers)
    // We'll clear localStorage so it starts clean
    const initialTheme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    // Should be null or undefined initially
    expect(initialTheme).not.toBe('dark');

    // Click the dark mode toggle
    await darkToggle.click();

    // After click, data-theme should be 'dark'
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    // Verify localStorage was set
    const stored = await page.evaluate(() =>
      localStorage.getItem('crochetkit-dark')
    );
    expect(stored).toBe('true');

    // Click again to toggle back
    await darkToggle.click();

    // data-theme attribute should be removed
    await expect(page.locator('html')).not.toHaveAttribute('data-theme', 'dark');
  });

  test('Form interaction: fill details and Find Projects shows results', async ({ page }) => {
    // Set yarn weight to 4 (Medium worsted) — already default
    const yarnWeight = page.locator('#yarnWeightNumber');
    await yarnWeight.fill('4');

    // Set yardage to 300
    const yardage = page.locator('#yardageHave');
    await yardage.fill('300');

    // Set difficulty to Beginner
    const difficulty = page.locator('#difficulty');
    await difficulty.selectOption('beginner');

    // Click "Find Projects"
    const findBtn = page.locator('#findProjectsBtn');
    await findBtn.click();

    // Wait for the output section to become visible (it starts hidden)
    const output = page.locator('#output');
    await expect(output).toBeVisible({ timeout: 10000 });

    // The output header should read "Suggested Projects"
    const outputHeader = page.locator('#output-header');
    await expect(outputHeader).toHaveText(/Suggested Projects/);

    // Should have project cards or an empty state message
    // Wait for either .project-cards or .empty-state to appear
    await page.waitForFunction(() => {
      const cards = document.querySelector('.project-cards');
      const empty = document.querySelector('.empty-state');
      return cards !== null || empty !== null;
    }, { timeout: 10000 });

    // If we got project cards, verify they have content
    const projectCards = page.locator('.project-card');
    const emptyState = page.locator('.empty-state');
    const hasCards = await projectCards.count();

    if (hasCards > 0) {
      // Verify each card has a title and a "Select" button
      await expect(projectCards.first().locator('h3')).toBeVisible();
      await expect(projectCards.first().locator('.select-project')).toBeVisible();
    } else {
      // If no matches, empty state should explain
      await expect(emptyState).toBeVisible();
      await expect(emptyState.locator('h3')).toHaveText(/No matching projects/);
    }
  });

  test('Catalog navigation shows all patterns', async ({ page }) => {
    // Click the "Catalog" button
    const catalogBtn = page.locator('#browseAllBtn');
    await catalogBtn.click();

    // The output section should become visible
    const output = page.locator('#output');
    await expect(output).toBeVisible({ timeout: 10000 });

    // Header should say "Pattern Catalog"
    const outputHeader = page.locator('#output-header');
    await expect(outputHeader).toHaveText(/Pattern Catalog/);

    // Wait for project cards or catalog content to render
    await page.waitForFunction(() => {
      const cards = document.querySelector('.project-cards');
      const catCount = document.querySelector('.catalog-count');
      return (cards !== null && cards.children.length > 0) || catCount !== null;
    }, { timeout: 10000 });

    // Should show pattern catalog with filter UI
    const catFilter = page.locator('.catalog-filters');
    await expect(catFilter).toBeVisible();

    // Should have project cards with "Select" buttons
    const selectBtns = page.locator('.catalog-select');
    const count = await selectBtns.count();
    expect(count).toBeGreaterThan(0);

    // Verify first card has a title
    const firstCard = page.locator('.project-card').first();
    await expect(firstCard.locator('h3')).toBeVisible();
  });

  test('Pattern detail view opens when selecting a pattern from catalog', async ({ page }) => {
    // Open catalog first
    const catalogBtn = page.locator('#browseAllBtn');
    await catalogBtn.click();

    // Wait for catalog cards to render
    await page.waitForSelector('.catalog-select', { timeout: 10000 });

    // Click the first "Select" button
    const firstSelect = page.locator('.catalog-select').first();
    await firstSelect.click();

    // Wait for the project detail view to appear
    const detailView = page.locator('.project-detail');
    await expect(detailView).toBeVisible({ timeout: 10000 });

    // The detail header should contain a pattern name (h2)
    const detailHeader = detailView.locator('.detail-header h2');
    await expect(detailHeader).toBeVisible();
    const headerText = await detailHeader.textContent();
    expect(headerText.length).toBeGreaterThan(0);

    // Detail view should have materials section
    const materialsSummary = detailView.locator('summary h4');
    await expect(materialsSummary.first()).toBeVisible();
    await expect(materialsSummary.first()).toContainText(/Materials/);

    // Detail view should have steps
    const stepsSummary = detailView.locator('summary h4');
    const stepsText = await stepsSummary.last().textContent();
    // The last summary h4 should be "Steps" or "Stitches Used"
    expect(stepsText).toBeTruthy();
  });

  test('Surprise Me button generates a random project', async ({ page }) => {
    // Fill in basic details
    await page.locator('#yarnWeightNumber').fill('4');
    await page.locator('#yardageHave').fill('200');

    // Click "Surprise Me"
    const surpriseBtn = page.locator('#surpriseBtn');
    await surpriseBtn.click();

    // Wait for output to appear
    const output = page.locator('#output');
    await expect(output).toBeVisible({ timeout: 15000 });

    // Wait for either a project detail or project cards to render
    await page.waitForFunction(() => {
      const detail = document.querySelector('.project-detail');
      const cards = document.querySelector('.project-cards');
      const empty = document.querySelector('.empty-state');
      return detail !== null || cards !== null || empty !== null;
    }, { timeout: 10000 });

    // Check if we got a detail view (Surprise Me shows detail immediately)
    const detailView = page.locator('.project-detail');
    const detailCount = await detailView.count();
    if (detailCount > 0) {
      await expect(detailView.locator('.detail-header h2')).toBeVisible();
    } else {
      // Otherwise check for project cards
      const projectCards = page.locator('.project-card');
      const cardCount = await projectCards.count();
      if (cardCount > 0) {
        await expect(projectCards.first().locator('h3')).toBeVisible();
      } else {
        // Should at least have an empty state explaining no matches
        await expect(page.locator('.empty-state')).toBeVisible();
      }
    }
  });

  test('Term system toggle switches between US and UK terms', async ({ page }) => {
    // Check the default term system
    const termSelect = page.locator('#termSystem');
    await expect(termSelect).toHaveValue('US');

    // Switch to UK terms
    await termSelect.selectOption('UK');
    await expect(termSelect).toHaveValue('UK');

    // The header toggle should also reflect the change
    const headerToggle = page.locator('#termSystemHeader');
    await expect(headerToggle).toHaveValue('UK');

    // Now submit a find — it should use UK terms
    await page.locator('#yarnWeightNumber').fill('4');
    await page.locator('#yardageHave').fill('200');
    await page.locator('#findProjectsBtn').click();

    // Output should appear
    const output = page.locator('#output');
    await expect(output).toBeVisible({ timeout: 10000 });
  });

});
