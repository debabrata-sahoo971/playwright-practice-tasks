import { test } from '../fixtures'
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

  test('should create custom single and multi choice elements', async ({ dashBoard, getFormPage }) => {
    test.step('Step-1: Create Options Form', async()=>{
      await dashBoard.createOptionsForm();
    });
    let formPage = await getFormPage();
    test.step('Step-2: Check randomization of the options', async()=>{
      await formPage.checkOptionsForm();
    });
    test.step('Step-3: Unhide the multi-choice question', async()=>{
      await dashBoard.unhideQuestion();
    })
    formPage = await getFormPage();
    test.step('Step-4: Perform final check of the form', async()=>{
      await formPage.recheckOptionsForm();
    })
  });
})