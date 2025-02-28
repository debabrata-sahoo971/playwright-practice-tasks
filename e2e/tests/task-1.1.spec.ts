import { test } from '../fixtures'
import { faker } from '@faker-js/faker';

test.describe('Dashboard Page', () => {
  let email: string;
  let firstName: string;
  let lastName: string;
  let phoneNumber: string;

  test.beforeEach(async({page})=>{
    email = faker.internet.email();
    firstName = faker.person.firstName();
    lastName = faker.person.lastName();
    phoneNumber = '4088461112';

    await page.goto('/');
    await page.getByRole('button', { name: 'Login as Oliver' }).click();
  })

  test('should be able to create a form with required attributes and checks', async ({ dashBoard, getFormPage }) => {
    await test.step('Step-1: Create Form and Verify', async()=> {
      await dashBoard.createFormAndVerify();
    });
    await test.step('Step-2: Form Page', async()=>{
      const formPage = await getFormPage();
      await test.step('Step-2.1: Get form and check functionality', async()=>{
        await formPage.checkFunctionality();
      });
      await test.step('Step-2.2: Fill the form', async()=>{
        await formPage.fillForm({ email, firstName, lastName, phoneNumber });
      });
    });
    await test.step('Step-3: Verify Submission', async()=>{
      await dashBoard.verifySubmission({ email, firstName, lastName, phoneNumber });
    });
  });
})