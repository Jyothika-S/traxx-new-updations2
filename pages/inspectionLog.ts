import { Locator, Page } from "@playwright/test";
import inspectionTestData from "../test-data/inspectionTestData.json"

const baseURL = process.env.BASEURL || "";
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
        this.logRow = page.locator('#maincontent > div > div > inspectionlog > section.content.col-lg-12.col-md-12.col-sm-12 > div.row > div > div > div > table > tbody:nth-child(2) > tr');
        this.inspId = page.locator('#maincontent > div > div > inspectionlog > section.content.col-lg-12.col-md-12.col-sm-12 > div.row.ng-star-inserted > form > div > div:nth-child(1) > div:nth-child(1) > div > div > p');
        this.InspLoc = page.locator('#maincontent > div > div > inspectionlog > section.content.col-lg-12.col-md-12.col-sm-12 > div.row.ng-star-inserted > form > div > div:nth-child(2) > div:nth-child(2) > div > div > p')
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
        // await this.page.waitForURL(baseURL + inspectionTestData.urls.inspection_log);
        // this.currentURL = this.page.url();

        this.inspIdText = await this.inspId.innerText();
        this.inspLocText = await this.InspLoc.innerText();
        this.cancelBtn.click();
    }
}
