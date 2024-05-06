import { Locator, Page } from "@playwright/test";
import inspectionTestData from "../test-data/inspectionTestData.json"
import { ReusableMethods } from "../utils/reusable-methods";

export class InspStatisticsPage {
    page: Page;
    currentURL: string;
    selectedTab: Locator;
    startDate:  Locator;
    startDateInput: Locator;
    startDateBtn: Locator;
    completedInspTableTitle: Locator;
    completedInspTableTitleText: string;
    graphElements: string[] = [];
    elementText: string;
    applyBtn: Locator;
    elementSelector: Locator;
    tblInspId: Locator;
    tblInspIdText: string;
    elementColumn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.startDateInput = page.locator('#startDate')
        this.startDateBtn = page.locator('button[aria-label="Open calendar"][tabindex="0"]').nth(2);
        this.completedInspTableTitle = page.getByRole('heading', { name: 'Completed Inspections' }).nth(1);
        this.applyBtn = page.getByRole('button', { name: 'Apply' }).nth(1)
        this.elementSelector = page.locator('#elementsInspected > div > div > svg:nth-child(1) > g.cartesianlayer > g > g.xaxislayer-above > ')
        this.tblInspId = page.locator('#firstScrollTop > table > tbody:nth-child(2) > tr > td:nth-child(1)')
    }

    async gotoInspStatisticsPage() {
        await this.page.waitForURL(inspectionTestData.urls.inspection_statistics);
        this.currentURL = this.page.url();
    }

    async statisticsTabSelection(tab: string){
        this.selectedTab = this.page.getByRole('button', { name: `${tab}` })
        this.selectedTab.click();
    }

    async verifyCompltedTable() {
        this.completedInspTableTitleText = await this.completedInspTableTitle.innerHTML();
        console.log('completedInspTableTitleText: ',this.completedInspTableTitleText)
        // this.tblInspIdText = await this.tblInspId.innerHTML();
        // console.log('tblInspIdText: ',this.tblInspId)
    }

    async verifyElementsGraph() {

        for (let i = 1; i <= 5; i++) {
            // const elementSelector = `#elementsInspected > div > div > svg:nth-child(1) > g.cartesianlayer > g > g.xaxislayer-above > g:nth-child(${i}) > text`;
            this.elementColumn = await this.page.locator(`${this.elementSelector}g:nth-child(${i}) > text`);
            //extracts text from an SVG 
            const extractText = await this.elementColumn.evaluateHandle((element) => element.textContent);
            this.elementText = await extractText.jsonValue() as string;
            this.graphElements.push(this.elementText);
        }
    
        console.log("Elements in element graph: ", this.graphElements);
    }

    //custom day
    async selectCurrentDate(customDay: number) {
        const reusableMethods = new ReusableMethods();
        const currentDate = await reusableMethods.getCurrentFormattedDate();
        const { month, year } = currentDate;
        console.log('month consoled from pom: ', month);
        console.log('year consoled from pom: ', year);
        console.log('custom day chosen: ', customDay);
        await this.startDateBtn.click();
        //custom day
        const cstmDay = `${month} ${customDay}, ${year}`;
        await this.page.getByLabel(cstmDay).click();
    }

    async applyDate() {
        await this.applyBtn.click();
    }
    
}
