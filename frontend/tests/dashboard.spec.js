import { test, expect } from '@playwright/test'

test.describe("add task and delete it later", () => {

    const randomId = Math.floor(Math.random() * 1000)
    // pre-seeded user in db
    const userDetails = {
        name: "John Doe",
        email: `john.doe@email.com`,
        password: "password"
    }

    test("add new task", async ({ page }) => {
        await loginUser(page, userDetails)
        // now add task
        const addTaskLocator = page.locator('//button[text() = "Add Task"]')
        await expect(addTaskLocator).toBeVisible()

        // add new task
        await addTaskLocator.click()
        const addFormSelector = '//h2[text() = "Add a new task"]'
        await page.waitForSelector(addFormSelector, {
            timeout: 1500
        })

        const titleLocator = page.locator("input#title")
        const descLocator = page.locator("input#description")
        const submitBtn = page.locator("button[type='submit']")

        // fill and submit
        titleLocator.fill("title" + randomId)
        await page.waitForTimeout(300)
        descLocator.fill("description" + randomId)
        await submitBtn.click()

        // list of tasks
        const tasksListDiv = "div.MuiPaper-root.MuiPaper-outlined.MuiPaper-rounded.MuiCard-root.css-1v5z4dq-MuiPaper-root-MuiCard-root"
        await page.waitForSelector(tasksListDiv, {
            timeout: 1500
        })

        const tasks = page.locator(tasksListDiv)
        await expect(tasks.filter({ hasText: "title" + randomId })).toBeVisible()
    })

    test("delete a task", async ({ page }) => {
        await loginUser(page, userDetails)
        // list of tasks
        const tasksListDiv = "div.MuiPaper-root.MuiPaper-outlined.MuiPaper-rounded.MuiCard-root.css-1v5z4dq-MuiPaper-root-MuiCard-root"
        await page.waitForSelector(tasksListDiv, {
            timeout: 3500
        })

        const tasks = page.locator(tasksListDiv)
        await expect(tasks.filter({ hasText: "title" + randomId })).toBeVisible()

        const task = tasks.filter({ hasText: "title" + randomId })
        // delete the task

        const deletelocator = task.locator("button#delete")
        await deletelocator.click()

        //wait for form to show up
        const h5Locator = page.locator("h5", {
            hasText: "Are you sure you want to delete this task?"
        })

        await h5Locator.waitFor({
            timeout: 1000,
        })

        const deleteBtn = page.locator('//button[text()="Delete"]')
        await deleteBtn.waitFor({ timeout: 300 })
        await deleteBtn.click()
    })
})


/**
 * helper function to login user
 * @param {*} page 
 * @param {*} userDetails 
 */
async function loginUser(page, userDetails) {
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
        timeout: 1500
    })
}