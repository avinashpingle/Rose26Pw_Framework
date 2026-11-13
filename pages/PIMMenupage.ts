import { Page, Locator } from '@playwright/test';

export class PIMMenuPage {

    readonly page: Page
    readonly url = 'https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewEmployeeList'

    // Left side menu
    pimMenu: Locator

    // Top tabs inside PIM
    configurationTab: Locator
    employeeListTab: Locator
    addEmployeeTab: Locator
    reportsTab: Locator

    // Employee List page
    addBtn: Locator
    employeeNameInput: Locator
    employeeIdInput: Locator
    searchBtn: Locator
    resetBtn: Locator
    recordsFoundText: Locator
    tableRows: Locator
    firstName: Locator
    middleName: Locator
    lastName: Locator
    saveBtn: Locator


    constructor(page: Page) {
        this.page = page

        this.pimMenu = page.getByRole('link', { name: 'PIM' })

        this.configurationTab = page.getByText('Configuration', { exact: true })
        this.employeeListTab = page.getByRole('link', { name: 'Employee List' })
        this.addEmployeeTab = page.getByRole('link', { name: 'Add Employee' })
        this.reportsTab = page.getByRole('link', { name: 'Reports' })

        this.addBtn = page.getByRole('button', { name: 'Add' })
        this.employeeNameInput = page.getByPlaceholder('Type for hints...').first()
        this.employeeIdInput = page.locator('.oxd-input-group').filter({ hasText: 'Employee Id' }).locator('input')
        this.searchBtn = page.getByRole('button', { name: 'Search' })
        this.resetBtn = page.getByRole('button', { name: 'Reset' })
        this.recordsFoundText = page.getByText('Records Found')
        this.tableRows = page.locator('.oxd-table-body .oxd-table-card')
        this.firstName = page.locator('input[name="firstName"]')
        this.middleName = page.locator('input[name="middleName"]')
        this.lastName = page.locator('input[name="lastName"]')
        this.saveBtn = page.locator('button.orangehrm-left-space')

    }

    async goto() {
        await this.page.goto(this.url)
    }

    // Left side menu
    async clickPIMMenu() {
        await this.pimMenu.click()
    }

    // Top tabs
    async clickConfigurationTab() {
        await this.configurationTab.click()
    }

    async clickEmployeeListTab() {
        await this.employeeListTab.click()
    }

    async clickAddEmployeeTab() {
        await this.addEmployeeTab.click()
    }

    async clickReportsTab() {
        await this.reportsTab.click()
    }

    // Employee List page
    async clickAddBtn() {
        await this.addBtn.click()
    }

    async enterEmployeeName(name: string) {
        await this.employeeNameInput.fill(name)
    }

    async enterEmployeeId(id: string) {
        await this.employeeIdInput.fill(id)
    }

    async clickSearchBtn() {
        await this.searchBtn.click()
    }

    async clickResetBtn() {
        await this.resetBtn.click()
    }

    async getRecordsFoundText(): Promise<string> {
        return (await this.recordsFoundText.textContent()) ?? ''
    }

    async getRowCount(): Promise<number> {
        return await this.tableRows.count()
    }

    // Combined flows
    async searchByEmployeeId(id: string) {
        await this.enterEmployeeId(id)
        await this.clickSearchBtn()
    }

    async searchByEmployeeName(name: string) {
        await this.enterEmployeeName(name)
        await this.clickSearchBtn()
    }

    async enterFirstName(fname: string) {
        await this.firstName.fill(fname)
    }
    async enterMiddleName(mname: string) {
        await this.middleName.fill(mname)
    }
    async enterLastName(lname: string) {
        await this.lastName.fill(lname)
    }

    async clickOnSaveBtn() {
        await this.saveBtn.click()
    }


}