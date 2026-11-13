
import { test, expect } from '../fixtures/fixture'
import { LoginModule } from '../modules/loginmodule';
import { PIMMenuPage } from '../pages/PIMMenupage';

test('Verify employee record once it is created', async ({ page, testFixture }) => {
    let loginModule = new LoginModule(page)
    await loginModule.loginUsingValidCredentials()
    let pimMenuPage = new PIMMenuPage(page);
    await pimMenuPage.clickAddBtn()
    await pimMenuPage.enterFirstName("Avinash")
    await pimMenuPage.enterLastName("Pingale")
    await pimMenuPage.clickOnSaveBtn()
});