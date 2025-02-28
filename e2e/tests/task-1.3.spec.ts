import { test } from '../fixtures';
import { expect } from '@playwright/test'
import { DASHBOARD_IDS, TEARDOWN_IDS } from '../../constants/test-ids';

test.describe('Dashboard Page', () => {
  test.beforeEach(async({page})=>{
    await page.goto('/');
    await page.getByRole('button', { name: 'Login as Oliver' }).click();
    await page.getByTestId(DASHBOARD_IDS.addFormButton).click();
    await page.getByTestId(DASHBOARD_IDS.startFromScratch).click();
  });

  test.afterEach(async({page})=>{
    await page.getByTestId(TEARDOWN_IDS.dropdownIcon).click();
    await page.getByTestId(TEARDOWN_IDS.deleteButton).click();
    await page.getByTestId(TEARDOWN_IDS.confirmChechbox).click();
    await page.getByTestId(TEARDOWN_IDS.finalDelete).click();
    await expect(page.getByTestId(TEARDOWN_IDS.mainHeader)).toBeVisible();
  })

  test('should create a form and view insights', async ({ page, dashBoard, getFormPage }) => {
    await test.step('Step-1: Create a basic form and check the insights', async()=>{
      await dashBoard.createBasicForm();
      await dashBoard.viewInsights({ visitCount: 0, startCount: 0, submissionCount: 0 });
    });
    await test.step('Step-2: Visit the form and check the insights', async()=>{
      const formPage = await getFormPage();
      await formPage.pageLookup();
      await page.reload();
      await dashBoard.viewInsights({ visitCount: 1, startCount: 0, submissionCount: 0});
    })
    await test.step('Step-3: Start filling the form and check the insights', async()=>{
      const formPage = await getFormPage();
      await formPage.pageLookupAndStart();
      await page.reload();
      await dashBoard.viewInsights({ visitCount: 2, startCount: 1, submissionCount: 0});
    })
    await test.step('Step-4: Submit the form and check the insights', async()=>{
      const formPage = await getFormPage();
      await formPage.pageLookupAndSubmit();
      await page.reload();
      await dashBoard.viewInsights({ visitCount: 3, startCount: 1, submissionCount: 1});
      await page
            .getByRole('link',{ name:'Build' })
            .click();
    });
  });
});