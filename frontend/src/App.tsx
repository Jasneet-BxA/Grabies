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
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkoutwithcod" element={<CheckoutwithCod />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/category" element={<ProductListing />} />
          <Route path="/food" element={<OurFood />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order" element={<OrderHistoryPage />} />
          <Route path="/order/:id" element={<OrderDetailPage />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
