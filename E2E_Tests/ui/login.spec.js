


const { test, expect } = require('@playwright/test');
const users = require('../utils/testDataManager');



users.forEach(({ username, password }) => {
  test(`UI Workflow - Login and Cart Actions for ${username}`, async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    // Login
    await page.fill('#user-name', username);
    await page.fill('#password', password);
    await page.click('#login-button');

    // Check if login succeeded or failed
    if (await page.locator('.error-message-container').isVisible()) {
      const errorText = await page.locator('[data-test="error"]').innerText();
      console.log(`${username} login failed with error: ${errorText}`);
      await page.screenshot({ path: `test-results/${username}_login_failed.png`, fullPage: true });
      return;
    }

    await expect(page).toHaveURL(/.*inventory/);
    await page.screenshot({ path: `test-results/${username}_inventory.png`, fullPage: true });

    // Add to cart
    const firstAddButton = page.locator('.inventory_item button', { hasText: 'Add to cart' }).first();
    await firstAddButton.click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    await page.screenshot({ path: `test-results/${username}_added_to_cart.png`, fullPage: true });

    // Go to cart and remove
    await page.click('.shopping_cart_link');
    await expect(page.locator('.cart_item')).toBeVisible();
    await page.click('button', { hasText: 'Remove' });
    await page.screenshot({ path: `test-results/${username}_removed_from_cart.png`, fullPage: true });

    // Logout
    await page.goto('https://www.saucedemo.com/inventory.html');
    await page.click('#react-burger-menu-btn');
    await page.click('#logout_sidebar_link');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await page.screenshot({ path: `test-results/${username}_logged_out.png`, fullPage: true });
  });
});
