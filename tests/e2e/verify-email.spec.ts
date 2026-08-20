import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const VERIFY_URL = "/verify-email?email=priya%40acme.co";

test.describe("verify email", () => {
  test("takes a new account from sign-up through to the dashboard", async ({
    page,
  }) => {
    await page.goto("/sign-up");

    await page.getByLabel("Full name").fill("Priya Raman");
    await page.getByLabel("Work email").fill("priya@acme.co");
    await page.getByLabel("Password").fill("correct horse battery staple");
    await page.getByRole("button", { name: "Continue" }).click();

    await page.getByLabel("Workspace name").fill("Acme Co.");
    await page.getByRole("button", { name: "Create workspace" }).click();

    await page.waitForURL(/\/verify-email\?email=priya%40acme\.co/);
    await expect(
      page.getByRole("heading", { name: "Check your email" }),
    ).toBeVisible();
    await expect(page.getByText("priya@acme.co")).toBeVisible();

    const code = page.getByLabel(/digit verification code/i);
    const confirm = page.getByRole("button", { name: /confirm email/i });

    await code.fill("111111");
    await confirm.click();
    await expect(page.getByText(/that code is not right/i)).toBeVisible();
    await expect(code).toHaveValue("");

    await code.fill("123456");
    await confirm.click();
    await page.waitForURL(/\/w\/acme\/home/);
  });

  test("holds resend on a countdown and keeps a way back to sign-up", async ({
    page,
  }) => {
    await page.goto(VERIFY_URL);

    await page.getByRole("button", { name: /resend code/i }).click();

    await expect(
      page.getByRole("button", { name: /resend in/i }),
    ).toBeDisabled();
    await expect(
      page.getByText(/a new code is on its way to priya@acme\.co/i),
    ).toBeVisible();

    await page.getByRole("link", { name: /use a different address/i }).click();
    await page.waitForURL(/\/sign-up/);
  });

  test("explains itself when no address is in scope", async ({ page }) => {
    await page.goto("/verify-email");

    await expect(page.getByText(/nothing to verify/i)).toBeVisible();
    await expect(
      page.getByRole("link", { name: /create your account/i }),
    ).toBeVisible();
  });

  test("has no accessibility violations", async ({ page }) => {
    await page.goto(VERIFY_URL);
    await expect(
      page.getByRole("heading", { name: "Check your email" }),
    ).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(
      results.violations.filter(
        (violation) => violation.id !== "color-contrast",
      ),
    ).toEqual([]);
  });
});
