import { test, expect } from '@playwright/test';

const users = [
  { username: 'standard_user', password: 'secret_sauce' },
  { username: 'locked_out_user', password: 'secret_sauce' },
  { username: 'problem_user', password: 'secret_sauce' },
  { username: 'performance_glitch_user', password: 'secret_sauce' }
];

for (const user of users) {
  test(`Checkout flow for ${user.username}`, async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', user.username);
    await page.fill('[data-test="password"]', user.password);
    await page.click('[data-test="login-button"]');
    await page.screenshot({ path: `test-results/${user.username}-01-login.png` });

    if (await page.locator('[data-test="error"]').isVisible()) {
      console.warn(`${user.username} failed to login`);
      await page.screenshot({ path: `test-results/${user.username}-login-error.png` });
      return;
    }

    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click('.shopping_cart_link');
    await page.click('[data-test="checkout"]');
    await page.fill('[data-test="firstName"]', 'Test');
    await page.fill('[data-test="lastName"]', 'User');
    await page.fill('[data-test="postalCode"]', '12345');
    await page.click('[data-test="continue"]');

    // 👇 Check if error message appears after "Continue"
    const errorLocator = page.locator('[data-test="error"]');
    if (await errorLocator.isVisible()) {
      console.warn(`${user.username} failed checkout form`);
      await page.screenshot({ path: `test-results/${user.username}-form-error.png` });
      return;
    }

    // Proceed to finish
    await page.screenshot({ path: `test-results/${user.username}-04-overview.png` });
    await page.click('[data-test="finish"]');
    await page.screenshot({ path: `test-results/${user.username}-05-complete.png` });

    // Validate confirmation
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });
}
