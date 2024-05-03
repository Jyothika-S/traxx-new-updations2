import { test, Browser, Page, chromium, expect } from "@playwright/test";
import { LoginPage } from "./pages/loginPage";
import { HomePage } from "./pages/homePage";
import inspectionTestData from './test-data/inspectionTestData.json'

const baseURL = process.env.BASEURL || "";
const username = process.env.USER_NAME || "";
const password = process.env.PASSWORD || "";
console.log('username: ' + username)
console.log('password: ' + password)

// export default async function globalSetup() {
//     const browser: Browser = await chromium.launch();
//     const context = await browser.newContext();
//     const page: Page = await context.newPage();

//         await page.goto("https://app.qa.traxinsights.app/#/login")
//         await page.getByLabel('Email *').click();
//         await page.getByPlaceholder('Email ID').fill(username);
//         await page.getByLabel('Password *').click();
//         await page.getByPlaceholder('Password').fill(password);
//         await page.getByRole('button', { name: 'Sign In' }).click();
//         await page.waitForURL("https://app.qa.traxinsights.app/#/dashboard");
//         await expect(page.locator('dashboard-component')).toContainText('Calendar');

//         //save state
//         await page.context().storageState({path: "./loginAuth.json"});
  
// }

test('login', async ({page}) => {
    const login = new LoginPage(page);
    const homePage = new HomePage(page);
    
        await login.gotoLoginPage()
        await login.login(username, password)
        await login.verifyRedirection()
        //save state
        await page.context().storageState({path: "./loginAuth.json"});
        // await page.close();
})
