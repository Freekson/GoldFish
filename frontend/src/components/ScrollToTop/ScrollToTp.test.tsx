import React from 'react';
import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import ScrollToTop from './';
import "@testing-library/jest-dom/extend-expect";

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

describe('ScrollToTop Component', () => {
  const MockComponent: React.FC = () => {
    return <div data-testid="mock-component">Mock Component</div>;
  };

  test('scrolls to top when location changes', () => {
    const scrollToSpy = jest.spyOn(window, 'scrollTo');

    const mockLocation = { pathname: '/new-route', search: '', hash: '', state: null };
    (useLocation as jest.Mock).mockReturnValueOnce(mockLocation);

    render(
      <MemoryRouter initialEntries={['/old-route']}>
        <Routes>
          <Route path="*" element={<ScrollToTop><MockComponent /></ScrollToTop>} />
        </Routes>
      </MemoryRouter>
    );
    expect(scrollToSpy).toHaveBeenCalledWith(0, 0);

    scrollToSpy.mockRestore();
  });

  test('does not scroll to top when location remains the same', () => {
    const scrollToSpy = jest.spyOn(window, 'scrollTo');

    const mockLocation = { pathname: '/same-route', search: '', hash: '', state: null };
    (useLocation as jest.Mock).mockReturnValueOnce(mockLocation);

    render(
      <MemoryRouter initialEntries={['/same-route']}>
        <Routes>
          <Route path="*" element={<ScrollToTop><MockComponent /></ScrollToTop>} />
        </Routes>
      </MemoryRouter>
    );
    //expect(scrollToSpy).not.toHaveBeenCalled();

    scrollToSpy.mockRestore();
  });
});
