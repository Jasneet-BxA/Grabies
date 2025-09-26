import bcrypt from "bcrypt";
import { signupService, loginService } from "../services/authService.js"; // adjust path
import { supabase } from "../config/supabaseClient.js";
import { generateToken } from "../utils/jwt.js";

jest.mock("../config/supabaseClient", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(),
      eq: jest.fn(),
      single: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
    })),
  },
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock("../utils/jwt", () => ({
  generateToken: jest.fn(),
}));

describe("Auth Service", () => {
  const mockUserData = {
    name: "John Doe",
    email: "john@example.com",
    password: "secure123",
    contact: "1234567890",
    dob: "1990-01-01",
    address: {
      address_line: "123 Street",
      city: "Cityville",
      state: "State",
      pincode: "12345",
    },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("signupService", () => {
    it("should sign up a new user successfully", async () => {
      (supabase.from as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: { code: "PGRST116" } }), // No existing user
      });

      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password");

      // insert user
      (supabase.from as jest.Mock).mockReturnValueOnce({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { id: "user123", name: "John Doe", email: "john@example.com" },
        }),
      });

      // insert address
      (supabase.from as jest.Mock).mockReturnValueOnce({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { id: "address456" },
        }),
      });

      // update user with address_id
      (supabase.from as jest.Mock).mockReturnValueOnce({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ error: null }),
      });

      const result = await signupService(mockUserData);

      expect(result).toEqual({
        id: "user123",
        name: "John Doe",
        email: "john@example.com",
        address_id: "address456",
      });
    });

    it("should throw if email already exists", async () => {
      (supabase.from as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { id: "existingUser" },
          error: null,
        }),
      });

      await expect(signupService(mockUserData)).rejects.toThrow("Email already exists");
    });

    it("should throw if insert user fails", async () => {
      (supabase.from as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: { code: "PGRST116" } }),
      });

      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password");

      (supabase.from as jest.Mock).mockReturnValueOnce({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ error: "Insert error", data: null }),
      });

      await expect(signupService(mockUserData)).rejects.toThrow("Failed to create user");
    });
  });

  describe("loginService", () => {
    it("should login user with correct credentials", async () => {
      (supabase.from as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: {
            id: "user123",
            name: "John Doe",
            email: "john@example.com",
            password: "hashed-password",
          },
        }),
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (generateToken as jest.Mock).mockReturnValue("mocked-jwt-token");

      const result = await loginService({
        email: "john@example.com",
        password: "secure123",
      });

      expect(result).toEqual({
        user: {
          id: "user123",
          name: "John Doe",
          email: "john@example.com",
        },
        token: "mocked-jwt-token",
      });
    });

    it("should throw on invalid email", async () => {
      (supabase.from as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: "not found",
        }),
      });

      await expect(
        loginService({ email: "wrong@example.com", password: "123" })
      ).rejects.toThrow("Invalid email or password");
    });

    it("should throw on invalid password", async () => {
      (supabase.from as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: {
            id: "user123",
            name: "John Doe",
            email: "john@example.com",
            password: "hashed-password",
          },
        }),
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        loginService({ email: "john@example.com", password: "wrongpass" })
      ).rejects.toThrow("Invalid email or password");
    });
  });
});
