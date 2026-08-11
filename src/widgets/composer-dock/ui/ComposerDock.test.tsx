import { beforeEach, describe, expect, it } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import { axe } from "jest-axe";
import { useEmailComposerStore } from "@/features/email-composer";
import { renderWithProviders } from "@/test/utils/renderWithProviders";
import ComposerDock from "./ComposerDock";

const renderDock = () =>
  renderWithProviders(
    <ComposerDock workspaceSlug="northwind" senderName="Priya Raman" />,
  );

const openComposer = () => useEmailComposerStore.getState().openComposer();

const findComposer = async (): Promise<HTMLElement> => {
  const dialog = await screen.findByRole("dialog", { name: /new message/i });

  await waitFor(() =>
    expect(
      within(dialog).getByRole("button", { name: /sending from/i }),
    ).toBeInTheDocument(),
  );

  return dialog;
};

describe("ComposerDock", () => {
  beforeEach(() => {
    useEmailComposerStore.setState({ sessions: [] });
  });

  it("renders nothing until a message is being composed", () => {
    renderDock();

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens a composer with the fields needed to send", async () => {
    openComposer();
    renderDock();

    const dialog = await findComposer();

    expect(within(dialog).getByLabelText("To")).toBeInTheDocument();
    expect(within(dialog).getByLabelText("Subj")).toBeInTheDocument();
    expect(
      within(dialog).getByRole("textbox", { name: "Message body" }),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByRole("button", { name: /^Send$/ }),
    ).toBeVisible();
  });

  it("defaults to the first mailbox the sender is granted", async () => {
    openComposer();
    renderDock();

    const dialog = await findComposer();

    expect(
      within(dialog).getByRole("button", {
        name: /Sending from priya@followaxis\.com/,
      }),
    ).toBeInTheDocument();
  });

  it("refuses to send with no recipient and says why", async () => {
    openComposer();
    renderDock();

    const dialog = await findComposer();

    expect(
      within(dialog).getByRole("button", { name: /^Send$/ }),
    ).toBeDisabled();
    expect(
      within(dialog).getByText(/Add at least one address in To/i),
    ).toBeInTheDocument();
  });

  it("turns a typed address into a recipient chip", async () => {
    openComposer();
    const { user } = renderDock();

    const dialog = await findComposer();
    await user.type(
      within(dialog).getByLabelText("To"),
      "marcus@northwind.co{Enter}",
    );

    expect(
      within(dialog).getByRole("button", {
        name: "Remove marcus@northwind.co",
      }),
    ).toBeInTheDocument();
  });

  it("unblocks the send once it has a recipient and a body", async () => {
    openComposer();
    const { user } = renderDock();

    const dialog = await findComposer();
    await user.type(
      within(dialog).getByLabelText("To"),
      "marcus@northwind.co{Enter}",
    );

    expect(
      within(dialog).getByRole("button", { name: /^Send$/ }),
    ).toBeDisabled();

    await user.type(
      within(dialog).getByRole("textbox", { name: "Message body" }),
      "Worth fifteen minutes this week?",
    );

    await waitFor(() =>
      expect(
        within(dialog).getByRole("button", { name: /^Send$/ }),
      ).toBeEnabled(),
    );
  });

  it("blocks a send to a suppressed address and names the address", async () => {
    openComposer();
    const { user } = renderDock();

    const dialog = await findComposer();
    await user.type(
      within(dialog).getByLabelText("To"),
      "dana@northwind.co{Enter}",
    );

    await waitFor(() =>
      expect(
        within(dialog).getByRole("button", { name: /^Send$/ }),
      ).toBeDisabled(),
    );
    expect(
      within(dialog).getByText(/dana@northwind\.co is suppressed org-wide/i),
    ).toBeInTheDocument();
  });

  it("rejects an unparseable address instead of silently dropping it", async () => {
    openComposer();
    const { user } = renderDock();

    const dialog = await findComposer();
    await user.type(within(dialog).getByLabelText("To"), "not-an-email{Enter}");

    expect(await within(dialog).findByRole("alert")).toHaveTextContent(
      /not-an-email is not a valid email address/i,
    );
  });

  it("collapses to a docked bar when minimised and restores from it", async () => {
    openComposer();
    const { user } = renderDock();

    const dialog = await findComposer();
    await user.click(
      within(dialog).getByRole("button", { name: "Minimise composer" }),
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Restore composer/ }));

    expect(
      await screen.findByRole("dialog", { name: /new message/i }),
    ).toBeInTheDocument();
  });

  it("closes the composer from the docked bar", async () => {
    openComposer();
    const { user } = renderDock();

    const dialog = await findComposer();
    await user.click(
      within(dialog).getByRole("button", { name: "Close composer" }),
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it.each([
    [
      "Sending from priya@followaxis.com. Change mailbox",
      "Accounts you can send from · 3",
    ],
    ["Insert merge tag", "Merge tags"],
    ["Insert link", "Link address"],
    ["Insert image", "Alt text"],
    ["Schedule this send", "Pick a date and time"],
    ["Template", "Insert a template"],
    ["Change", "Signature"],
    ["Signature", "Priya — short"],
  ])("opens the %s menu without crashing", async (trigger, content) => {
    openComposer();
    const { user } = renderDock();

    const dialog = await findComposer();
    await user.click(within(dialog).getByRole("button", { name: trigger }));

    expect(await screen.findByText(content)).toBeVisible();
  });

  it("switches the mailbox a message will leave from", async () => {
    openComposer();
    const { user } = renderDock();

    const dialog = await findComposer();
    await user.click(
      within(dialog).getByRole("button", { name: /Sending from/ }),
    );
    await user.click(
      await screen.findByRole("menuitemradio", {
        name: /hello@followaxis\.com/,
      }),
    );

    expect(
      await within(dialog).findByRole("button", {
        name: /Sending from hello@followaxis\.com/,
      }),
    ).toBeInTheDocument();
  });

  it("shows a mailbox the sender is not granted as disabled rather than hiding it", async () => {
    openComposer();
    const { user } = renderDock();

    const dialog = await findComposer();
    await user.click(
      within(dialog).getByRole("button", { name: /Sending from/ }),
    );

    expect(
      await screen.findByRole("menuitemradio", { name: /ceo@followaxis\.com/ }),
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("applies a signature picked from the action bar to the message", async () => {
    openComposer();
    const { user } = renderDock();

    const dialog = await findComposer();
    await user.click(within(dialog).getByRole("button", { name: "Signature" }));
    await user.click(
      await screen.findByRole("menuitem", { name: /Priya — short/ }),
    );

    expect(
      await within(dialog).findByText("Signature · Priya — short"),
    ).toBeVisible();
  });

  it("can send a message with no signature at all", async () => {
    openComposer();
    const { user } = renderDock();

    const dialog = await findComposer();
    await user.click(within(dialog).getByRole("button", { name: "Signature" }));
    await user.click(
      await screen.findByRole("menuitem", { name: "No signature" }),
    );

    expect(await within(dialog).findByText("Signature · None")).toBeVisible();
    expect(within(dialog).getByText(/goes out unsigned/i)).toBeInTheDocument();
  });

  it("opens the emoji picker from the action bar", async () => {
    openComposer();
    const { user } = renderDock();

    const dialog = await findComposer();
    await user.click(
      within(dialog).getByRole("button", { name: "Insert emoji" }),
    );

    expect(await screen.findByPlaceholderText("Search emoji")).toBeVisible();
  });

  it("has no detectable accessibility violations", async () => {
    openComposer();
    const { container } = renderDock();

    await findComposer();

    await expect(axe(container)).resolves.toHaveNoViolations();
  });
});
