import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import { BrowserRouter as Router } from "react-router-dom";
import Breadcrumbs from "./";

describe("Breadcrumbs Component", () => {
  it("renders with default props", () => {
    render(
      <Router>
        <Breadcrumbs last="Last" />
      </Router>
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Last")).toBeInTheDocument();
  });

  it("renders with custom props", () => {
    render(
      <Router>
        <Breadcrumbs
          items={["Custom1", "Custom2", "Custom3"]}
          last="LastCustom"
          pathes={["/custom1", "/custom2", "/custom3"]}
          to="/custom-last"
        />
      </Router>
    );

    expect(screen.getByText("Custom1")).toBeInTheDocument();
    expect(screen.getByText("Custom2")).toBeInTheDocument();
    expect(screen.getByText("Custom3")).toBeInTheDocument();
    expect(screen.getByText("LastCustom")).toBeInTheDocument();
  });

  it("navigates correctly with React Router", () => {
    render(
      <Router>
        <Breadcrumbs
          items={["Home", "Category"]}
          last="Product"
          pathes={["/", "/category"]}
          to="/product"
        />
      </Router>
    );

    expect(screen.getByText("Home").getAttribute("href")).toBe("/");
    expect(screen.getByText("Category").getAttribute("href")).toBe("/category");
    expect(screen.getByText("Product").getAttribute("href")).toBe("/product");
  });
});
