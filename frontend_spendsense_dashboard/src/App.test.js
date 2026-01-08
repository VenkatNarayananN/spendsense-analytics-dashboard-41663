import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders login when not authenticated (protected routes redirect)", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: /sign in/i })).toBeInTheDocument();
});

test("login screen contains primary sign-in action", () => {
  render(<App />);
  expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
});
