import { Locator, Page } from "@playwright/test";
import inspectionTestData from "../test-data/inspectionTestData.json"

export class InspLogPage {
    page: Page;
    currentURL: string;
    logRow: Locator;
    logRowText: string;
    inspIdText: string;
    inspId: Locator;
    inspLocText: string;
    InspLoc: Locator;
    cancelBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.logRow = page.locator('//*[@id="maincontent"]/div/div/inspectionlog/section[2]/div[1]/div/div/div/table/tbody[1]/tr');
        this.inspId = page.locator('//*[@id="maincontent"]/div/div/inspectionlog/section[2]/div[1]/form/div/div[1]/div[1]/div/div/p');
        this.InspLoc = page.locator('//*[@id="maincontent"]/div/div/inspectionlog/section[2]/div[1]/form/div/div[2]/div[2]/div/div/p')
        this.cancelBtn = page.getByRole('button', { name: 'Cancel' })
    }

    async gotoInspLogPage() {
        await this.page.waitForURL(inspectionTestData.urls.inspection_log);
        this.currentURL = this.page.url();
    }

    async getLogRowContent() {
        this.logRowText = await this.logRow.innerText();
        console.log('this.logRowText: ', this.logRowText);
    }

    async verifyEditDetails() {
        await this.logRow.click();
        this.inspIdText = await this.inspId.innerText();
        this.inspLocText = await this.InspLoc.innerText();
        this.cancelBtn.click();
    }
}
