import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Login from '../pages/Login';
import * as api from '../services/api';
import * as cookies from '../services/cookies';

// Mock the services
vi.mock('../services/api', () => ({
  loginBuyer: vi.fn(),
  loginSeller: vi.fn(),
}));

vi.mock('../services/cookies', () => ({
  saveToken: vi.fn(),
}));

describe('Login Page', () => {
  // Mock window.location
  const originalLocation = window.location;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup window.location mock to test redirection
    delete window.location;
    window.location = { href: '' };
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  it('renders login form correctly', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Buyer')).toBeChecked(); // Default role
    expect(screen.getByLabelText('Seller')).not.toBeChecked();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('updates input fields correctly', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const sellerRadio = screen.getByLabelText('Seller');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(sellerRadio);

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
    expect(sellerRadio).toBeChecked();
  });

  it('handles successful buyer login', async () => {
    const mockToken = 'mock-buyer-token';
    vi.mocked(api.loginBuyer).mockResolvedValue({ token: mockToken });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'buyer@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'pass123' } });
    
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(api.loginBuyer).toHaveBeenCalledWith({
        username: 'buyer@test.com',
        email: 'buyer@test.com',
        password: 'pass123',
        role: 'buyer'
      });
      expect(cookies.saveToken).toHaveBeenCalledWith(mockToken);
      expect(window.location.href).toBe('/');
    });
  });

  it('handles successful seller login', async () => {
    const mockToken = 'mock-seller-token';
    vi.mocked(api.loginSeller).mockResolvedValue({ token: mockToken });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'seller@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'pass123' } });
    fireEvent.click(screen.getByLabelText('Seller'));
    
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(api.loginSeller).toHaveBeenCalledWith({
        username: 'seller@test.com',
        email: 'seller@test.com',
        password: 'pass123',
        role: 'seller'
      });
      expect(cookies.saveToken).toHaveBeenCalledWith(mockToken);
      expect(window.location.href).toBe('/');
    });
  });

  it('displays error message on failed login', async () => {
    vi.mocked(api.loginBuyer).mockResolvedValue(null);

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'wrong@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongpass' } });
    
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password. Please try again.')).toBeInTheDocument();
      expect(cookies.saveToken).not.toHaveBeenCalled();
    });
  });
});
