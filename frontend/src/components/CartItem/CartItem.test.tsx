import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import CartItem from "./";
import { addItem, deleteItem, minusItem } from "../../redux/cart/slice";
import { MemoryRouter } from "react-router-dom";

const mockStore = configureStore([]);

describe("CartItem Component", () => {
  const game = {
    _id: "123",
    title: "Game title",
    slug: "game-slug",
    category: "game-category",
    description: "game-description",
    image_link: "game-link",
    price: 34,
    average_rating: 4,
    review_count: 100,
    publisher: "game-publisher",
    release_year: 2023,
  };

  it("renders CartItem correctly", () => {
    const store = mockStore({});
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CartItem
            img="image.jpg"
            name="Game Name"
            price={29.99}
            quantity={2}
            game={game}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Game Name")).toBeInTheDocument();
    expect(screen.getByAltText("Game Name")).toBeInTheDocument();
  });

  it('calls addToCart when the "+" button is clicked', () => {
    const store = mockStore({});
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CartItem
            img="image.jpg"
            name="Game Name"
            price={29.99}
            quantity={2}
            game={game}
          />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText("+"));

    const actions = store.getActions();
    expect(actions).toContainEqual(addItem(game));
  });

  it('calls minusCartItem when the "-" button is clicked', () => {
    const store = mockStore({});
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CartItem
            img="image.jpg"
            name="Game Name"
            price={29.99}
            quantity={2}
            game={game}
          />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText("-"));

    const actions = store.getActions();
    expect(actions).toContainEqual(minusItem(game));
  });

  it("calls deleteCartItem when the delete button is clicked", () => {
    const store = mockStore({});
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CartItem
            img="image.jpg"
            name="Game Name"
            price={29.99}
            quantity={2}
            game={game}
          />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByTestId("delete-button"));

    const actions = store.getActions();
    expect(actions).toContainEqual(deleteItem(game));
  });
});
