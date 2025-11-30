import { render, screen, waitFor } from "@testing-library/react";
import AdminLayout from "@/app/admin/layout";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter, usePathname } from "next/navigation";

jest.mock("@/components/providers/AuthProvider", () => ({
  useAuth: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

describe("AdminLayout", () => {
  const mockPush = jest.fn();
  const mockSignOut = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (usePathname as jest.Mock).mockReturnValue("/admin");
  });

  it("shows loading state while auth is loading", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: true,
      isAuthorized: false,
      signOut: mockSignOut,
    });

    render(
      <AdminLayout>
        <div>Admin content</div>
      </AdminLayout>
    );

    expect(screen.getByText(/initializing/i)).toBeInTheDocument();
  });

  it("redirects to /login when user is not authenticated", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: false,
      isAuthorized: false,
      signOut: mockSignOut,
    });

    render(
      <AdminLayout>
        <div>Admin content</div>
      </AdminLayout>
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });

  it("redirects to /login when user is not authorized", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { email: "wrong@example.com" },
      loading: false,
      isAuthorized: false,
      signOut: mockSignOut,
    });

    render(
      <AdminLayout>
        <div>Admin content</div>
      </AdminLayout>
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });

  it("renders children when user is authorized", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { email: "admin@example.com" },
      loading: false,
      isAuthorized: true,
      signOut: mockSignOut,
    });

    render(
      <AdminLayout>
        <div>Admin content</div>
      </AdminLayout>
    );

    expect(screen.getByText("Admin content")).toBeInTheDocument();
  });

  it("shows admin header with navigation", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { email: "admin@example.com" },
      loading: false,
      isAuthorized: true,
      signOut: mockSignOut,
    });

    render(
      <AdminLayout>
        <div>Admin content</div>
      </AdminLayout>
    );

    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign out/i })).toBeInTheDocument();
  });
});
