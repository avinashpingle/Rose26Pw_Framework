import { Locator, Page, expect } from "@playwright/test"
export class LoginPage {

    readonly page: Page //class level variables
    readonly usernametxtbx: Locator
    readonly passwordtxtbx: Locator
    readonly loginBtn: Locator
    readonly errorMsg: Locator

    constructor(page: Page) {
        this.page = page
        this.usernametxtbx = page.locator('input[name="username"]')
        this.passwordtxtbx = page.locator('input[name="password"]')
        this.loginBtn = page.locator("button[type='submit']")
        this.errorMsg = page.locator('p.oxd-alert-content-text')
    }

    async enterUserName(username: string) {
        await this.usernametxtbx.fill(username)
    }

    async clearUserName() {
        await this.usernametxtbx.clear()
    }

    async enterPassword(password: string) {
        await this.passwordtxtbx.fill(password)
    }
    async clickOnLoginBtn() {
        await this.loginBtn.click()
    }

    async validateErrorMsg() {
        await expect(this.errorMsg).toHaveText("Invalid credentials");
    }

}