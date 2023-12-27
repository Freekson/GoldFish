import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserOrder from "./";
import { formatDate } from "../../utils/formatDate";
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom/extend-expect";

jest.mock("../../utils/formatDate");

describe("UserOrder Component", () => {
  const mockDate = "2023-12-01T12:34:56Z";

  beforeEach(() => {
    (formatDate as jest.Mock).mockReset();
  });

  test("renders order details correctly", () => {
    const orderId = "123";
    const orderStatus = "Shipped";

    (formatDate as jest.Mock).mockReturnValue("December 1, 2023");

    render(<UserOrder id={orderId} date={mockDate} status={orderStatus} />);

    expect(screen.getByText(`Order ID: ${orderId}`)).toBeInTheDocument();
    expect(screen.getByText("December 1, 2023")).toBeInTheDocument();
    expect(screen.getByText(orderStatus)).toBeInTheDocument();

    expect(screen.getByText("More details")).toHaveAttribute(
      "href",
      `profile/orders/${orderId}`
    );

    expect(formatDate).toHaveBeenCalledWith(new Date(mockDate));
  });
});
