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

const signupSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  contact: z.string().min(10, 'Invalid contact number'),
  addressLine: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  pincode: z.string().min(4, 'Pincode is required'),
  state: z.string().min(2, 'State is required'),
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
      navigate('/')
    } catch (err) {
      alert('Signup failed. Try again.')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-lg">
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
              <Input id="addressLine" {...register('addressLine')} />
              {errors.addressLine && <p className="text-sm text-red-500">{errors.addressLine.message}</p>}
            </div>

            {/* City & Pincode - side by side */}
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" {...register('city')} />
                {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input id="pincode" {...register('pincode')} />
                {errors.pincode && <p className="text-sm text-red-500">{errors.pincode.message}</p>}
              </div>
            </div>

            {/* State */}
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" {...register('state')} />
              {errors.state && <p className="text-sm text-red-500">{errors.state.message}</p>}
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
  )
}
