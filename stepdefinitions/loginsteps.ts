import { createBdd } from "playwright-bdd";
import { test,expect}  from "../fixtures/fixture";
import { LoginPage } from "../pages/LoginPage";

const { Given, When, Then } = createBdd(test);

 Given('login page is launched',async ({page,testFixture})=>{
    console.log("Launched the application")
 })

 When('user enters invalid credentials', async ({ page, testFixture }) => {
    let loginPage = new LoginPage(page);
    await loginPage.enterUserName("invalid");
    await loginPage.enterPassword("invalid");
    await loginPage.clickOnLoginBtn();
 });

 Then('user should get error message', async ({ page, testFixture }) => {
    let loginPage = new LoginPage(page);
    await loginPage.validateErrorMsg();
 }); 



 

 