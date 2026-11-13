import { test, expect } from '../fixtures/fixture'
import { LoginPage } from "../pages/LoginPage";

/**
 * This test case validates error message on orange hrm demo login page when
 * we enter wrong username and password. It uses Playwright's test runner to navigate to the login page, fill in the credentials, and click the submit button.
 */
test('a test case without framework', async ({ page, testFixture }) => {
    await page.locator("input[name='username']").fill("wrong_username");
    await page.locator("input[name='password']").fill("wrong_password");
    await page.locator("button[type='submit']").click();
    expect(await page.locator("p.oxd-alert-content-text").textContent()).toBe("Invalid credentials");
});

test('a test case with framework', async ({ page, testFixture }) => {
    const loginPage = new LoginPage(page);
    await loginPage.enterUserName("kuchh bhi")
    await loginPage.enterPassword("2323")
    await loginPage.clickOnLoginBtn()
    await loginPage.validateErrorMsg()
})

test('second test case', async ({ page }) => {
    await page.goto('https://www.myntra.com')
})