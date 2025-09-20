import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import Profile from "@/pages/Profile" // ✅ Import your modular profile component

export default function Navbar() {
  const { isAuthenticated } = useAuth()

  return (
    <header className="w-full px-4 md:px-10 py-4 shadow-sm bg-white fixed top-0 left-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* ✅ Logo */}
        <Link to="/" className="text-2xl font-bold text-orange-600">
          Grabies
        </Link>

        {/* ✅ Navigation Menu */}
        <NavigationMenu>
          <NavigationMenuList className="hidden md:flex space-x-6">
            {["Home", "About Us", "Our Food", "Cart", "Contact"].map((item, idx) => (
              <NavigationMenuItem key={idx}>
                <NavigationMenuLink asChild>
                  <Link
                    to={["/", "/about", "/food", "/plans", "/contact"][idx]}
                    className="text-gray-700 hover:text-orange-600 font-medium"
                  >
                    {item}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* ✅ Right side - Auth / Profile */}
        <div className="hidden md:flex items-center gap-3">
          {!isAuthenticated ? (
            <>
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
            </>
          ) : (
            <Profile />
          )}
        </div>
      </div>
    </header>
  )
}
