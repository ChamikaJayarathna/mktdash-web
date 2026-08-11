import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const INBOX_URL = "/w/northwind/email/inbox";

const openComposer = async (page: Page) => {
  await page.goto(INBOX_URL);
  await page.getByRole("button", { name: "Compose" }).click();

  const composer = page.getByRole("dialog");
  await expect(composer).toHaveAccessibleName(/new message/i);
  await expect(
    composer.getByRole("button", { name: /Sending from/ }),
  ).toBeVisible();

  return composer;
};

test.describe("compose and send", () => {
  test("writes, sends, and can stop a message from the composer", async ({
    page,
  }) => {
    const composer = await openComposer(page);

    await composer.getByLabel("To").fill("marcus@northwind.co");
    await composer.getByLabel("To").press("Enter");
    await composer.getByLabel("Subj").fill("Partnership intro");
    await composer
      .getByRole("textbox", { name: "Message body" })
      .fill("Worth fifteen minutes this week?");

    const send = composer.getByRole("button", { name: /^Send$/ });
    await expect(send).toBeEnabled();
    await send.click();

    const toast = page.getByText(/Sent from .*, attributed to/);
    await expect(toast).toBeVisible();
    await expect(page.getByRole("dialog")).toHaveCount(0);

    await page.getByRole("button", { name: "Undo" }).click();
    await expect(
      page.getByRole("dialog", { name: /partnership intro/i }),
    ).toBeVisible();
  });

  test("blocks a send to a suppressed address before it leaves", async ({
    page,
  }) => {
    const composer = await openComposer(page);

    await composer.getByLabel("To").fill("dana@northwind.co");
    await composer.getByLabel("To").press("Enter");
    await composer
      .getByRole("textbox", { name: "Message body" })
      .fill("Following up on the deck.");

    await expect(
      composer.getByRole("button", { name: /^Send$/ }),
    ).toBeDisabled();
    await expect(
      composer.getByText(/dana@northwind\.co is suppressed org-wide/i),
    ).toBeVisible();
  });

  test("keeps a draft alive across navigation", async ({ page }) => {
    const composer = await openComposer(page);

    await composer.getByLabel("Subj").fill("Survives navigation");
    await page
      .getByRole("link", { name: /Drafts/ })
      .first()
      .click();

    await expect(
      page.getByRole("dialog", { name: /survives navigation/i }),
    ).toBeVisible();
  });

  test("adds no accessibility violations beyond the palette's known gaps", async ({
    page,
  }) => {
    await openComposer(page);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const introduced = results.violations.filter(
      (violation) => violation.id !== "color-contrast",
    );

    expect(introduced).toEqual([]);
  });
});
