import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('about:blank');
  await page.goto('chrome-error://chromewebdata/');
  await page.goto('http://localhost:3000/');
  await page.getByPlaceholder('Username').click();
  await page.getByPlaceholder('Username').fill('dorive+7_09_36@example.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('test123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: ' APIs' }).click();
  await page.getByText('UDG-RestAndGql').click();
  await page.getByRole('button', { name: 'Schema' }).click();
  await page.locator('label').filter({ hasText: 'restQuery' }).first().click();
  await page.getByTestId('configure_rest').click();
  await page.getByPlaceholder('Enter data source url').click();
  await page.getByPlaceholder('Enter data source url').fill('dupa');
  await page.getByPlaceholder('Search parameter').fill('rest');
  await page.locator('span').filter({ hasText: /^restQuery$/ }).click();
});