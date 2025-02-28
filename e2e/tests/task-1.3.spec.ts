import { test } from '../fixtures'

test.describe('Dashboard Page', () => {

  test.beforeEach(async({page})=>{
    await page.goto('/');
    await page.getByRole('button', { name: 'Login as Oliver' }).click();
  });

  test('should create a form and view insights', async ({ page, dashBoard, getFormPage }) => {
    await dashBoard.createBasicForm();
    await dashBoard.viewInsights({ visitCount: 0, startCount: 0, submissionCount: 0 });
    let formPage = await getFormPage();
    await formPage.pageLookup();
    await page.reload();
    await dashBoard.viewInsights({ visitCount: 1, startCount: 0, submissionCount: 0});
    formPage = await getFormPage();
    await formPage.pageLookupAndStart();
    await page.reload();
    await dashBoard.viewInsights({ visitCount: 2, startCount: 1, submissionCount: 0});
    formPage = await getFormPage();
    await formPage.pageLookupAndSubmit();
    await page.reload();
    await dashBoard.viewInsights({ visitCount: 3, startCount: 1, submissionCount: 1});
  });
});