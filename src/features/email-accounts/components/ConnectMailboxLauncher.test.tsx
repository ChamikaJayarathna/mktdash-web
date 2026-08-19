import { afterEach, describe, expect, it } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithProviders } from "@/test/utils/renderWithProviders";
import { resetMailboxStore } from "../api/emailAccountsService";
import ConnectMailboxLauncher from "./ConnectMailboxLauncher";

const renderLauncher = () =>
  renderWithProviders(<ConnectMailboxLauncher workspaceSlug="northwind" />);

const openWizard = async (
  user: ReturnType<typeof renderWithProviders>["user"],
): Promise<HTMLElement> => {
  await user.click(screen.getByRole("button", { name: /connect a mailbox/i }));

  return screen.findByRole("dialog", { name: /connect a mailbox/i });
};

describe("ConnectMailboxLauncher", () => {
  afterEach(() => {
    resetMailboxStore();
  });

  it("keeps the connection flow closed until the button is pressed", () => {
    renderLauncher();

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /connect a mailbox/i }),
    ).toBeInTheDocument();
  });

  it("cannot continue past step one until a mailbox is identified", async () => {
    const { user } = renderLauncher();
    const dialog = await openWizard(user);

    await screen.findByRole("radio", { name: /gmail/i });

    expect(
      within(dialog).getByRole("button", { name: "Continue" }),
    ).toBeDisabled();

    await user.type(
      within(dialog).getByLabelText("Email address"),
      "priya@followaxis.com",
    );

    await waitFor(() =>
      expect(
        within(dialog).getByRole("button", { name: "Continue" }),
      ).toBeEnabled(),
    );
  });

  it("detects the provider from the address and says how it knew", async () => {
    const { user } = renderLauncher();
    const dialog = await openWizard(user);

    await screen.findByRole("radio", { name: /gmail/i });
    await user.type(
      within(dialog).getByLabelText("Email address"),
      "priya@followaxis.com",
    );

    expect(
      await within(dialog).findByText(/aspmx\.l\.google\.com/i),
    ).toBeInTheDocument();
  });

  it("warns and falls back to manual IMAP when the host is unknown", async () => {
    const { user } = renderLauncher();
    const dialog = await openWizard(user);

    await screen.findByRole("radio", { name: /gmail/i });
    await user.type(
      within(dialog).getByLabelText("Email address"),
      "hello@unknown-host.dev",
    );

    expect(
      await within(dialog).findByText(/no mx match for unknown-host\.dev/i),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByText(/a mail record is a hint, not proof/i),
    ).toBeInTheDocument();
  });

  it("offers least-privilege scope tiers for an OAuth provider", async () => {
    const { user } = renderLauncher();
    const dialog = await openWizard(user);

    await screen.findByRole("radio", { name: /gmail/i });
    await user.type(
      within(dialog).getByLabelText("Email address"),
      "priya@followaxis.com",
    );
    await user.click(within(dialog).getByRole("button", { name: "Continue" }));

    expect(
      await within(dialog).findByRole("heading", { name: /authorise gmail/i }),
    ).toBeInTheDocument();

    const recommended = within(dialog).getByRole("radio", {
      name: /send and read replies/i,
    });
    expect(recommended).toBeChecked();

    await user.click(within(dialog).getByRole("radio", { name: /send only/i }));
    expect(
      within(dialog).getByRole("radio", { name: /send only/i }),
    ).toBeChecked();
  });

  it("asks for an app password instead of scopes when OAuth is unavailable", async () => {
    const { user } = renderLauncher();
    const dialog = await openWizard(user);

    await user.click(await screen.findByRole("radio", { name: /fastmail/i }));
    await user.type(
      within(dialog).getByLabelText("Email address"),
      "hello@fastmail.com",
    );
    await user.click(within(dialog).getByRole("button", { name: "Continue" }));

    expect(
      await within(dialog).findByLabelText("App password"),
    ).toBeInTheDocument();
    expect(
      within(dialog).queryByRole("radio", { name: /send and read replies/i }),
    ).not.toBeInTheDocument();
    expect(within(dialog).getByLabelText("IMAP host")).toHaveValue(
      "imap.fastmail.com",
    );
  });

  it("will not submit the manual route without an app password", async () => {
    const { user } = renderLauncher();
    const dialog = await openWizard(user);

    await user.click(await screen.findByRole("radio", { name: /fastmail/i }));
    await user.type(
      within(dialog).getByLabelText("Email address"),
      "hello@fastmail.com",
    );
    await user.click(within(dialog).getByRole("button", { name: "Continue" }));

    await user.click(
      await within(dialog).findByRole("button", {
        name: /continue to fastmail/i,
      }),
    );

    expect(
      await within(dialog).findByText(/paste the app-specific password/i),
    ).toBeInTheDocument();
  });

  it("reports the verification checks once the mailbox connects", async () => {
    const { user } = renderLauncher();
    const dialog = await openWizard(user);

    await screen.findByRole("radio", { name: /gmail/i });
    await user.type(
      within(dialog).getByLabelText("Email address"),
      "priya@followaxis.com",
    );
    await user.click(within(dialog).getByRole("button", { name: "Continue" }));
    await user.click(
      await within(dialog).findByRole("button", { name: /continue to gmail/i }),
    );

    expect(
      await within(dialog).findByRole("heading", { name: "Connected" }),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByText("All three pass for followaxis.com"),
    ).toBeInTheDocument();

    await user.click(within(dialog).getByRole("button", { name: "Done" }));

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  });

  it("has no detectable accessibility violations while open", async () => {
    const { user, container } = renderLauncher();

    await openWizard(user);
    await screen.findByRole("radio", { name: /gmail/i });

    await expect(axe(container)).resolves.toHaveNoViolations();
  });
});
