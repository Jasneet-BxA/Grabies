import { Routes , Route } from 'react-router'
import Home from './pages/Home.tsx'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Profile from './pages/Profile'
import Navbar from './components/Layout/Navbar'
import Footer from './components/Layout/Footer'
import About from './pages/About'
import Wishlist from './pages/Wishlist.tsx'
import ContactUs from './pages/Contact.tsx' 
import ProductListing from './pages/ProductListing.tsx'
import OurFood from './pages/OurFood.tsx'


function App() {
  return (
    <>
    <div className="pt-20">
      <Navbar />
    </div>
    
      <div className="min-h-screen pt-16 px-4 md:px-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/products" element={<ProductListing />} />
            <Route path="/food" element={<OurFood />} />
        </Routes>
      </div>
      <Footer />
    </>
  )
}

export default App
