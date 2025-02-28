import { Page, BrowserContext, expect } from '@playwright/test';
import { FORM_PAGE_IDS, DASHBOARD_IDS } from '../../constants/test-ids';
import { faker } from '@faker-js/faker'

interface FormElements{
    email: string,
    firstName: string,
    lastName: string,
    phoneNumber: string
}

class FormPage {
    page: Page;
    context: BrowserContext;

    constructor({page, context}: {page:Page, context:BrowserContext}){
        this.page = page;
        this.context = context;
    }
    
    checkFunctionality = async() => {
        await this.page.waitForLoadState("domcontentloaded");
        await expect(this.page.getByTestId('welcome-screen')).toBeVisible();
        
        const emailField = this.page.getByTestId(FORM_PAGE_IDS.email);
        await emailField.click();
        await emailField.evaluate((element: HTMLElement) => element.blur());
        
        const firstNameField = this.page.getByTestId(FORM_PAGE_IDS.firstName);
        await firstNameField.click();
        await firstNameField.evaluate((element: HTMLElement) => element.blur());
        
        const lastNameField = this.page.getByTestId(FORM_PAGE_IDS.lastName);
        await lastNameField.click();
        await lastNameField.evaluate((element: HTMLElement) => element.blur());
        
        const phoneNumberField = this.page.getByTestId(FORM_PAGE_IDS.phoneNumber);
        await phoneNumberField.click();
        await phoneNumberField.evaluate((element: HTMLElement) => element.blur());

        await expect(this.page.getByTestId(FORM_PAGE_IDS.formError).filter({ hasText: "Email address is required" })).toBeVisible();
        await expect(this.page.getByTestId(FORM_PAGE_IDS.formError).filter({ hasText: "First name is required" })).toBeVisible();
        await expect(this.page.getByTestId(FORM_PAGE_IDS.formError).filter({ hasText: "Last name is required" })).toBeVisible();
        await expect(this.page.getByTestId(FORM_PAGE_IDS.formError).filter({ hasText: "Phone number is invalid" })).toBeVisible();
    };

    fillForm = async ({
        email,
        firstName,
        lastName,
        phoneNumber
    }: FormElements) => {
        await this.page.getByTestId(FORM_PAGE_IDS.email).fill(firstName)
        await expect(this.page.getByTestId(FORM_PAGE_IDS.formError).filter({hasText:"Email address is invalid"})).toBeVisible();
        
        await this.page.getByTestId(FORM_PAGE_IDS.email).fill(email)
        await this.page.getByTestId(FORM_PAGE_IDS.firstName).fill(firstName)
        await this.page.getByTestId(FORM_PAGE_IDS.lastName).fill(lastName)
        
        const phoneNumberField = this.page.getByTestId(FORM_PAGE_IDS.phoneNumber);
        
        const validUSPhoneNumber = phoneNumber;
        const invalidUSPhoneNumber = `1${faker.string.numeric(9)}`;
        
        await phoneNumberField.fill(invalidUSPhoneNumber);
        await phoneNumberField.evaluate((element: HTMLElement) => element.blur());
        await expect(this.page.getByTestId(FORM_PAGE_IDS.formError)
            .filter({ hasText: "US numbers cannot start with a one."})
        ).toBeVisible();
        
        await phoneNumberField.fill(validUSPhoneNumber);
        await phoneNumberField.evaluate((element: HTMLElement) => element.blur());
        await expect(this.page.getByTestId(FORM_PAGE_IDS.formError)).toBeHidden();
        
        await this.page.getByTestId(FORM_PAGE_IDS.submitButton).click();
        await expect(this.page.getByTestId(FORM_PAGE_IDS.thankYou)).toBeVisible();
        await this.page.close();
    };

    checkOptionsForm = async ()=>{
        await this.page.waitForLoadState("domcontentloaded");
        await expect(this.page.getByTestId(FORM_PAGE_IDS.welcomeScreen)).toBeVisible();

        const randomOrder: string[] = await this.page
            .getByTestId(DASHBOARD_IDS.singleChoiceOptionsContainer)
            .allInnerTexts();
        const serialOrder: string[] = [
            'Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5',
            'Option 6', 'Option 7', 'Option 8', 'Option 9', 'Option 10'
        ]

        expect(randomOrder[0]).not.toBe(serialOrder.join(''));

        await this.page.close();
    };

    recheckOptionsForm = async() => {
        await this.page.waitForLoadState("domcontentloaded");
        await expect(this.page.getByTestId(FORM_PAGE_IDS.welcomeScreen)).toBeVisible();

        const multiOrder = this.page
            .getByTestId(DASHBOARD_IDS.multiChoiceOptionsContainer);
        await multiOrder.scrollIntoViewIfNeeded();
        const finalOrder: string[] = await multiOrder.allTextContents();

        const serialOrder: string[] = [
            'Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5',
            'Option 6', 'Option 7', 'Option 8', 'Option 9', 'Option 10'
        ]

        expect(finalOrder[0]).toBe(serialOrder.join(''));

        await this.page.close();
    };

    pageLookup = async()=>{
        await this.page.waitForLoadState("domcontentloaded");
        await expect(this.page.getByTestId(FORM_PAGE_IDS.welcomeScreen)).toBeVisible();

        await this.page.close();
    };

    pageLookupAndStart = async()=>{
        await this.page.waitForLoadState("domcontentloaded");
        await expect(this.page.getByTestId('welcome-screen')).toBeVisible();

        await this.page.getByTestId(FORM_PAGE_IDS.email).fill('Oliver');
        await this.page.close();
    };

    pageLookupAndSubmit = async()=>{
        await this.page.waitForLoadState("domcontentloaded");
        await expect(this.page.getByTestId(FORM_PAGE_IDS.welcomeScreen)).toBeVisible();

        await this.page.getByTestId(FORM_PAGE_IDS.email).fill('oliver@example.com');
        await this.page.getByTestId(FORM_PAGE_IDS.submitButton).click()
        await this.page.close();
    }
    
}

export default FormPage;