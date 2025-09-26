// src/components/auth/__tests__/LoginForm.test.tsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../LoginForm';
import { BrowserRouter } from 'react-router-dom';
import * as api from '@/lib/api';

// ✅ Create a mock for setUser to track calls
const mockSetUser = jest.fn();

// ✅ Mock useAuth hook from AuthContext
jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    setUser: mockSetUser,
    isAuthenticated: false,
  }),
}));

// ✅ Mock useNavigate from react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// ✅ Mock login API
jest.mock('@/lib/api', () => ({
  login: jest.fn(),
}));

// ✅ Helper to wrap component in Router
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form fields and login button', () => {
    renderWithRouter(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('shows validation errors when fields are empty', async () => {
    renderWithRouter(<LoginForm />);
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText(/enter a valid email address/i)).toBeInTheDocument();
    expect(await screen.findByText(/password must be at least 6 characters/i)).toBeInTheDocument();
  });

  it('submits the form and sets user on successful login', async () => {
    const mockUser = { id: 1, name: 'Test User' };
    (api.login as jest.Mock).mockResolvedValueOnce({
      data: { user: mockUser },
    });

    renderWithRouter(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: '123456' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(api.login).toHaveBeenCalledWith('test@example.com', '123456');
      expect(mockSetUser).toHaveBeenCalledWith(mockUser);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('shows alert on failed login', async () => {
    window.alert = jest.fn();

    (api.login as jest.Mock).mockRejectedValueOnce(new Error('Invalid credentials'));

    renderWithRouter(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpass' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Login failed. Please check your credentials.');
    });
  });
});
