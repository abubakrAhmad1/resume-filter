import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "./Button";

// Type assertion helper for test matchers
declare module "vitest" {
  interface Assertion<T = any> {
    toBeInTheDocument(): T;
    toBeDisabled(): T;
  }
}

describe("Button Component", () => {
  it("renders button with children", () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    fireEvent.click(screen.getByText("Click Me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("disables button when disabled prop is true", () => {
    render(<Button disabled>Click Me</Button>);
    expect(screen.getByText("Click Me")).toBeDisabled();
  });

  it("shows loading state when loading prop is true", () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByText("Loading");
    expect(button).toBeDisabled();
    // Check for spinner (SVG element)
    expect(button.querySelector("svg")).toBeInTheDocument();
  });

  it("renders icon when provided", () => {
    const icon = <span data-testid="icon">Icon</span>;
    render(<Button icon={icon}>Button</Button>);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });
});
