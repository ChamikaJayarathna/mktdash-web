import { afterEach, describe, expect, it } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithProviders } from "@/test/utils/renderWithProviders";
import { resetMailboxStore } from "../api/emailAccountsService";
import EmailAccountsBoard from "./EmailAccountsBoard";

const renderBoard = () =>
  renderWithProviders(<EmailAccountsBoard workspaceSlug="northwind" />);

const openEditor = async (
  user: ReturnType<typeof renderWithProviders>["user"],
  mailboxName: string,
): Promise<HTMLElement> => {
  const heading = await screen.findByRole("heading", { name: mailboxName });
  const card = heading.closest("article") as HTMLElement;

  await user.click(within(card).getByRole("button", { name: "Edit" }));

  return screen.findByRole("dialog");
};

describe("EditMailboxDialog", () => {
  afterEach(() => {
    resetMailboxStore();
  });

  it("opens seeded with the mailbox's current settings", async () => {
    const { user } = renderBoard();
    const dialog = await openEditor(user, "Priya Raman");

    expect(within(dialog).getByLabelText("Display name")).toHaveValue(
      "Priya Raman",
    );
    expect(within(dialog).getByLabelText("Daily send cap")).toHaveValue(120);
    expect(
      within(dialog).getByRole("combobox", { name: "Opens" }),
    ).toHaveTextContent("09:00");
    expect(
      within(dialog).getByRole("combobox", { name: "Closes" }),
    ).toHaveTextContent("17:00");
    expect(within(dialog).getByText("38 sent today")).toBeInTheDocument();
  });

  it("does not offer the address as an editable field", async () => {
    const { user } = renderBoard();
    const dialog = await openEditor(user, "Priya Raman");

    expect(
      within(dialog).queryByLabelText(/email address/i),
    ).not.toBeInTheDocument();
  });

  it("offers scope tiers for an OAuth mailbox and a password for an app-password one", async () => {
    const { user } = renderBoard();

    const oauthDialog = await openEditor(user, "Priya Raman");
    expect(
      within(oauthDialog).getByRole("radio", {
        name: /send and read replies/i,
      }),
    ).toBeChecked();
    expect(
      within(oauthDialog).queryByLabelText("Replace app password"),
    ).not.toBeInTheDocument();

    await user.click(
      within(oauthDialog).getByRole("button", { name: "Cancel" }),
    );
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );

    const manualDialog = await openEditor(user, "Transactional");
    expect(
      within(manualDialog).getByLabelText("Replace app password"),
    ).toBeInTheDocument();
    expect(
      within(manualDialog).queryByRole("radio", {
        name: /send and read replies/i,
      }),
    ).not.toBeInTheDocument();
  });

  it("refuses a sending window that closes before it opens", async () => {
    const { user } = renderBoard();
    const dialog = await openEditor(user, "Priya Raman");

    await user.click(within(dialog).getByRole("combobox", { name: "Closes" }));
    await user.click(
      await screen.findByRole("option", { name: "07:00, 7:00 AM" }),
    );
    await user.click(
      within(dialog).getByRole("button", { name: "Save changes" }),
    );

    expect(
      await within(dialog).findByText("The window must end after it starts."),
    ).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("accepts a time typed into the picker that is off the half hour", async () => {
    const { user } = renderBoard();
    const dialog = await openEditor(user, "Priya Raman");
    const opens = within(dialog).getByRole("combobox", { name: "Opens" });

    await user.click(opens);
    await user.keyboard("9:37");
    await user.click(
      await screen.findByRole("option", { name: "09:37, 9:37 AM" }),
    );

    await waitFor(() => expect(opens).toHaveTextContent("09:37"));
  });

  it("keeps an off-step stored time selectable in the list", async () => {
    const { user } = renderBoard();
    const dialog = await openEditor(user, "Transactional");

    await user.click(within(dialog).getByRole("combobox", { name: "Closes" }));

    expect(
      await screen.findByRole("option", { name: "23:59, 11:59 PM" }),
    ).toBeInTheDocument();
  });

  it("refuses a sending window with no days", async () => {
    const { user } = renderBoard();
    const dialog = await openEditor(user, "Priya Raman");

    for (const day of ["Mon", "Tue", "Wed", "Thu", "Fri"]) {
      await user.click(within(dialog).getByRole("checkbox", { name: day }));
    }

    await user.click(
      within(dialog).getByRole("button", { name: "Save changes" }),
    );

    expect(
      await within(dialog).findByText("Pick at least one sending day."),
    ).toBeInTheDocument();
  });

  it("saves a renamed mailbox and a changed cap back to the list", async () => {
    const { user } = renderBoard();
    const dialog = await openEditor(user, "Priya Raman");

    const name = within(dialog).getByLabelText("Display name");
    await user.clear(name);
    await user.type(name, "Priya — outbound");

    const cap = within(dialog).getByLabelText("Daily send cap");
    await user.clear(cap);
    await user.type(cap, "60");

    await user.click(
      within(dialog).getByRole("button", { name: "Save changes" }),
    );

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(
      await screen.findByRole("heading", { name: "Priya — outbound" }),
    ).toBeInTheDocument();
  });

  it("grants a member sending access without touching the others", async () => {
    const { user } = renderBoard();
    const dialog = await openEditor(user, "Follow Axis Team");

    const irisSwitch = within(dialog).getByRole("switch", {
      name: /iris kaur/i,
    });
    expect(irisSwitch).not.toBeChecked();

    await user.click(irisSwitch);
    expect(irisSwitch).toBeChecked();
    expect(
      within(dialog).getByRole("switch", { name: /arun mehta/i }),
    ).toBeChecked();
  });

  it("shows each grantee's email beside their name", async () => {
    const { user } = renderBoard();
    const dialog = await openEditor(user, "Follow Axis Team");

    expect(within(dialog).getByText("arun@followaxis.com")).toBeInTheDocument();
    expect(within(dialog).getByText("Campaign Manager")).toBeInTheDocument();
  });

  it("assigns a member through the searchable picker", async () => {
    const { user } = renderBoard();
    const dialog = await openEditor(user, "Priya Raman");

    expect(
      within(dialog).queryByRole("switch", { name: /tom whitfield/i }),
    ).not.toBeInTheDocument();

    await user.click(
      within(dialog).getByRole("button", { name: /add member/i }),
    );
    await user.click(
      await screen.findByRole("option", { name: /tom whitfield/i }),
    );

    const tomSwitch = await within(dialog).findByRole("switch", {
      name: /tom whitfield/i,
    });
    expect(tomSwitch).toBeChecked();
  });

  it("filters the picker by name, email or role", async () => {
    const { user } = renderBoard();
    const dialog = await openEditor(user, "Priya Raman");

    await user.click(
      within(dialog).getByRole("button", { name: /add member/i }),
    );
    await screen.findByRole("option", { name: /tom whitfield/i });

    await user.keyboard("designer");

    await waitFor(() =>
      expect(
        screen.queryByRole("option", { name: /sofia marchetti/i }),
      ).not.toBeInTheDocument(),
    );
    expect(
      screen.getByRole("option", { name: /tom whitfield/i }),
    ).toBeInTheDocument();
  });

  it("ticks members already assigned to the mailbox", async () => {
    const { user } = renderBoard();
    const dialog = await openEditor(user, "Priya Raman");

    await user.click(
      within(dialog).getByRole("button", { name: /add member/i }),
    );

    expect(
      await screen.findByRole("option", { name: /priya raman/i }),
    ).toHaveAttribute("aria-selected");
  });

  it("never offers a member from another organisation", async () => {
    const { user } = renderBoard();
    const dialog = await openEditor(user, "Priya Raman");

    await user.click(
      within(dialog).getByRole("button", { name: /add member/i }),
    );
    await screen.findByRole("option", { name: /tom whitfield/i });

    expect(
      screen.queryByRole("option", { name: /elena duarte/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: /marcus bell/i }),
    ).not.toBeInTheDocument();
  });

  it("removes a member from the mailbox", async () => {
    const { user } = renderBoard();
    const dialog = await openEditor(user, "Follow Axis Team");

    expect(
      within(dialog).getByRole("switch", { name: /arun mehta/i }),
    ).toBeInTheDocument();

    await user.click(
      within(dialog).getByRole("button", { name: /remove arun mehta/i }),
    );

    await waitFor(() =>
      expect(
        within(dialog).queryByRole("switch", { name: /arun mehta/i }),
      ).not.toBeInTheDocument(),
    );
    expect(
      within(dialog).getByRole("switch", { name: /priya raman/i }),
    ).toBeInTheDocument();
  });

  it("has no detectable accessibility violations while open", async () => {
    const { user, container } = renderBoard();

    await openEditor(user, "Priya Raman");

    await expect(axe(container)).resolves.toHaveNoViolations();
  });
});
