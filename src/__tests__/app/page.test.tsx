import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Home", () => {
  it("renders the blog heading", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { name: /blog/i })).toBeInTheDocument();
  });
});
