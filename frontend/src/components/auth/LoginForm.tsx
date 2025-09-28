import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { login } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must be under 32 characters")
    .regex(/[a-z]/, "Include at least one lowercase letter")
    .regex(/[A-Z]/, "Include at least one uppercase letter")
    .regex(/[0-9]/, "Include at least one number")
    .regex(/[^a-zA-Z0-9]/, "Include at least one special character"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange", 
  });

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await login(data.email, data.password);
      setUser(res.data.user);
      navigate("/");
    } catch (err: any) {
      if (err.response) {
        if (err.response.status === 401) {
          toast.error("⚠️ Invalid email or password");
        } else {
          toast.error(`⚠️ Server error: ${err.response.status}`);
        }
      } else if (err.request) {
        toast.error("⚠️ Network error. Please check your internet connection.");
      } else {
        toast.error("⚠️ Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center px-4"
      style={{
        backgroundImage:
          'url("https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1470&q=80")',
      }}
    >
      <Card className="w-full max-w-md shadow-lg backdrop-blur-sm bg-white/80">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login to Grabies</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to continue
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-500 text-white hover:bg-orange-600"
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
