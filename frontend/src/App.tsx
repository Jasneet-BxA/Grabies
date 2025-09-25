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
import ProductListing from './pages/ProductListing.tsx'
import OurFood from './pages/OurFood.tsx'
import OrderHistoryPage from './pages/OrderHistory.tsx'
import CheckoutwithStripe from './pages/CheckoutwithStripe.tsx'

import { Toaster } from 'react-hot-toast'
import OrderDetailPage from './pages/OrderDetail.tsx'



function App() {
  return (
    <>
    <div className="pt-20">
      <Navbar />
    </div>
    <Toaster position="top-right" /> 
      <div className="min-h-screen pt-16 px-4 md:px-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/food/:category/:name" element={<ProductDetails category={''} productName={''} triggerElement={undefined} />} />
            <Route path="/about" element={<About />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/category" element={<ProductListing />} />
            <Route path="/food" element={<OurFood />} />
            <Route path="/checkoutwithstripe" element={<CheckoutwithStripe/>} />
            <Route path="/checkout" element={<Checkout/>} />
            <Route path="/orderhistory" element={<OrderHistoryPage/>} />
            <Route path="/order/:id" element={<OrderDetailPage />} />
        </Routes>
      </div>
      <Footer />
    </>
  )
}

export default App
