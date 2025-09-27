import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import Profile from "@/pages/Profile";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile, logout, getUserAddress, addUserNewAddress } from "@/lib/api";
import { BrowserRouter as Router } from "react-router-dom";

// ✅ Mock hooks & APIs
jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/lib/api", () => ({
  getUserProfile: jest.fn(),
  getUserAddress: jest.fn(),
  addUserNewAddress: jest.fn(),
  logout: jest.fn(),
}));

// ✅ Mock icons
jest.mock("react-icons/fa", () => ({
  FaUserCircle: () => <span data-testid="user-icon">👤</span>,
}));

// Helper to render with Router
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<Router>{ui}</Router>);
};

describe("Profile Component", () => {
  const mockProfile = {
    name: "John Doe",
    email: "john@example.com",
    contact: "1234567890",
    address: {
      address_line: "123 Street",
      city: "City",
      state: "State",
      pincode: "123456",
    },
  };

  const mockAddresses = [
    {
      address_line: "123 Street",
      city: "City",
      state: "State",
      pincode: "123456",
    },
  ];

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      setUser: jest.fn(),
    });

    (getUserProfile as jest.Mock).mockResolvedValue(mockProfile);
    (getUserAddress as jest.Mock).mockResolvedValue(mockAddresses);
    (addUserNewAddress as jest.Mock).mockResolvedValue({
      address: {
        address_line: "456 New Ave",
        city: "New City",
        state: "New State",
        pincode: "654321",
      },
    });

    (logout as jest.Mock).mockResolvedValue({});
  });

  it("renders Profile icon if authenticated", () => {
    renderWithRouter(<Profile />);
    expect(screen.getByLabelText("Open profile")).toBeInTheDocument();
  });

  it("opens profile sheet and loads data", async () => {
    renderWithRouter(<Profile />);

    fireEvent.click(screen.getByLabelText("Open profile"));

    await waitFor(() => {
      expect(getUserProfile).toHaveBeenCalled();
      expect(getUserAddress).toHaveBeenCalled();
    });

    expect(screen.getByText("👋 Welcome, John Doe")).toBeInTheDocument();
  });

  it("shows account details when 'My Account' clicked", async () => {
    renderWithRouter(<Profile />);
    fireEvent.click(screen.getByLabelText("Open profile"));

    await screen.findByText("👋 Welcome, John Doe");

    fireEvent.click(screen.getByText("👤 My Account"));

    expect(await screen.findByDisplayValue("John Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("john@example.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("1234567890")).toBeInTheDocument();
  });

  it("shows address section and saved addresses", async () => {
    renderWithRouter(<Profile />);
    fireEvent.click(screen.getByLabelText("Open profile"));

    await screen.findByText("👋 Welcome, John Doe");

    fireEvent.click(screen.getByText("🏠 Address"));

    expect(await screen.findByText("Saved Addresses")).toBeInTheDocument();

    const savedAddressesContainer = screen.getByText("Saved Addresses").closest("div");
    const { getByText } = within(savedAddressesContainer!);

    expect(getByText(/123 Street/)).toBeInTheDocument();
    expect(getByText(/City/)).toBeInTheDocument();
    expect(getByText(/State/)).toBeInTheDocument();
    expect(getByText(/123456/)).toBeInTheDocument();
  });

  it("adds new address", async () => {
    renderWithRouter(<Profile />);
    fireEvent.click(screen.getByLabelText("Open profile"));

    await screen.findByText("👋 Welcome, John Doe");

    fireEvent.click(screen.getByText("🏠 Address"));
    fireEvent.click(screen.getByText("Add New Address"));

    fireEvent.change(screen.getByPlaceholderText("Address Line"), {
      target: { value: "456 New Ave" },
    });
    fireEvent.change(screen.getByPlaceholderText("City"), {
      target: { value: "New City" },
    });
    fireEvent.change(screen.getByPlaceholderText("State"), {
      target: { value: "New State" },
    });
    fireEvent.change(screen.getByPlaceholderText("Pincode"), {
      target: { value: "654321" },
    });

    fireEvent.click(screen.getByText("Save Address"));

    await waitFor(() => {
      expect(addUserNewAddress).toHaveBeenCalledWith({
        address_line: "456 New Ave",
        city: "New City",
        state: "New State",
        pincode: "654321",
      });
    });
  });

  it("calls logout and redirects", async () => {
    renderWithRouter(<Profile />);
    fireEvent.click(screen.getByLabelText("Open profile"));

    await screen.findByText("👋 Welcome, John Doe");

    fireEvent.click(screen.getByText("Logout"));

    await waitFor(() => {
      expect(logout).toHaveBeenCalled();
    });
  });
});
