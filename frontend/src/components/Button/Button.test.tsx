import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Button from "./";

describe("Button Component", () => {
  it("renders with default type", () => {
    render(<Button text="Click me" to="/path" />);

    const buttonElement = screen.getByText("Click me");

    expect(buttonElement).toHaveStyle("color: rgb\\(249, 164, 63\\)");
  });

  it("renders with active type", () => {
    render(<Button text="Click me" to="/path" type="active" />);

    const buttonElement = screen.getByText("Click me");

    expect(buttonElement).toHaveStyle("color: rgb\\(0, 0, 0\\)");
  });

  it("renders with inactive type", () => {
    render(<Button text="Click me" to="/path" type="inactive" />);

    const buttonElement = screen.getByText("Click me");

    expect(buttonElement).toHaveStyle("color: rgb\\(255, 255, 255\\)");
  });

  it("renders with the correct link", () => {
    render(<Button text="Click me" to="/path" />);

    expect(screen.getByRole("link", { name: "Click me" })).toHaveAttribute(
      "href",
      "/path"
    );
  });
});
