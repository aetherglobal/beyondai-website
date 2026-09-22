import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:3000'

test.describe('Frontend', () => {
  test('homepage renders this site, not the Payload template', async ({ page }) => {
    await page.goto(BASE_URL)

    await expect(page).toHaveTitle(/Beyond AI/)
    await expect(page.locator('h1').first()).toBeVisible()
  })

  test('has a main landmark and a working skip link', async ({ page }) => {
    await page.goto(BASE_URL)

    await expect(page.locator('main#main-content')).toHaveCount(1)

    await page.keyboard.press('Tab')
    const skipLink = page.getByRole('link', { name: /skip to content/i })
    await expect(skipLink).toBeFocused()
  })

  test('emits Organization structured data', async ({ page }) => {
    await page.goto(BASE_URL)

    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents()
    const types = blocks.flatMap((block) => {
      const parsed = JSON.parse(block)
      return (Array.isArray(parsed) ? parsed : [parsed]).map((entry) => entry['@type'])
    })

    expect(types).toContain('Organization')
    expect(types).toContain('WebSite')
  })

  test('share image is an absolute, well-formed URL', async ({ page }) => {
    await page.goto(BASE_URL)

    const ogImage = await page
      .locator('meta[property="og:image"]')
      .first()
      .getAttribute('content')

    expect(ogImage).toBeTruthy()
    expect(() => new URL(ogImage!)).not.toThrow()
    expect(ogImage).not.toMatch(/https?:\/\/[^/]+https?/)
  })

  test('serves a 404 page for an unknown route', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/this-route-does-not-exist-9f3a`)

    expect(response?.status()).toBe(404)
  })
})
