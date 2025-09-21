import bcrypt from "bcrypt";
import { supabase } from "../config/supabaseClient.js";
import { generateToken } from "../utils/jwt.js";
import type { SignupInput, LoginInput } from "../types/index.js";

export const signupService = async (userData: SignupInput) => {
  const { name, email, password, contact, dob, address } = userData;

  const { data: existingUser, error: fetchError } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    throw new Error("Database error");
  }

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const { data: newUser, error: insertError } = await supabase
    .from("users")
    .insert([
      {
        name,
        email,
        password: hashedPassword,
        contact: contact || null,
        dob: dob || null,
      },
    ])
    .select("id, name, email")
    .single();

  if (insertError || !newUser) {
    throw new Error("Failed to create user");
  }
  const { data: addressData, error: addressError } = await supabase
    .from("addresses")
    .insert([{ ...address, user_id: newUser.id }])
    .select("id")
    .single();

  if (addressError) {
    throw new Error("Failed to save address");
  }
  const { error: updateUserError } = await supabase
    .from("users")
    .update({ address_id: addressData.id })
    .eq("id", newUser.id);

  if (updateUserError) {
    throw new Error("Failed to link address to user");
  }

  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    address_id: addressData.id,
  };
};

export const loginService = async ({ email, password }: LoginInput) => {
  const { data: user, error: fetchError } = await supabase
    .from("users")
    .select("id, name, email, password")
    .eq("email", email)
    .single();

  if (fetchError || !user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken({ userId: user.id, email: user.email });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  };
};
