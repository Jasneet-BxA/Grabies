import type { NextFunction, Request, Response } from "express";
import { signupSchema, loginSchema } from "../validators/authValidator.js";
import { signupService, loginService } from "../services/authService.js";
import type { SignupInput, LoginInput } from "../types/index.js";
const PROD = process.env.NODE_ENV === "production";
export const signup = async (req: Request, res: Response, next : NextFunction) => {
  try {
    const validatedData: SignupInput = signupSchema.parse(req.body);
    const user = await signupService(validatedData);

    return res.status(201).json({
      message: "Signup successful",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next:NextFunction) => {
  try {
    const validatedData: LoginInput = loginSchema.parse(req.body);
    const { user, token } = await loginService(validatedData);

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: PROD,
        sameSite: PROD ? 'none' : 'lax',
        maxAge: 86400000,
      })
      .status(200)
      .json({
        message: "Login successful",
        user,
      });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie('token', { path: '/', sameSite: PROD ? 'none' : 'lax', secure: PROD });
  return res.status(204).end();
};
