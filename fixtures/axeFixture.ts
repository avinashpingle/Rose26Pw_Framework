import { test as base } from 'playwright-bdd';
import { expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

type AxeFixture = {
    makeAxeBuilder: () => AxeBuilder;
    axeBuilder: AxeBuilder;
};

export const test = base.extend<AxeFixture>({
    makeAxeBuilder: async ({ page }, use) => {
        const makeAxeBuilder = () => new AxeBuilder({ page });
        await use(makeAxeBuilder);
    },
    axeBuilder: async ({ page }, use) => {
        const axeBuilder = new AxeBuilder({ page });
        await use(axeBuilder);
    }
});

export { expect };
