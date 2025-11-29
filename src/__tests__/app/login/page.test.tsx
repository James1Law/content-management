import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "@/app/login/page";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";

// Mock the auth provider
jest.mock("@/components/providers/AuthProvider", () => ({
  useAuth: jest.fn(),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("LoginPage", () => {
  const mockSignInWithEmail = jest.fn();
  const mockSignInWithGoogle = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it("renders login form with email and password inputs", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: false,
      isAuthorized: false,
      signInWithEmail: mockSignInWithEmail,
      signInWithGoogle: mockSignInWithGoogle,
    });

    render(<LoginPage />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^sign in$/i })).toBeInTheDocument();
  });

  it("renders Google sign in button", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: false,
      isAuthorized: false,
      signInWithEmail: mockSignInWithEmail,
      signInWithGoogle: mockSignInWithGoogle,
    });

    render(<LoginPage />);

    expect(screen.getByRole("button", { name: /google/i })).toBeInTheDocument();
  });

  it("shows loading state", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: true,
      isAuthorized: false,
      signInWithEmail: mockSignInWithEmail,
      signInWithGoogle: mockSignInWithGoogle,
    });

    render(<LoginPage />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("redirects to /admin when user is authorized", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { email: "admin@example.com" },
      loading: false,
      isAuthorized: true,
      signInWithEmail: mockSignInWithEmail,
      signInWithGoogle: mockSignInWithGoogle,
    });

    render(<LoginPage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/admin");
    });
  });

  it("calls signInWithEmail when form is submitted", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: false,
      isAuthorized: false,
      signInWithEmail: mockSignInWithEmail,
      signInWithGoogle: mockSignInWithGoogle,
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /^sign in$/i }));

    await waitFor(() => {
      expect(mockSignInWithEmail).toHaveBeenCalledWith("test@example.com", "password123");
    });
  });

  it("calls signInWithGoogle when Google button is clicked", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: false,
      isAuthorized: false,
      signInWithEmail: mockSignInWithEmail,
      signInWithGoogle: mockSignInWithGoogle,
    });

    render(<LoginPage />);

    fireEvent.click(screen.getByRole("button", { name: /google/i }));

    await waitFor(() => {
      expect(mockSignInWithGoogle).toHaveBeenCalled();
    });
  });

  it("shows error message when sign in fails", async () => {
    mockSignInWithEmail.mockRejectedValue(new Error("Invalid credentials"));

    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: false,
      isAuthorized: false,
      signInWithEmail: mockSignInWithEmail,
      signInWithGoogle: mockSignInWithGoogle,
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: /^sign in$/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/invalid credentials/i);
    });
  });

  it("shows unauthorized message when user is logged in but not authorized", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { email: "wrong@example.com" },
      loading: false,
      isAuthorized: false,
      signInWithEmail: mockSignInWithEmail,
      signInWithGoogle: mockSignInWithGoogle,
    });

    render(<LoginPage />);

    expect(screen.getByRole("heading", { name: /not authorized/i })).toBeInTheDocument();
  });
});
