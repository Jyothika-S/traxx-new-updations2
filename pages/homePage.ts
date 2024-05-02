import { Locator, Page } from "@playwright/test";

export class HomePage {
    page: Page;
    sidePanelToggle: Locator;
    menuSelector: Locator;

    constructor(page: Page) {
        this.page = page;
        this.sidePanelToggle = page.getByRole('button', { name: ' Toggle navigation' });
        this.menuSelector = page.locator('a')
    }
    async toggleSidePanel() {
        await this.sidePanelToggle.click();
    }

    async goToMenu(menuName: string) {
        const menuLocator = this.menuSelector.filter({ hasText: new RegExp('^' + menuName + '$', 'i') });
        await menuLocator.click();
    }

    async goToSubMenu(submenuName: string) {
        const submenuSelector = `//a[span[normalize-space(text()) = "${submenuName}"]]`;  
    
            const submenuLocator = await this.page.waitForSelector(submenuSelector, { timeout: 5000 });
            await submenuLocator.click();
    }
}
