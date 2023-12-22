import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Footer from "./";
import "@testing-library/jest-dom/extend-expect";

const mockStore = configureStore([]);

describe("Footer Component", () => {
  it("renders correctly", () => {
    const initialState = {
      category: {
        categoryData: [],
        status: "success",
      },
    };

    const store = mockStore(initialState);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Footer />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Catalog")).toBeInTheDocument();
    expect(screen.getByText("Events")).toBeInTheDocument();
    expect(screen.getByText("Payment")).toBeInTheDocument();
    expect(screen.getByText("+48 730 562 141")).toBeInTheDocument();
  });
});
