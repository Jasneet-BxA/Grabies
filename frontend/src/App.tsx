import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import CheckoutwithCod from "./pages/CheckoutwithCod";
import Profile from "./pages/Profile";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import About from "./pages/About";
import Wishlist from "./pages/Wishlist";
import ProductListing from "./pages/ProductListing";
import OurFood from "./pages/OurFood";
import OrderHistoryPage from "./pages/OrderHistory";
import Checkout from "./pages/Checkout";
import SearchResults from "./pages/SearchResults";
import { Toaster } from "react-hot-toast";
import OrderDetailPage from "./pages/OrderDetail";
import { ProtectedRoute } from "./components/ProtectedRoute";
import ScrollToTop from "@/components/ScrollToTop";

function App() {
  return (
    <>
      <div className="pt-5">
        <Navbar />
      </div>
      <Toaster position="top-center" />
      <div className="min-h-screen pt-16 px-4 md:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
          <Route
            path="/food/:category/:name"
            element={
              <ProductDetails
                category={""}
                productName={""}
                triggerElement={undefined}
              />
            }
          />
          <Route path="/about" element={<About />} />

          {/* ✅ Protected routes */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkoutwithcod"
            element={
              <ProtectedRoute>
                <CheckoutwithCod />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order"
            element={
              <ProtectedRoute>
                <OrderHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order/:id"
            element={
              <ProtectedRoute>
                <OrderDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Public routes */}
          <Route path="/food/:category" element={<ProductListing />} />
          <Route path="/food" element={<OurFood />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
