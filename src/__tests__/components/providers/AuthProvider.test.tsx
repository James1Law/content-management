import { render, screen, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "@/components/providers/AuthProvider";
import { onAuthStateChanged, User } from "firebase/auth";

// Mock Firebase auth
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  signInWithPopup: jest.fn(),
}));

jest.mock("@/lib/firebase", () => ({
  auth: {},
}));

// Test component that consumes the auth context
function TestConsumer() {
  const { user, loading, isAuthorized } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div data-testid="user-status">
        {user ? `Logged in as ${user.email}` : "Not logged in"}
      </div>
      <div data-testid="auth-status">
        {isAuthorized ? "Authorized" : "Not authorized"}
      </div>
    </div>
  );
}

describe("AuthProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset environment variable
    process.env.NEXT_PUBLIC_AUTHORIZED_USER_EMAIL = "admin@example.com";
  });

  it("shows loading state initially", () => {
    (onAuthStateChanged as jest.Mock).mockImplementation(() => () => {});

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows not logged in when no user", async () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback(null);
      return () => {};
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("user-status")).toHaveTextContent("Not logged in");
    });
  });

  it("shows logged in user email", async () => {
    const mockUser = { email: "test@example.com" } as User;

    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback(mockUser);
      return () => {};
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("user-status")).toHaveTextContent("Logged in as test@example.com");
    });
  });

  it("shows authorized when user email matches AUTHORIZED_USER_EMAIL", async () => {
    process.env.NEXT_PUBLIC_AUTHORIZED_USER_EMAIL = "admin@example.com";
    const mockUser = { email: "admin@example.com" } as User;

    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback(mockUser);
      return () => {};
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("auth-status")).toHaveTextContent("Authorized");
    });
  });

  it("shows not authorized when user email does not match", async () => {
    process.env.NEXT_PUBLIC_AUTHORIZED_USER_EMAIL = "admin@example.com";
    const mockUser = { email: "other@example.com" } as User;

    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback(mockUser);
      return () => {};
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("auth-status")).toHaveTextContent("Not authorized");
    });
  });
});
