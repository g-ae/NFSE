import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import BundleCard from '../components/BundleCard';
import * as api from '../services/api';
import * as cookies from '../services/cookies';

// Mock the services
vi.mock('../services/api', () => ({
  reserveBundle: vi.fn(),
  unreserveBundle: vi.fn(),
  getIsRatedFrom: vi.fn().mockResolvedValue(false),
  postRate: vi.fn(),
  getSeller: vi.fn().mockResolvedValue({
    name: 'Test Seller',
    address: '123 Test St',
    npa: '1000',
    city: 'Lausanne',
    state: 'Vaud'
  }),
}));

vi.mock('../services/cookies', () => ({
  isLoggedIn: vi.fn(),
  getToken: vi.fn(),
}));

describe('BundleCard Component', () => {
  const mockBundle = {
    bundleId: 1,
    content: 'Fresh Vegetables',
    price: 15,
    image_url: 'test-image.jpg',
    pickupStartTime: '2026-01-12T10:00:00Z',
    pickupEndTime: '2026-01-12T12:00:00Z',
    sellerId: 101,
    latitude: 46.5197,
    longitude: 6.6323,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders bundle basic information', async () => {
    vi.mocked(cookies.isLoggedIn).mockReturnValue(false);

    render(
      <MemoryRouter>
        <BundleCard bundle={mockBundle} />
      </MemoryRouter>
    );

    expect(screen.getByText('Fresh Vegetables')).toBeInTheDocument();
    expect(screen.getByText('15€')).toBeInTheDocument();
    
    // Check if seller name appears after async load
    await waitFor(() => {
      expect(screen.getByText('Test Seller')).toBeInTheDocument();
    });
  });

  it('calculates and displays distance if userLocation is provided', () => {
    vi.mocked(cookies.isLoggedIn).mockReturnValue(false);
    const userLocation = { latitude: 46.52, longitude: 6.63 };

    render(
      <MemoryRouter>
        <BundleCard bundle={mockBundle} userLocation={userLocation} />
      </MemoryRouter>
    );

    // 46.5197, 6.6323 to 46.52, 6.63 is roughly 0.2km
    expect(screen.getByText(/📍 [0-9.]+ km/)).toBeInTheDocument();
  });

  it('shows "Cart" button for Buyer', async () => {
    vi.mocked(cookies.isLoggedIn).mockReturnValue(true);
    vi.mocked(cookies.getToken).mockReturnValue('b-some-token');
    
    // We need to mock getAccountTypeFromToken too or just let it run if it's imported
    // Since it's from ../services/utils, let's see if we need to mock it.
    // In BundleCard.jsx: import { getAccountTypeFromToken } from "../services/utils";

    render(
      <MemoryRouter>
        <BundleCard bundle={mockBundle} />
      </MemoryRouter>
    );

    await waitFor(() => {
        // The button has className "cart-btn" and contains 🛒 (icon)
        const cartBtn = screen.getByRole('button', { name: '🛒' });
        expect(cartBtn).toBeInTheDocument();
    });
  });
});
