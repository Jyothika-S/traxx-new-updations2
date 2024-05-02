import { Locator, Page } from '@playwright/test';
import inspectionTestData from "../test-data/inspectionTestData.json"


const baseURL = process.env.BASEURL || "";
export class LoginPage {
    page: Page;
    emailClick: Locator;
    username: Locator;
    pswdClick: Locator;
    password: Locator;
    signInBtn: Locator;
    currentURL: string;

    constructor(page: Page) {
        this.page = page;
        this.emailClick = page.getByLabel('Email *')
        this.username = page.getByPlaceholder('Email ID')
        this.pswdClick = page.getByLabel('Password *')
        this.password = page.getByPlaceholder('Password');
        this.signInBtn = page.getByRole('button', { name: 'Sign In' })
    }

    async gotoLoginPage(){
        await this.page.goto(inspectionTestData.urls.login, { timeout: 80000 })
        console.log("login url: ", inspectionTestData.urls.login)
    };
    async login(username: string, password: string){
        await this.emailClick.click();
        await this.username.fill(username);
        await this.pswdClick.click();
        await this.password.fill(password);
        await this.signInBtn.click();
    }

    async verifyRedirection(){
        await this.page.waitForURL(inspectionTestData.urls.home);
        this.currentURL = this.page.url(); 
    }
    
}