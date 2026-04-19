import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

const PASSWORD = 'Password123!'

function buildEmail(label: string) {
  return `${label}-${Date.now()}-${Math.random().toString(16).slice(2)}@example.com`
}

async function createAccount(page: Page, email: string) {
  await page.goto('/')
  await page
    .locator('.auth-mode')
    .getByRole('button', { name: 'Create account' })
    .click()
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(PASSWORD)
  await page
    .locator('form')
    .getByRole('button', { name: 'Create account' })
    .click()
  await expect(
    page.getByRole('button', { name: 'Start Full Practice Test' })
  ).toBeVisible()
}

async function signIn(page: Page, email: string) {
  await page.goto('/')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(PASSWORD)
  await page.locator('form').getByRole('button', { name: 'Sign in' }).click()
  await expect(
    page.getByRole('button', { name: 'Start Full Practice Test' })
  ).toBeVisible()
}

test('follows the system color scheme without a visible theme toggle', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expect(page.locator('.theme-toggle')).toHaveCount(0)
  await expect(
    page.getByRole('group', { name: 'Theme preference' })
  ).toHaveCount(0)
})

test('can create an account, start a full practice test, submit it, and see saved history', async ({
  page,
}) => {
  await createAccount(page, buildEmail('full-test'))

  await page.getByRole('button', { name: 'Start Full Practice Test' }).click()
  await expect(page).toHaveURL(/#\/practice$/)
  await expect(page.getByRole('heading', { name: 'Question 1' })).toBeVisible()

  await page.locator('.answer-list input[type="radio"]').first().check()
  page.once('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: 'Submit attempt' }).click()

  await expect(page).toHaveURL(/#\/results\//)
  await expect(
    page.getByRole('heading', { name: 'Full Practice Test' })
  ).toBeVisible()

  await page.getByRole('link', { name: 'History' }).click()
  await expect(page).toHaveURL(/#\/history$/)
  await expect(
    page.getByRole('heading', { name: 'History and trends' })
  ).toBeVisible()
  await expect(page.locator('tbody tr')).toHaveCount(1)
})

test('can start a full practice test when crypto.randomUUID is unavailable', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const cryptoApi = globalThis.crypto

    if (cryptoApi) {
      Object.defineProperty(cryptoApi, 'randomUUID', {
        value: undefined,
        configurable: true,
      })
    }
  })

  await createAccount(page, buildEmail('no-randomuuid'))
  await page.getByRole('button', { name: 'Start Full Practice Test' }).click()

  await expect(page).toHaveURL(/#\/practice$/)
  await expect(page.getByRole('heading', { name: 'Question 1' })).toBeVisible()
})

test('persists a paused session across sign-out and sign-in', async ({
  page,
}) => {
  const email = buildEmail('resume')

  await createAccount(page, email)
  await page.getByRole('button', { name: 'Start Section Quiz' }).click()
  await expect(page).toHaveURL(/#\/practice$/)

  await page.locator('.answer-list input[type="radio"]').first().check()
  await page.getByRole('button', { name: 'Pause and save' }).click()

  await expect(page).toHaveURL(/#\/?$/)
  await expect(
    page.getByRole('button', { name: 'Resume Saved Session' })
  ).toBeVisible()

  await page.getByRole('button', { name: 'Sign out' }).click()
  await signIn(page, email)

  await page.getByRole('button', { name: 'Resume Saved Session' }).click()
  await expect(page).toHaveURL(/#\/practice$/)
  await expect(
    page.locator('.answer-list input[type="radio"]').first()
  ).toBeChecked()
})

test('exports, clears, and re-imports saved history', async ({
  page,
}, testInfo) => {
  await createAccount(page, buildEmail('history'))

  await page.getByRole('button', { name: 'Start Full Practice Test' }).click()
  await expect(page).toHaveURL(/#\/practice$/)

  await page.locator('.answer-list input[type="radio"]').first().check()
  page.once('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: 'Submit attempt' }).click()
  await expect(page).toHaveURL(/#\/results\//)

  await page.getByRole('link', { name: 'History' }).click()
  await expect(page).toHaveURL(/#\/history$/)
  await expect(page.locator('tbody tr')).toHaveCount(1)

  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export history JSON' }).click()
  const download = await downloadPromise
  const downloadPath = testInfo.outputPath(download.suggestedFilename())
  await download.saveAs(downloadPath)

  page.once('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: 'Clear saved history' }).click()
  await expect(
    page.getByRole('heading', { name: 'No attempts yet' })
  ).toBeVisible()

  await page.locator('input[type="file"]').setInputFiles(downloadPath)
  await expect(page.locator('tbody tr')).toHaveCount(1)
})
