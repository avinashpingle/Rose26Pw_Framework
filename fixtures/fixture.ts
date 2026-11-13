import { test as base } from 'playwright-bdd'
import { expect } from '@playwright/test'
import logger from '../utils/logger'
import { level } from 'winston'

type TestFixture = {
    testFixture: void
}

export const test = base.extend<TestFixture>({
    testFixture: async ({ page }, use) => {
        await page.goto('/') //Read baseUrl from playwright.config.ts 

        await use(); //Test case execution

        logger.info("Logged out of the application")
    }
})

export { expect }