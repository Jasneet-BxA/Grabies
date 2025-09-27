import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { signup } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

// Schema
const signupSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  contact: z.string().min(10, 'Invalid contact number'),
  address: z.object({
    address_line: z.string().min(5, 'Address is required'),
    city: z.string().min(2, 'City is required'),
    pincode: z.string().min(4, 'Pincode is required'),
    state: z.string().min(2, 'State is required'),
  }),
})

type SignupFormValues = z.infer<typeof signupSchema>

export default function SignupForm() {
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form

  const { setUser } = useAuth()
  const navigate = useNavigate()

  const onSubmit = async (data: SignupFormValues) => {
    try {
      const res = await signup(data)
      setUser(res.data.user)
      navigate('/auth/login')
    } catch (err) {
      toast(' ⚠️ User already exists');
    }
  }

  return (
    <div className="relative min-h-screen w-full">
      {/* 🔥 Full screen background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1470&q=80")',
        }}
      ></div>

      {/* 🔲 Form Content over background */}
      <div className="relative z-10 flex justify-center items-center min-h-screen px-4 py-10">
        <Card className="w-full max-w-sm shadow-xl backdrop-blur-sm bg-white/80">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Create an Account</CardTitle>
            <CardDescription className="text-center">
              Join Grabies to order delicious food!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...register('name')} />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register('email')} />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>

              {/* Contact */}
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Number</Label>
                <Input id="contact" type="text" {...register('contact')} />
                {errors.contact && <p className="text-sm text-red-500">{errors.contact.message}</p>}
              </div>

              {/* Address Line */}
              <div className="space-y-2">
                <Label htmlFor="addressLine">Address Line</Label>
                <Input id="addressLine" {...register('address.address_line')} />
                {errors.address?.address_line && <p className="text-sm text-red-500">{errors.address.address_line.message}</p>}
              </div>

              {/* City & Pincode */}
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" {...register('address.city')} />
                  {errors.address?.city && <p className="text-sm text-red-500">{errors.address.city.message}</p>}
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input id="pincode" {...register('address.pincode')} />
                  {errors.address?.pincode && <p className="text-sm text-red-500">{errors.address.pincode.message}</p>}
                </div>
              </div>

              {/* State */}
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" {...register('address.state')} />
                {errors.address?.state && <p className="text-sm text-red-500">{errors.address.state.message}</p>}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...register('password')} />
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
              </div>

              <Button type="submit" className="w-full bg-orange-500 text-white hover:bg-orange-600">
                Sign Up
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
