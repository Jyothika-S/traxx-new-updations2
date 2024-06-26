import { expect, test } from '@playwright/test';
// import { test } from './customTest'
import { LoginPage } from '../pages/loginPage';
import { InspLocationPage } from '../pages/inspectionLocation';
import { HomePage } from '../pages/homePage';
import { InspLogPage } from '../pages/inspectionLog'
import inspectionTestData from '../test-data/inspectionTestData.json'
import { InspOverviewPage } from '../pages/inspectionOverview';
import { InspStatisticsPage } from '../pages/inspectionStatistics';

let inspId : string;
let location: string;
let venue: string;
let elements: string[] = [];
let attachmentCount: string;

const username = process.env.USER_NAME || "";
const password = process.env.PASSWORD || "";
// console.log('username: ' + username)
// console.log('password: ' + password)


// test('Login to application', async ({page}) => {
//     const login = new LoginPage(page);
//     const homePage = new HomePage(page);
//     //login to application
//         // await login.gotoLoginPage()
//         // await login.login(username, password)
//         // await login.verifyRedirection()
//         // await page.context().storageState({path: "loginAuth.json"})
// })

// test('Inspection Workflow: Login, Create, Verify Details', async ({browser, page}) => {
    // const context = await browser.newContext({storageState: "loginAuth.json"})
test('Inspection Workflow: Login, Create, Verify Details', async ({browser, page}, testInfo) => {
    const login = new LoginPage(page);
    const homePage = new HomePage(page);
    const inspLocation = new InspLocationPage(page);
    const inspLogPage = new InspLogPage(page);
    const inspOverviewPage = new InspOverviewPage(page);
    const inspStatisticsPage = new InspStatisticsPage(page);

    await test.step('Login to application', async () => {
        await login.gotoLoginPage()
        await login.login(username, password)
        await login.verifyRedirection()
        testInfo.annotations.push({ type: 'credentials', description: `Username: ${username}, Password: ${password}` });
        console.log(' testInfo.annotations', testInfo.annotations);
        // const data2 = test.info().annotations.push({ type: 'credentials', description: `Username: ${username}, Password: ${password}` });
        // console.log('testInfo data2##',test.info().annotations);

        const screenshot = await page.screenshot();
        await testInfo.attach('login screenshot', { 
            body: screenshot, 
            contentType: 'image/png', 
            // path: '../custom-report/screenshots' 
        });
    })

    //Inspection location page verification
    await test.step('Verify inspection location page', async () => {
        await homePage.toggleSidePanel();
        await homePage.goToMenu('Inspections')
        await homePage.goToSubMenu('Inspection Locations')
        await inspLocation.verifyInspLocPage();
        expect.soft(inspLocation.inspectionLocationsText).toContain(inspectionTestData.expectedData.inspection_location_title)
        expect.soft(inspLocation.inspectionLocationsText).not.toBeNull();
        expect.soft(inspLocation.venue).toContainText(inspectionTestData.expectedData.inspection_location_venueLabel);
        venue = inspLocation.venueName;
        console.log("venue from spec: ",venue);
        // const screenshot = await page.screenshot();
        // await testInfo.attach('insp_location_screenshot', { 
        //     body: screenshot, 
        //     contentType: 'image/png', 
        //     // path: '../custom-report/screenshots' 
        // });
    })

    //creates new inspection
    await test.step('Create new inspection', async () => {
        await inspLocation.inspPage();
        attachmentCount = inspLocation.attachmentCount;
        //assertions
        expect.soft(inspLocation.inspIdText).toContain(inspectionTestData.expectedData.inspection_Id_label);
        expect.soft(inspLocation.locationText).toContain(inspectionTestData.expectedData.inspection_location_label);
        expect.soft(inspLocation.tableHeaderText).toContain(inspectionTestData.expectedData.inspection_tableHeaderText);
        expect.soft(inspLocation.attachmentCount).toContain(attachmentCount);
        expect.soft(inspLocation.confirmPopupTitleText).toContain(inspectionTestData.expectedData.inspection_confirmPopup_title)
        expect.soft(inspLocation.confirmPopupContentText).toContain(inspectionTestData.expectedData.inspection_confirmPopup_content)
        expect.soft(inspLocation.completeInspYesBtn.isVisible()).toBeTruthy();
        expect.soft(inspLocation.completeInspNoBtn.isVisible()).toBeTruthy();

        inspId = inspLocation.inspectionId;
        location = inspLocation.location;
        elements = inspLocation.columnTexts;
        console.log('attachmentCount from global: ',attachmentCount)
        console.log('elements from global: ',elements)
    })

    //Check if the completed inspection is found in Inspection Log
    await test.step('Check if the completed inspection is found in Inspection Log', async () => {
        await homePage.goToSubMenu('Inspection Logs')

        console.log("id from global: ", inspId)
        console.log("loc from global", location)
        await inspLogPage.gotoInspLogPage();
        await inspLogPage.getLogRowContent();

        // Verify if log contains ID and its status - "Complete"
        expect.soft(inspLogPage.logRowText).toContain(inspId);
        expect.soft(inspLogPage.logRowText).toContain(inspectionTestData.expectedData.inspection_logStatus_complete);
    })

    //verify the edit of the created inspection
    await test.step('Verifying if the details are present on the inspection\'s edit page', async() => {
        await inspLogPage.verifyEditDetails();
        expect.soft(inspLogPage.inspIdText).toContain(inspId);
        expect.soft(inspLogPage.inspLocText).toContain(location);
    })

    //check if currently completed inspection is found in Inspection Overview
    await test.step('Verifying if the details are present on the inspection\'s overview page', async() => {
        await homePage.goToMenu('Inspection Overview')
        await inspOverviewPage.gotoInspOverviewPage();
        console.log("venue printed from overview: ", venue)
        await inspOverviewPage.selectVenue(venue)
        await inspOverviewPage.verifyFilteredInspection(venue, inspId)
        expect.soft(inspOverviewPage.inspIdText).toContain(inspId)
    })

    //verify inspection tab in statistics
    // await test.step('Verifying the details in the statistics page', async() => {
    //     await homePage.goToMenu('Statistics')
    //     await inspStatisticsPage.gotoInspStatisticsPage();
    //     await inspStatisticsPage.statisticsTabSelection('Inspection')
        
    //     await inspStatisticsPage.verifyCompltedTable();
    //     expect.soft(inspStatisticsPage.completedInspTableTitleText).toBe(inspectionTestData.expectedData.statistics_completedInspTable_title)

    //     //date selection
    //     await inspStatisticsPage.selectCurrentDate(2);
    //     await inspStatisticsPage.applyDate();
        
    //     //elements graph
    //     await inspStatisticsPage.verifyElementsGraph();
    //     expect.soft(inspStatisticsPage.graphElements).toEqual(elements)
        

    // })
})


