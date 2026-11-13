import { Page } from "playwright";

import { LoginPage } from "../pages/LoginPage";
import logger from "../utils/logger";
export class LoginModule {
    page: Page

    constructor(page: Page) {
        this.page = page;
    }

    async loginUsingValidCredentials() {
        let loginPage = new LoginPage(this.page)
        let username = process.env.username
        let password = process.env.password
        if (username) {
            loginPage.enterUserName(username)
        } else {
            logger.debug("Logging in using default admin username and password")
            await loginPage.enterUserName('admin')
        }
        if (password)
            await loginPage.enterPassword(password)
        else {
            await loginPage.enterUserName('admin123')
        }

        await loginPage.clickOnLoginBtn()
    }

    loginUsingInvalidCredentials() {

    }
}

//logger.info()
//logger.debug()
//logger.error()
//logger.http()
//logger.verbos()