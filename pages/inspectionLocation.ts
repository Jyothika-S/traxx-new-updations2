import { Locator, Page } from "@playwright/test";
import inspectionTestData from "../test-data/inspectionTestData.json"
import { ReusableMethods } from "../utils/reusable-methods"
import path from "path";

export class InspLocationPage {
    page: Page;
    reusableMethods: any;
    locName: Locator;
    inspNowBtn: Locator;
    inspectionIdElement: Locator;
    locationElement: Locator;
    inspLocTitle: Locator;
    venue: Locator;
    venueOption: Locator;
    venueText: string;
    venueName: string;
    inspIdText: string;
    locationText: string;
    tableHeader: Locator;
    tableHeaderText: string;
    addAttachment: Locator;
    attachmentCount: string;
    confirmPopupTitle: Locator;
    confirmPopupTitleText: string;
    confirmPopupContent: Locator;
    confirmPopupContentText: string;
    confirmPopupbtnText: string;
    inspectionId: string;
    location: string;
    commentBox: Locator;
    ratingAirPurifier: Locator;
    ratingMirror: Locator;
    ratingClothes: Locator;
    ratingToilet: Locator;
    ratingConsumables: Locator;
    attachmentPopupBtn: Locator;
    attachmentBtn: Locator;
    imgUpload: Locator;
    attachmentComments: Locator;
    attachmentSaveBtn: Locator;
    completeInspBtn: Locator;
    completeInspYesBtn: Locator;
    completeInspNoBtn: Locator;
    inspectionLocationsText: string;
    currentURL: string;
    columnTexts: string[] = [];
    elementColumn: Locator;
    columnText: string;
    colSelector: Locator;


    constructor(page: Page) {
        this.page = page;
        this.reusableMethods = new ReusableMethods();
        this.locName = page.locator('td:text("Automation Test Location")');
        this.venue = page.locator('locationoverview')
        this.inspLocTitle = page.locator('//*[@id="maincontent"]/div/div/locationoverview/section[1]/div/div/div[1]/span')
        this.venueOption = page.locator('//*[@id="maincontent"]/div/app-navigation/header/nav/div[1]/span[2]')
        this.inspNowBtn = page.locator('div').filter({ hasText: /^Inspect Now$/ }).locator('i')
        this.inspectionIdElement = page.locator('//*[@id="maincontent"]/div/div/inspection/div/section[1]/div/div[1]/span[1]')
        this.locationElement = page.locator('//*[@id="maincontent"]/div/div/inspection/div/section[1]/div/div[1]/span[2]')
        this.tableHeader = page.locator('//*[@id="maincontent"]/div/div/inspection/div/section[2]/div[1]/div/div/div/table/thead');
        this.addAttachment = page.locator('//*[@id="maincontent"]/div/div/inspection/div/section[2]/div[1]/div/div/div/table/tbody[1]/tr/td[4]/button')
        this.confirmPopupTitle = page.locator('//*[@id="followUpScreen"]/div/div/div[1]')
        this.confirmPopupContent = page.locator('#followUpScreen > div > div > div.modal-body')
        this.commentBox = page.getByPlaceholder('Place inspection comments here')
        this.attachmentPopupBtn = page.getByRole('button', { name: '' }).first()
        this.attachmentBtn = page.getByRole('button', { name: '+ Add Attachments' })
        this.imgUpload = page.locator('input[name="file_1"]')
        this.attachmentComments = page.getByPlaceholder('Comments', { exact: true })
        this.attachmentSaveBtn = page.getByRole('button', { name: 'Save' })
        this.completeInspBtn = page.getByRole('button', { name: 'Complete Inspection' })
        this.completeInspYesBtn = page.getByRole('button', { name: 'Yes' })
        this.completeInspNoBtn = page.getByRole('button', { name: 'No' })
        // this.colSelector = this.page.locator(`#maincontent > div > div > inspection > div > section.content.col-lg-12.col-md-12.col-sm-12 > div.row > div > div > div > table >`)
        this.colSelector = this.page.locator('section.content div > table');
    }

    async verifyInspLocPage(){
        await this.page.waitForURL(inspectionTestData.urls.inspection_location);
        this.currentURL = this.page.url();
        this.inspectionLocationsText = await this.inspLocTitle.innerText();
        this.venueText = (await this.venueOption.innerText());
        this.venueName = this.venueText.split('\n')[1];
        console.log('venueText: ',this.venueText)
        console.log('venueName: ',this.venueName)
    }

    async inspPage() {
        await this.locName.click();
        await this.inspNowBtn.click();
        await this.page.waitForURL(inspectionTestData.urls.inspection);
        
        // Extracting Inspection Number
        this.inspIdText = await this.inspectionIdElement.innerText();
        this.inspectionId = this.inspIdText.split(': ')[1];
 

        // Extracting Location
        this.locationText = await this.locationElement.innerText();
        this.location = this.locationText.split(': ')[1];

        console.log("ispID: ", this.inspectionId)
        console.log("loc: ", this.location)

        this.tableHeaderText = await this.tableHeader.innerText();
        console.log("tableHeader: ", this.tableHeaderText);
        // table element name column
        for (let i = 2; i <= 5; i++) {       
            // const elementColumn = this.page.locator(`${this.colSelector}tbody:nth-child(${i}) > tr > td.verticalalign`); 
            const elementColumn = this.colSelector.locator(`tbody:nth-child(${i}) > tr > td.verticalalign`);
            this.columnText = await elementColumn.innerText();
            this.columnTexts.push(this.columnText);
            console.log('this.columnText',this.columnText)
        }       
        console.log("Element Column Texts:", this.columnTexts);

        //loop table
        const tableRows = await this.page.$$('table.table tbody tr');

        for (const row of tableRows) {
        const buttons = await row.$$('td:nth-child(3) button'); 
        const randomButton = Math.floor(Math.random() * buttons.length);
        await buttons[randomButton].click();
        }
        await this.commentBox.click();
        await this.commentBox.fill(inspectionTestData.fillValues.inspection_comment);

        //add attachment
        await this.attachmentPopupBtn.click();
        await this.attachmentBtn.click();
        await this.imgUpload.setInputFiles(inspectionTestData.images.inspection_attachment_imgUpload);
        await this.attachmentComments.fill(inspectionTestData.fillValues.inspection_attachment_comment);
        console.log("Capture Screenshot1")
        const screenshotPath = path.join('custom-report', 'screenshots', `screenshot_${Date.now()}.png`);
        await this.reusableMethods.captureScreenshot(this.page, screenshotPath);
        await this.attachmentSaveBtn.click();   
        this.attachmentCount = await this.addAttachment.innerText();
        //complete inspection part
        await this.completeInspBtn.scrollIntoViewIfNeeded();
        await this.completeInspBtn.click();
        // this.confirmPopupTitleText = await this.confirmPopupTitle.innerText();
        // this.confirmPopupContentText = await this.confirmPopupContent.innerText();
        // await this.completeInspNoBtn.click();
        
         // Check if the confirmation popup is present
         if (await this.confirmPopupTitle.isVisible()) {
            this.confirmPopupTitleText = await this.confirmPopupTitle.innerText();
            this.confirmPopupContentText = await this.confirmPopupContent.innerText();
            await this.completeInspNoBtn.click();
        }
        await this.page.waitForURL(inspectionTestData.urls.inspection_location);
        return screenshotPath;
    }

}

