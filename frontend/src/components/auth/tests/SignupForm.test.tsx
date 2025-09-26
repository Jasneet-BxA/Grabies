// src/components/auth/SignupForm.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignupForm from '../SignupForm';
import { useAuth } from '@/context/AuthContext';
import { signup } from '@/lib/api';
import { BrowserRouter } from 'react-router-dom';

// ✅ Mock navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// ✅ Mock signup API
jest.mock('@/lib/api', () => ({
  signup: jest.fn(),
}));

// ✅ Mock AuthContext
jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    setUser: jest.fn(),
  }),
}));

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('SignupForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders form fields', () => {
    renderWithRouter(<SignupForm />);
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contact Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Address Line/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Pincode/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/State/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  test('shows validation errors if fields are empty', async () => {
    renderWithRouter(<SignupForm />);
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Enter a valid email/i)).toBeInTheDocument();
      expect(screen.getByText(/Password must be at least 6 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/Invalid contact number/i)).toBeInTheDocument();
      expect(screen.getByText(/Address is required/i)).toBeInTheDocument();
    });
  });

  test('submits form successfully', async () => {
    (signup as jest.Mock).mockResolvedValue({
      data: { user: { id: 1, name: 'Test User' } },
    });

    renderWithRouter(<SignupForm />);

    fireEvent.input(screen.getByLabelText(/Name/i), { target: { value: 'John' } });
    fireEvent.input(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.input(screen.getByLabelText(/Contact Number/i), { target: { value: '1234567890' } });
    fireEvent.input(screen.getByLabelText(/Address Line/i), { target: { value: '123 Street' } });
    fireEvent.input(screen.getByLabelText(/City/i), { target: { value: 'New York' } });
    fireEvent.input(screen.getByLabelText(/Pincode/i), { target: { value: '10001' } });
    fireEvent.input(screen.getByLabelText(/State/i), { target: { value: 'NY' } });
    fireEvent.input(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(signup).toHaveBeenCalledWith(expect.objectContaining({ email: 'john@example.com' }));
      expect(mockNavigate).toHaveBeenCalledWith('/auth/login');
    });
  });

  test('shows alert on failed signup', async () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    (signup as jest.Mock).mockRejectedValue(new Error('Signup failed'));

    renderWithRouter(<SignupForm />);

    fireEvent.input(screen.getByLabelText(/Name/i), { target: { value: 'John' } });
    fireEvent.input(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.input(screen.getByLabelText(/Contact Number/i), { target: { value: '1234567890' } });
    fireEvent.input(screen.getByLabelText(/Address Line/i), { target: { value: '123 Street' } });
    fireEvent.input(screen.getByLabelText(/City/i), { target: { value: 'New York' } });
    fireEvent.input(screen.getByLabelText(/Pincode/i), { target: { value: '10001' } });
    fireEvent.input(screen.getByLabelText(/State/i), { target: { value: 'NY' } });
    fireEvent.input(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(signup).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Signup failed. Try again.');
    });
  });
});
