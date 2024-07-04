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
    receivedId: string;
    inspectionsTable: string

    constructor(page: Page) {
        this.page = page;
        this.logRow = page.locator('//*[@id="maincontent"]/div/div/inspectionlog/section[2]/div[1]/div/div/div/table/tbody[1]/tr');
        this.inspId = page.locator('//*[@id="maincontent"]/div/div/inspectionlog/section[2]/div[1]/form/div/div[1]/div[1]/div/div/p');
        this.InspLoc = page.locator('//*[@id="maincontent"]/div/div/inspectionlog/section[2]/div[1]/form/div/div[2]/div[2]/div/div/p')
        this.cancelBtn = page.getByRole('button', { name: 'Cancel' })
        this.inspectionsTable = 'table'
    }

    async gotoInspLogPage() {
        await this.page.waitForURL(inspectionTestData.urls.inspection_log);
        this.currentURL = this.page.url();
    }

    async getLogRowContent() {
        this.logRowText = await this.logRow.innerText();
        this.receivedId = this.logRowText.split('\t')[0];
        console.log('this.logRowText: ', this.logRowText);
    }

    //get status
    async getInspectionStatusandOpenLog(inspectionID: string | null | undefined) {
        await this.page.waitForSelector(this.inspectionsTable)
        const inspectionRows = await this.page.$$('table.table tbody tr')
        console.log('Number of inspection logs found:', inspectionRows.length);
        for (const row of inspectionRows) {
            const idColumn = await row.$('td:nth-child(1)'); // Locating the 1st column in the table which contains Inspection ID
            const statusColumn = await row.$('td:nth-child(7)'); // Locating the 7th column in the table which contains Inspection Status
            if (await idColumn?.textContent() == inspectionID) {
                const inspStatus = await statusColumn?.textContent()
                await idColumn?.click() //Clicks on the 1st column to open the detailed inspection log
                return inspStatus
            }
        }
    }

    async verifyEditDetails() {
        // error occured while running so commented
        // await this.logRow.click();
        this.inspIdText = await this.inspId.innerText();
        this.inspLocText = await this.InspLoc.innerText();
        // this.cancelBtn.scrollIntoViewIfNeeded();
        // this.cancelBtn.click();
    }
}
