export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700 mt-12 border-t">
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        
        {/* Branding */}
        <div>
          <h3 className="text-xl font-bold text-orange-600 mb-2">Grabies</h3>
          <p className="text-sm">Delivering happiness at your doorstep. Order from your favorite restaurants instantly.</p>
        </div>

        {/* Navigation Links */}
        <div>
          <h4 className="font-semibold mb-2">Grabies</h4>
          <ul className="text-sm space-y-1">
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><a href="/products" className="hover:underline">Menu</a></li>
            <li><a href="/cart" className="hover:underline">Cart</a></li>
            <li><a href="/profile" className="hover:underline">Profile</a></li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="font-semibold mb-2">Support</h4>
          <ul className="text-sm space-y-1">
            <li><a href="#" className="hover:underline">Help Center</a></li>
            <li><a href="#" className="hover:underline">Terms & Conditions</a></li>
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-2">Contact Us</h4>
          <p className="text-sm">📧 support@grabies.com</p>
          <p className="text-sm mt-1">📞 +91 98765 43210</p>
          <div className="flex space-x-3 mt-2">
            {/* Socials (can use icons here later) */}
            <a href="#" className="text-sm hover:underline">Instagram</a>
            <a href="#" className="text-sm hover:underline">Facebook</a>
          </div>
        </div>

      </div>

      {/* Copyright */}
      <div className="bg-gray-200 text-center py-3 text-sm text-gray-600">
        &copy; {new Date().getFullYear()} Grabies. All rights reserved.
      </div>
    </footer>
  )
}
