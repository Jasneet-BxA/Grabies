import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";
import { supabase } from "../config/supabaseClient.js";
import { signupSchema, loginSchema } from "utils/zodValidators.js";

export class AuthController {
  static async signup(req: Request, res: Response) {
    try {
      const data = signupSchema.parse(req.body);
      const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("id")
        .eq("email", data.email)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        return res.status(500).json({ error: "Database error" });
      }
      if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
      }
      const hashedPassword = await bcrypt.hash(data.password, 10);

      const { data: addressData, error: addressError } = await supabase
        .from("addresses")
        .insert([data.address])
        .select("id")
        .single();

      if (addressError)
        return res.status(500).json({ error: "Failed to save address" });

      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([
          {
            name: data.name,
            email: data.email,
            password: hashedPassword,
            contact: data.contact || null,
            dob: data.dob || null,
            address_id: addressData.id,
          },
        ])
        .select('id, name, email')
        .single();

      if (insertError) {
        return res.status(500).json({ error: 'Failed to create user' });
      }

      return res.status(201).json({
        message: "Signup successful",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          address_id: addressData.id
        },
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.errors || error.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const data = loginSchema.parse(req.body);
      const { data: user, error: fetchError } = await supabase
        .from("users")
        .select("id, name, email, password")
        .eq("email", data.email)
        .single();

      if (fetchError || !user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      const isPasswordMatch = await bcrypt.compare(
        data.password,
        user.password
      );
      if (!isPasswordMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const token = generateToken({ userId: user.id, email: user.email });

      return res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 86400000,
        })
        .status(200)
        .json({
          message: "Login successful",
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        });
    } catch (error: unknown) {
        if(error instanceof Error){
            const zodError = error as {errors?: unknown[]};
            return res.status(400).json({error: zodError.errors ?? error.message})
        }else{
            return res.status(400).json({error: "An unexpected error occurred."})
        }
    }
  }
  static async logout(req: Request, res: Response){
    res.clearCookie('token');
    return res.json({message : 'Logged out successful'});
  }
}
