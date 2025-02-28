import { Page, BrowserContext, expect } from '@playwright/test';
import { DASHBOARD_IDS } from '../../constants/test-ids';

interface FormElements {
    email: string,
    firstName: string,
    lastName: string,
    phoneNumber: string
}

interface InsightElements {
    visitCount: number,
    startCount: number,
    submissionCount: number,
}

class Dashboard {
    page: Page;
    context: BrowserContext;

    constructor({page, context}: {page:Page, context:BrowserContext}){
        this.page = page;
        this.context = context;
    }
    createFormAndVerify = async() => {
        await this.page.getByTestId(DASHBOARD_IDS.addFormButton).click();
        await this.page.getByTestId(DASHBOARD_IDS.startFromScratch).click();

        const addFullName = this.page.getByTestId(DASHBOARD_IDS.addFullName).getByText('Full name');
        await addFullName.scrollIntoViewIfNeeded();
        await addFullName.click();
        const fullName = this.page.getByTestId(DASHBOARD_IDS.deviceMode).getByText('Full name');
        await expect(fullName).toBeVisible();

        const addPhoneNumber = this.page.getByTestId(DASHBOARD_IDS.addPhoneNumber).getByText('Phone number');
        await addPhoneNumber.scrollIntoViewIfNeeded();
        await addPhoneNumber.click();
        const phoneNumber = this.page.getByTestId(DASHBOARD_IDS.deviceMode).getByText('Phone number');
        await expect(phoneNumber).toBeVisible();

        await this.page.getByTestId(DASHBOARD_IDS.publishButton).click();
        await this.page.getByTestId(DASHBOARD_IDS.previewPublish).click();
    };

    verifySubmission = async({
        email,
        firstName,
        lastName
    }: FormElements) => {
        const fullName = `${firstName} ${lastName}`
        await this.page
            .getByRole('link',{ name:'Submissions' })
            .click();
        await expect(this.page.getByRole('cell', { name: email })).toBeVisible();
        await expect(this.page.getByRole('cell', { name: fullName })).toBeVisible();
    };

    createOptionsForm = async() => {
        await this.page.getByTestId(DASHBOARD_IDS.addFormButton).click();
        await this.page.getByTestId(DASHBOARD_IDS.startFromScratch).click();

        const addSingleChoice = this.page
            .getByTestId(DASHBOARD_IDS.addSingleChoiceElement)
            .getByText('Single choice');
        await addSingleChoice.scrollIntoViewIfNeeded();
        await addSingleChoice.click();
        const singleChoice = this.page
            .getByTestId(DASHBOARD_IDS.deviceMode)
            .getByTestId(DASHBOARD_IDS.singleChoiceOptionsContainer);
        await expect(singleChoice).toBeVisible();

        const addMultiChoice = this.page
            .getByTestId(DASHBOARD_IDS.addMultiChoiceElement)
            .getByText('Multi choice');
        await addMultiChoice.scrollIntoViewIfNeeded();
        await addMultiChoice.click();
        const multiChoice = this.page
            .getByTestId(DASHBOARD_IDS.deviceMode)
            .getByTestId(DASHBOARD_IDS.multiChoiceOptionsContainer);
        await expect(multiChoice).toBeVisible();

        await this.page.getByTestId(DASHBOARD_IDS.singleChoiceOptionsContainer).click();
        await this.page.getByRole('textbox', { name:'Question' }).fill('Single - demo field name');
        await this.page.getByTestId(DASHBOARD_IDS.randomizeSwitch).click();
        await expect(this.page.getByTestId(DASHBOARD_IDS.randomizeWarning)).toBeVisible();
        await expect(this.page.getByTestId(DASHBOARD_IDS.spinner)).toBeVisible();
        await expect(this.page.getByTestId(DASHBOARD_IDS.spinner)).toBeHidden();

        await this.page.getByTestId(DASHBOARD_IDS.bulkOption).click();
        await this.page.getByTestId(DASHBOARD_IDS.bulkOptionTextArea)
            .fill('Option 5,Option 6,Option 7,Option 8,Option9,Option 10');
        await this.page.getByTestId(DASHBOARD_IDS.bulkOptionDoneBtn).click();

        await this.page.getByTestId(DASHBOARD_IDS.multiChoiceOptionsContainer).click();
        await this.page.getByRole('textbox', { name:'Question' }).fill('Multi - demo field name');
        await this.page.getByTestId(DASHBOARD_IDS.hideQuestionToggle).click();
        await expect(this.page.getByTestId(DASHBOARD_IDS.hideQuestionError)).toBeVisible();
        
        for(let i=0;i<6;i++){
            await this.page.getByTestId(DASHBOARD_IDS.addOption).click();
        }
        
        await expect(this.page.getByTestId(DASHBOARD_IDS.spinner)).toBeVisible();
        await expect(this.page.getByTestId(DASHBOARD_IDS.spinner)).toBeHidden();

        await this.page.getByTestId(DASHBOARD_IDS.publishButton).click();
        await this.page.getByTestId(DASHBOARD_IDS.previewPublish).click();
    };

    unhideQuestion = async()=>{
        await this.page.getByTestId(DASHBOARD_IDS.multiChoiceOptionsContainer).click();
        await this.page.getByTestId(DASHBOARD_IDS.hideQuestionToggle).click();

        await expect(this.page.getByTestId(DASHBOARD_IDS.spinner)).toBeVisible();
        await expect(this.page.getByTestId(DASHBOARD_IDS.spinner)).toBeHidden();

        await this.page.getByTestId(DASHBOARD_IDS.publishButton).click();
        await this.page.getByTestId(DASHBOARD_IDS.previewPublish).click();
    };

    createBasicForm = async()=>{
        await this.page.getByTestId(DASHBOARD_IDS.addFormButton).click();
        await this.page.getByTestId(DASHBOARD_IDS.startFromScratch).click();
        await this.page.getByTestId(DASHBOARD_IDS.publishButton).click();

        await this.page.getByTestId(DASHBOARD_IDS.moreDropdown).click();
        await this.page.getByTestId(DASHBOARD_IDS.analytics).click();
        await expect(this.page.getByTestId(DASHBOARD_IDS.insightsTitle)).toBeVisible();
    };

    viewInsights = async({
        visitCount,
        startCount,
        submissionCount
    }: InsightElements) => {
        let textContents = await this.page
            .getByTestId(DASHBOARD_IDS.visitsMetric)
            .getByTestId(DASHBOARD_IDS.insightsCount)
            .innerText();

        const visits = parseInt(textContents, 10)
        expect(visits).toBe(visitCount);

        textContents = await this.page
            .getByTestId(DASHBOARD_IDS.startsMetric)
            .getByTestId(DASHBOARD_IDS.insightsCount)
            .innerText()
            
        const starts = parseInt(textContents, 10)
        expect(starts).toBe(startCount);

        
        textContents = await this.page
            .getByTestId(DASHBOARD_IDS.submissionsMetric)
            .getByTestId(DASHBOARD_IDS.insightsCount)
            .innerText()
        const submissions = parseInt(textContents, 10)
        expect(submissions).toBe(submissionCount);

        this.page.getByTestId(DASHBOARD_IDS.previewPublish).click();
    }
}

export default Dashboard;