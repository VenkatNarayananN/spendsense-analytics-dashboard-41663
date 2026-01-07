import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders login when not authenticated (protected routes redirect)", () => {
  render(<App />);
  expect(screen.getByText(/Sign in/i)).toBeInTheDocument();
});
