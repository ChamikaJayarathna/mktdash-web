import { afterEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithProviders } from "@/test/utils/renderWithProviders";
import { resetVerificationAttempts } from "../api/verifyEmailService";
import {
  PLACEHOLDER_VERIFICATION_CODE,
  PLACEHOLDER_VERIFIED_REDIRECT,
} from "../api/verifyEmailPlaceholderData";
import VerifyEmailForm from "./VerifyEmailForm";

const replace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace,
    push: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
}));

const renderForm = () =>
  renderWithProviders(<VerifyEmailForm email="priya@acme.co" />);

const codeField = (): HTMLElement =>
  screen.getByLabelText(/6-digit verification code/i);

const confirmButton = (): HTMLElement =>
  screen.getByRole("button", { name: /confirm email/i });

describe("VerifyEmailForm", () => {
  afterEach(() => {
    resetVerificationAttempts();
    replace.mockReset();
  });

  it("sends the operator to the dashboard when the correct code is confirmed", async () => {
    const { user } = renderForm();

    await user.type(codeField(), PLACEHOLDER_VERIFICATION_CODE);
    await user.click(confirmButton());

    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith(PLACEHOLDER_VERIFIED_REDIRECT);
    });
  });

  it("waits for the confirm button rather than verifying on the last digit", async () => {
    const { user } = renderForm();

    await user.type(codeField(), PLACEHOLDER_VERIFICATION_CODE);

    expect(replace).not.toHaveBeenCalled();
    expect(codeField()).toHaveValue(PLACEHOLDER_VERIFICATION_CODE);
  });

  it("explains an incorrect code and clears the boxes to retry", async () => {
    const { user } = renderForm();

    await user.type(codeField(), "111111");
    await user.click(confirmButton());

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /that code is not right/i,
    );
    expect(codeField()).toHaveValue("");
    expect(replace).not.toHaveBeenCalled();
  });

  it("asks for the full code before it will submit a partial one", async () => {
    const { user } = renderForm();

    await user.type(codeField(), "123");
    await user.click(confirmButton());

    expect(
      await screen.findByText(/enter the 6-digit code from your email/i),
    ).toBeVisible();
    expect(replace).not.toHaveBeenCalled();
  });

  it("ignores non-numeric input rather than accepting it", async () => {
    const { user } = renderForm();

    await user.type(codeField(), "abcdef");

    expect(codeField()).toHaveValue("");
  });

  it("holds the resend control on a countdown after a code is sent", async () => {
    const { user } = renderForm();

    await user.click(screen.getByRole("button", { name: /resend code/i }));

    const resendButton = await screen.findByRole("button", {
      name: /resend in/i,
    });

    expect(resendButton).toBeDisabled();
    expect(
      screen.getByText(/a new code is on its way to priya@acme\.co/i),
    ).toBeVisible();
  });

  it("has no accessibility violations", async () => {
    const { container } = renderForm();

    expect(await axe(container)).toHaveNoViolations();
  });
});
