import { test as base, Page, BrowserContext } from '@playwright/test';
import Dashboard from '../poms/dashboard';
import FormPage from '../poms/form-page';

interface ExtendedFixtures {
  dashBoard: Dashboard;
  getFormPage: () => Promise<FormPage>;
}

export const test = base.extend<ExtendedFixtures>({
  dashBoard: async ({ page, context }, use) => {
    const dashBoard = new Dashboard({ page, context });
    await use(dashBoard);
  },
  getFormPage: async ({ context }, use) => {
    await use(async () => {
      const newPage = await context.waitForEvent("page");
      return new FormPage({ page: newPage, context });
    });
  },
});