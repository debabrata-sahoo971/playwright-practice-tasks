import { test } from '../fixtures'

test.describe('Dashboard Page', () => {

  test.beforeEach(async({page})=>{
    await page.goto('/');
    await page.getByRole('button', { name: 'Login as Oliver' }).click();
  });

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