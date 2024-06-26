import { Locator, Page } from '@playwright/test';
import inspectionTestData from "../test-data/inspectionTestData.json"
import { ReusableMethods } from "../utils/reusable-methods"
import path from 'path';

export class LoginPage {
    page: Page;
    emailClick: Locator;
    username: Locator;
    pswdClick: Locator;
    password: Locator;
    signInBtn: Locator;
    currentURL: string;
    reusableMethods: any;

    constructor(page: Page) {
        this.page = page;
        this.emailClick = page.getByLabel('Email *')
        this.username = page.getByPlaceholder('Email ID')
        this.pswdClick = page.getByLabel('Password *')
        this.password = page.getByPlaceholder('Password');
        this.signInBtn = page.getByRole('button', { name: 'Sign In' })
        this.reusableMethods = new ReusableMethods();
    }

    async gotoLoginPage(){
        console.log("login url: ", inspectionTestData.urls.login)
        await this.page.goto(inspectionTestData.urls.login)
        
    };
        async login(username: string, password: string){
            await this.emailClick.click();
            await this.username.fill(username);
            await this.pswdClick.click();
            
            console.log("Capture Screenshot1")
            const screenshotPath = path.join('custom-report', 'screenshots', `screenshot_${Date.now()}.png`);          
            await this.password.fill(password);
            await this.reusableMethods.captureScreenshot(this.page, screenshotPath);
            await this.signInBtn.click();
            return screenshotPath;   
        }

    async verifyRedirection(){
        await this.page.waitForURL(inspectionTestData.urls.home);
        this.currentURL = this.page.url(); 
    }
    
}