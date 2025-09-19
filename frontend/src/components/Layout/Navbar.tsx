// src/components/Navbar.tsx
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Link } from "react-router"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <header className="w-full px-4 md:px-10 py-4 shadow-sm bg-white fixed top-0 left-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-orange-600">
          Grabies
        </Link>

        {/* Navigation Menu */}
        <NavigationMenu>
          <NavigationMenuList className="hidden md:flex space-x-6">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/" className="text-gray-700 hover:text-orange-600 font-medium">
                  Home
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/about" className="text-gray-700 hover:text-orange-600 font-medium">
                  About Us
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/food" className="text-gray-700 hover:text-orange-600 font-medium">
                  Our Food
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/plans" className="text-gray-700 hover:text-orange-600 font-medium">
                  Cart
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/contact" className="text-gray-700 hover:text-orange-600 font-medium">
                  Contact
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Buttons Group (Login + Signup) */}
        <div className="hidden md:flex gap-3">
          <Link to="/auth/login">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              Login
            </Button>
          </Link>
          <Link to="/auth/signup">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              Signup
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
