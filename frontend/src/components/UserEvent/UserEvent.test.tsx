import React from "react";
import { render, screen } from "@testing-library/react";
import UserEvent from "./";
import "@testing-library/jest-dom/extend-expect";

describe("UserEvent component", () => {
  it("renders event details correctly", () => {
    render(<UserEvent />);

    expect(screen.getByText("Halloween")).toBeInTheDocument();

    expect(
      screen.getByText("September 31, 2023, 17:00")
    ).toBeInTheDocument();

    expect(screen.getByText("More details")).toBeInTheDocument();
  });

  it("renders the correct image alt text", () => {
    render(<UserEvent />);

    const image = screen.getByAltText("game-1");
    expect(image).toBeInTheDocument();
  });

  it("navigates to the correct link when 'More details' button is clicked", () => {
    render(<UserEvent />);

    const link = screen.getByText("More details").closest("a");
    expect(link).toHaveAttribute("href", "/events/1");
  });
});
