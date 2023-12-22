import React from "react";
import { render, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, Routes, Route, useLocation } from "react-router-dom";
import ScrollToTop from "./";

// Use jest.spyOn to mock window.scrollTo
const scrollToSpy = jest.spyOn(window, "scrollTo");

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
}));

describe("ScrollToTop Component", () => {
  const MockComponent: React.FC = () => {
    return <div data-testid="mock-component">Mock Component</div>;
  };

  afterEach(() => {
    // Clean up the mock after each test
    jest.clearAllMocks();
  });

  test("scrolls to top when location changes", async () => {
    const mockLocation = {
      pathname: "/new-route",
      search: "",
      hash: "",
      state: null,
    };
    (useLocation as jest.Mock).mockReturnValueOnce(mockLocation);

    render(
      <MemoryRouter initialEntries={["/old-route"]}>
        <Routes>
          <Route
            path="*"
            element={
              <ScrollToTop>
                <MockComponent />
              </ScrollToTop>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    // Use await to wait for asynchronous updates
    await act(async () => {
      expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
    });
  });
});
