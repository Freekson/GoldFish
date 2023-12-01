import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Footer from './';
import "@testing-library/jest-dom/extend-expect";

const mockStore = configureStore([]);

describe('Footer Component', () => {
  it('renders correctly', () => {
    const initialState = {
      category: {
        categoryData: [],
        status: 'success',
      },
    };

    const store = mockStore(initialState);

    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <Footer />
        </MemoryRouter>
      </Provider>
    );

    expect(getByText('Catalog')).toBeInTheDocument();
    expect(getByText('Events')).toBeInTheDocument();
    expect(getByText('Payment')).toBeInTheDocument();
    expect(getByText('+48 730 562 141')).toBeInTheDocument();
  });
});
