import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import NavBar from '../components/NavBar';
import * as cookieService from '../services/cookies';

// Mock the cookies service
vi.mock('../services/cookies', () => ({
  isLoggedIn: vi.fn(),
  getToken: vi.fn(),
  clearToken: vi.fn(),
}));

describe('NavBar Component', () => {
  it('renders the brand name NFSE', () => {
    // Mock isLoggedIn to return false
    vi.mocked(cookieService.isLoggedIn).mockReturnValue(false);

    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );
    
    expect(screen.getByText('NFSE')).toBeInTheDocument();
  });

  it('renders Login and Register links when not logged in', () => {
    vi.mocked(cookieService.isLoggedIn).mockReturnValue(false);

    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
    expect(screen.queryByText('Cart')).not.toBeInTheDocument();
  });
});
