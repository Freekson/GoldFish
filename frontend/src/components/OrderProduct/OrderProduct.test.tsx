import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import OrderProduct from "./";
import "@testing-library/jest-dom/extend-expect";

const mockProduct = {
  id: "1",
  title: "Sample Product",
  image: "sample.jpg",
  price: 20,
  quantity: 2,
};

test("OrderProduct component renders with correct data", () => {
  render(
    <BrowserRouter>
      <OrderProduct {...mockProduct} />
    </BrowserRouter>
  );

  const productLink = screen.getByRole("link", { name: /sample product/i });
  expect(productLink).toBeInTheDocument();
  expect(productLink).toHaveAttribute("href", "/product/1");

  const productImage = screen.getByRole("img", { name: /sample product/i });
  expect(productImage).toBeInTheDocument();
  expect(productImage).toHaveAttribute("src", "sample.jpg");
  expect(productImage).toHaveAttribute("alt", "Sample Product");

  expect(screen.getByText("$20")).toBeInTheDocument();
  expect(screen.getByText("2 pcs.")).toBeInTheDocument();
});
