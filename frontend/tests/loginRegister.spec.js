import { test, expect } from '@playwright/test'

test.describe("register and login", () => {

    const randomId = Math.floor(Math.random() * 1000)
    const userDetails = {
        name: "John Doe",
        email: `john.doe${randomId}@email.com`,
        password: "password"
    }
    test("register new user", async ({ page }) => {
        await page.goto("http://localhost:9001/register")
        await page.waitForTimeout(1000)
        const h4Selector = "//h4"
        const locator = await page.waitForSelector(h4Selector)
        expect(await locator.innerText()).toContain("Register")
        // now input some details into registration form
        const emailLocator = page.locator("input#email")
        const nameLocator = page.locator("input#name")
        const passwordLocator = page.locator("input#password")
        const submitLocator = page.locator('button[type="submit"]')

        // fill details
        nameLocator.fill(userDetails.name)
        await page.waitForTimeout(300)
        emailLocator.fill(userDetails.email)
        await page.waitForTimeout(300)
        passwordLocator.fill(userDetails.password)
        await page.waitForTimeout(300)
        // click submit
        await submitLocator.click()

        //on successfull registration, the page should be redirected to login
        await page.waitForTimeout(1000)
        const loginPageH4 = page.locator(h4Selector)
        expect(await loginPageH4.innerText()).toContain("Login")
        // expect(page.url()).toContainEqual("http://localhost:9001/")
    })

    test("login new user", async ({ page }) => {
        await page.goto("http://localhost:9001/")
        await page.waitForTimeout(1000)
        const h4Selector = "//h4"
        const locator = await page.waitForSelector(h4Selector)
        expect(await locator.innerText()).toContain("Login")
        // now input some details into registration form
        const emailLocator = page.locator("input#email")
        const passwordLocator = page.locator("input#password")
        const submitLocator = page.locator('button[type="submit"]')

        // fill details
        emailLocator.fill(userDetails.email)
        await page.waitForTimeout(300)
        passwordLocator.fill(userDetails.password)
        await page.waitForTimeout(300)
        // click submit
        await submitLocator.click()

        //on successfull login, the page should be redirected to dashboard
        await page.waitForTimeout(1000)
        await page.waitForSelector('//button[text() = "Logout"]', {
            timeout: 3500
        })
        const logoutLocator = page.locator('//button[text() = "Logout"]')
        expect(logoutLocator).toBeDefined()
    })
})