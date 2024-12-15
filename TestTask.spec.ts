import { test, expect } from "@playwright/test"

const targetUrl = "https://google.com/"
const queryText = "Автотесты"

test("My test task", async ({ page }) => {
  // 1)
  await page.goto(targetUrl)

  // 2)
  const inputField = page.getByRole("combobox")
  await inputField.fill(queryText)

  // 3)
  const searchBtn = page.locator('input[name="btnK"]').first()
  await searchBtn.click()

  // 4)
  const encodeUri = encodeURIComponent(queryText)
  const searchQueryRegex = new RegExp(`/search\\?q=${encodeUri}.*`)
  await expect(page).toHaveURL(searchQueryRegex)

  // 5)
  await expect(page.locator(".logo")).toBeVisible()

  // 6) два варианта, т.к. можно двояко интерпретировать условие
  await page.waitForSelector(".g")
  const items = page.locator(".g")
  const pageSize = await items.count() // 6.1 находим кол-во записей на первой странице

  expect(pageSize).toBeGreaterThan(0) // 6.2 убеждаемся, что кол-во записей != 0

  // 7) два варианта, т.к. можно двояко интерпретировать условие
  await page.waitForSelector('div[role="navigation"]')

  const pagination = page.getByText("Навигация по страницам")
  await expect(pagination).toBeTruthy() // 7.1 проверяем, что кол-во страниц != 0

  await page.waitForSelector('div[role="navigation"]')
  let lastIndexPageBtn = page.locator(
    'div[role="navigation"] table tr td:nth-last-child(2)'
  )
  let nextPage = page.locator('div[role="navigation"] table tr td:last-child')
  while ((await nextPage.innerText()) == "Следующая") {
    await lastIndexPageBtn.click()
    lastIndexPageBtn = page.locator(
      'div[role="navigation"] table tr td:nth-last-child(2)'
    )
    nextPage = page.locator('div[role="navigation"] table tr td:last-child')
  }
  const totalPages = await lastIndexPageBtn.innerText() // 7.2 находим общее кол-во страниц поискового запроса

  // 8)
  await page.waitForSelector('div[aria-label="Очистить"]')
  const clearBtn = page.locator('div[aria-label="Очистить"]')

  // 9)
  await clearBtn.click()
  await expect(inputField.getAttribute("value")).toBe("")
})
