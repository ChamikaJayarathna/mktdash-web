import { afterEach, describe, expect, it } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithProviders } from "@/test/utils/renderWithProviders";
import { resetMailboxStore } from "../api/emailAccountsService";
import EmailAccountsBoard from "./EmailAccountsBoard";

const renderBoard = () =>
  renderWithProviders(<EmailAccountsBoard workspaceSlug="northwind" />);

const findMailboxCard = async (name: string): Promise<HTMLElement> => {
  const heading = await screen.findByRole("heading", { name });

  return heading.closest("article") as HTMLElement;
};

describe("EmailAccountsBoard", () => {
  afterEach(() => {
    resetMailboxStore();
  });

  it("lists every connected mailbox with its endpoints and storage", async () => {
    renderBoard();

    const card = await findMailboxCard("Priya Raman");

    expect(within(card).getByText("priya@followaxis.com")).toBeInTheDocument();
    expect(within(card).getByText("imap.gmail.com:993")).toBeInTheDocument();
    expect(within(card).getByText("smtp.gmail.com:465")).toBeInTheDocument();
    expect(
      within(card).getByRole("progressbar", {
        name: "Storage used by priya@followaxis.com",
      }),
    ).toHaveAttribute("aria-valuetext", "4.2 GB of 15 GB");
  });

  it("shows a paused mailbox as paused rather than syncing", async () => {
    renderBoard();

    const card = await findMailboxCard("Northwind Outreach");

    expect(within(card).getByText("Sync paused")).toBeInTheDocument();
    expect(
      within(card).getByRole("switch", { name: /northwind@client\.co/i }),
    ).not.toBeChecked();
  });

  it("flips a mailbox out of sync optimistically", async () => {
    const { user } = renderBoard();

    const card = await findMailboxCard("Priya Raman");
    const toggle = within(card).getByRole("switch", {
      name: /priya@followaxis\.com/i,
    });

    expect(toggle).toBeChecked();

    await user.click(toggle);

    await waitFor(() => expect(toggle).not.toBeChecked());
    expect(within(card).getByText("Sync paused")).toBeInTheDocument();
  });

  it("auto-fills the server settings for the selected provider", async () => {
    const { user } = renderBoard();

    const gmailHost = await screen.findByLabelText("IMAP host");
    expect(gmailHost).toHaveValue("imap.gmail.com");

    await user.click(screen.getByRole("radio", { name: /fastmail/i }));

    await waitFor(() =>
      expect(screen.getByLabelText("IMAP host")).toHaveValue(
        "imap.fastmail.com",
      ),
    );
    expect(screen.getByLabelText("SMTP host")).toHaveValue("smtp.fastmail.com");
  });

  it("asks for an app password only when the provider cannot use OAuth", async () => {
    const { user } = renderBoard();

    await screen.findByRole("radio", { name: /gmail/i });
    expect(screen.queryByLabelText("App password")).not.toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: /fastmail/i }));

    expect(await screen.findByLabelText("App password")).toBeInTheDocument();
  });

  it("only disconnects a mailbox once its address has been typed back", async () => {
    const { user } = renderBoard();

    const card = await findMailboxCard("Priya Raman");

    await user.click(within(card).getByRole("button", { name: "Delete" }));

    const dialog = await screen.findByRole("dialog", {
      name: /disconnect priya@followaxis\.com/i,
    });
    const confirm = within(dialog).getByRole("button", {
      name: "Disconnect mailbox",
    });
    const confirmationField =
      within(dialog).getByLabelText(/type .* to confirm/i);

    expect(confirm).toBeDisabled();

    await user.type(confirmationField, "priya@");
    expect(confirm).toBeDisabled();

    await user.type(confirmationField, "followaxis.com");
    await waitFor(() => expect(confirm).toBeEnabled());

    await user.click(confirm);

    await waitFor(() =>
      expect(
        screen.queryByRole("heading", { name: "Priya Raman" }),
      ).not.toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = renderBoard();

    await findMailboxCard("Priya Raman");

    await expect(axe(container)).resolves.toHaveNoViolations();
  });
});
