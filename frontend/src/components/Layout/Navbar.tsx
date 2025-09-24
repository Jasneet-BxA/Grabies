import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Menu, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import Profile from "@/pages/Profile";
import { useCart } from "@/context/CartContext";
import { useEffect } from "react";
// import { useEffect, useState } from "react";
// import { getCart } from "@/lib/api"; // <-- import getCart from api.ts
export default function Navbar() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  // const [cartCount, setCartCount] = useState(0);
const { totalItems, refreshCart } =  useCart();

//  const fetchCartCount = async () => {
//   try {
//     const cartItems = await getCart();
//     setCartCount(cartItems.length);
//   } catch {
//     setCartCount(0);
//   }
// };

useEffect(() => {
refreshCart();
}, []);
  return (
    <header className="w-full px-4 md:px-10 py-4 shadow-sm bg-white fixed top-0 left-0 z-50">
      
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
    
        <Link to="/" className="text-2xl font-bold text-orange-600">
          Grabies
        </Link>
        {/* Desktop Navigation */}
        <NavigationMenu>
          <NavigationMenuList className="hidden md:flex space-x-6">
            {["Home", "About Us", "Our Food", "Contact"].map((item, idx) => (
              <NavigationMenuItem key={idx}>
                <NavigationMenuLink asChild>
                  <Link
                    to={["/", "/about", "/food", "/contact"][idx]}
                    className="text-gray-700 hover:text-orange-600 font-medium"
                  >
                    {item}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        {/* Desktop Auth/Profile */}
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
            <>
              {/* Wishlist Icon */}
              <button
                aria-label="Wishlist"
                onClick={() => navigate("/wishlist")}
                className="relative p-2 rounded-full hover:bg-orange-100 transition"
              >
                <Heart className="h-6 w-6 text-orange-600" />
              </button>
              {/* Cart Icon */}
              <button
                aria-label="Cart"
                onClick={() => navigate("/cart")}
                className="relative p-2 rounded-full hover:bg-orange-100 transition"
              >
                <ShoppingCart className="h-6 w-6 text-orange-600" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                )}
              </button>
              <Profile />
            </>
          )}
        </div>
        {/* Mobile Right Section */}
        <div className="md:hidden flex items-center gap-2">
          {isAuthenticated && (
            <>
              {/* Wishlist */}
              <button
                aria-label="Wishlist"
                onClick={() => navigate("/wishlist")}
                className="relative p-2 rounded-full hover:bg-orange-100 transition"
              >
                <Heart className="h-6 w-6 text-orange-600" />
              </button>
              {/* Cart for Mobile */}
              <button
                aria-label="Cart"
                onClick={() => navigate("/cart")}
                className="relative p-2 rounded-full hover:bg-orange-100 transition"
              >
                <ShoppingCart className="h-6 w-6 text-orange-600" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                )}
              </button>
              <Profile />
            </>
          )}
          {/* Mobile Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-orange-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mt-2 bg-white p-2 shadow-lg">
              {[
                { label: "Home", to: "/" },
                { label: "About Us", to: "/about" },
                { label: "Our Food", to: "/food" },
                { label: "Cart", to: "/cart" },
                { label: "Contact", to: "/contact" },
              ].map((item, idx) => (
                <DropdownMenuItem key={idx} asChild>
                  <Link
                    to={item.to}
                    className="w-full block text-sm text-gray-700 hover:text-orange-600"
                  >
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
              <div className="border-t my-2" />
              {!isAuthenticated && (
                <>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/auth/login"
                      className="w-full block text-sm text-gray-700 hover:text-orange-600"
                    >
                      Login
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/auth/signup"
                      className="w-full block text-sm text-gray-700 hover:text-orange-600"
                    >
                      Signup
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
