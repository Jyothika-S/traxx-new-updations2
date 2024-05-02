import { Locator, Page } from "@playwright/test";
import inspectionTestData from "../test-data/inspectionTestData.json"

// let inspId : string;
// let location: string;
const baseURL = process.env.BASEURL || "";
export class InspLocationPage {
    page: Page;
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
        // this.locName = page.locator('#maincontent > div > div > locationoverview > section.content > div:nth-child(2) > div > div > div > table > tbody > tr > td')
        this.locName = page.locator('td:text("Automation Test Location")');
        this.venue = page.locator('locationoverview')
        this.venueOption = page.locator('#maincontent > div > app-navigation > header > nav > div.header-bind.col-xs-12 > span:nth-child(2)')
        this.inspNowBtn = page.locator('div').filter({ hasText: /^Inspect Now$/ }).locator('i')
        this.inspectionIdElement = page.locator('#maincontent > div > div > inspection > div > section.content-header.element-header > div > div.col-lg-7.col-sm-12.col-md-6 > span:nth-child(1)')
        this.locationElement = page.locator('#maincontent > div > div > inspection > div > section.content-header.element-header > div > div.col-lg-7.col-sm-12.col-md-6 > span:nth-child(2)')
        this.inspLocTitle = page.locator('#maincontent > div > div > locationoverview > section.content-header > div > div > div.col-lg-4.col-md-6.col-sm-12.form-heading > span')
        this.tableHeader = page.locator('#maincontent > div > div > inspection > div > section.content.col-lg-12.col-md-12.col-sm-12 > div.row.ng-star-inserted > div > div > div > table > thead');
        this.addAttachment = page.locator('#maincontent > div > div > inspection > div > section.content.col-lg-12.col-md-12.col-sm-12 > div.row.ng-star-inserted > div > div > div > table > tbody:nth-child(2) > tr > td:nth-child(4) > button')
        this.confirmPopupTitle = page.locator('#followUpScreen > div > div > div.modal-header.text-center')
        this.confirmPopupContent = page.locator('#followUpScreen > div > div > div.modal-body')
        this.ratingAirPurifier = page.getByRole('button', { name: '4' })
        this.ratingMirror = page.locator('#mat-button-toggle-9-button');
        this.ratingClothes = page.locator('#mat-button-toggle-15-button')
        this.ratingToilet = page.locator('#mat-button-toggle-18-button')
        this.ratingConsumables = page.getByRole('button', { name: 'Complete', exact: true })
        this.commentBox = page.getByPlaceholder('Place inspection comments here')
        this.attachmentPopupBtn = page.getByRole('button', { name: '' }).first()
        this.attachmentBtn = page.getByRole('button', { name: '+ Add Attachments' })
        this.imgUpload = page.locator('input[name="file_1"]')
        this.attachmentComments = page.getByPlaceholder('Comments', { exact: true })
        this.attachmentSaveBtn = page.getByRole('button', { name: 'Save' })
        this.completeInspBtn = page.getByRole('button', { name: 'Complete Inspection' })
        this.completeInspYesBtn = page.getByRole('button', { name: 'Yes' })
        this.completeInspNoBtn = page.getByRole('button', { name: 'No' })
        this.colSelector = this.page.locator(`#maincontent > div > div > inspection > div > section.content.col-lg-12.col-md-12.col-sm-12 > div.row > div > div > div > table >`)
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
        //table elements column
        for (let i = 2; i <= 6; i++) {          
            const elementColumn = this.page.locator(`${this.colSelector}tbody:nth-child(${i}) > tr > td.verticalalign`);
            this.columnText = await elementColumn.innerText();
            this.columnTexts.push(this.columnText);
        }

        console.log("Column Texts:", this.columnTexts);

        //actions
        await this.ratingAirPurifier.click();
        await this.ratingMirror.click();
        await this.ratingClothes.click();
        await this.ratingToilet.click();
        await this.ratingConsumables.click();
        await this.commentBox.click();
        await this.commentBox.fill(inspectionTestData.fillValues.inspection_comment);

        //add attachment
        await this.attachmentPopupBtn.click();
        await this.attachmentBtn.click();
        await this.imgUpload.setInputFiles(inspectionTestData.fillValues.inspection_attachment_imgUpload);
        await this.attachmentComments.fill(inspectionTestData.fillValues.inspection_attachment_comment);
        await this.attachmentSaveBtn.click();
        this.attachmentCount = await this.addAttachment.innerText();
        //complete inspection part
        await this.completeInspBtn.click();
        this.confirmPopupTitleText = await this.confirmPopupTitle.innerText();
        this.confirmPopupContentText = await this.confirmPopupContent.innerText();
        await this.completeInspNoBtn.click();
        await this.page.waitForURL(inspectionTestData.urls.inspection_location);
    }

}

