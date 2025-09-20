// src/components/Profile.tsx

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile, logout } from "@/lib/api";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/types";

export default function Profile() {
  const { setUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (sheetOpen && isAuthenticated) {
        try {
          const data = await getUserProfile();
          setProfile(data);
          setUser(data);
          setCurrentAddress(data?.address || "");
        } catch (err) {
          console.error("Failed to fetch profile", err);
        }
      }
    };

    fetchProfile();
  }, [sheetOpen, isAuthenticated]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
      setSheetOpen(false);
      navigate("/");
    } catch (err) {
      alert("Logout failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <Sheet
      open={sheetOpen}
      onOpenChange={(open) => {
        setSheetOpen(open);
        if (!open) {
          setShowDetails(false);
          setShowAddress(false);
        }
      }}
    >
      <SheetTrigger asChild>
        <button
          aria-label="Open profile"
          className="text-2xl text-orange-600 cursor-pointer"
        >
          <FaUserCircle />
        </button>
      </SheetTrigger>

      <SheetContent className="w-72 sm:w-96 bg-white shadow-xl border-l border-gray-200 overflow-y-auto">

        {showDetails ? (
          <>
            {/* --------- My Account Details --------- */}
            <SheetHeader>
              <SheetTitle className="text-2xl font-semibold text-orange-600">
                My Account
              </SheetTitle>
              <SheetDescription className="text-sm text-gray-500">
                View your personal information.
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                {/* Name */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile?.name || ""}
                    readOnly
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Email */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile?.email || ""}
                    readOnly
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={profile?.contact || ""}
                    readOnly
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <SheetFooter className="mt-6 flex gap-3">
              <Button
                variant="outline"
                className="w-full border-orange-500 text-orange-600 hover:bg-orange-50 hover:border-orange-600 transition-colors duration-200"
                onClick={() => setShowDetails(false)}
              >
                Back
              </Button>
              <SheetClose asChild>
                <Button className="w-full bg-orange-500 text-white hover:bg-orange-600 transition-colors duration-200">
                  Close
                </Button>
              </SheetClose>
            </SheetFooter>
          </>
        ) : showAddress ? (
          <>
            {/* --------- Address Section --------- */}
            <SheetHeader>
              <SheetTitle className="text-2xl font-semibold text-orange-600">
                My Address
              </SheetTitle>
              <SheetDescription className="text-sm text-gray-500">
                Manage your shipping address.
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                {/* Current Address */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Current Address
                  </label>
                  <textarea
                    value={profile?.address?.address_line ? `${profile?.address?.address_line}, ${profile?.address?.city}, ${profile?.address?.state}, ${profile?.address?.pincode}` : ""}
                    readOnly
                    rows={3}
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* New Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    New Address
                  </label>
                  <textarea
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter new address here..."
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <SheetFooter className="mt-6 flex gap-3">
              <Button
                variant="outline"
                className="w-full border-orange-500 text-orange-600 hover:bg-orange-50 hover:border-orange-600 transition-colors duration-200"
                onClick={() => setShowAddress(false)}
              >
                Back
              </Button>
              <Button
                className="w-full bg-orange-500 text-white hover:bg-orange-600 transition-colors duration-200"
                onClick={() => {
                  // TODO: Persist to API
                  alert(`Address added: ${newAddress}`);
                  setCurrentAddress(newAddress);
                  setNewAddress("");
                  setShowAddress(false);
                }}
              >
                Add Address
              </Button>
            </SheetFooter>
          </>
        ) : (
          <>
            {/* --------- Default Welcome View --------- */}
            <SheetHeader>
              <SheetTitle>
                <h1 className="text-2xl font-bold text-orange-600">
                  👋 Welcome, {profile?.name || "User"}
                </h1>
              </SheetTitle>
            </SheetHeader>

            <Button
              onClick={() => setShowDetails(true)}
              className="w-full my-4 text-sm bg-gray-100 text-gray-800 hover:bg-gray-200"
              variant="ghost"
            >
              My Account
            </Button>

            <Button
              onClick={() => setShowAddress(true)}
              className="w-full mb-6 text-sm bg-gray-100 text-gray-800 hover:bg-gray-200"
              variant="ghost"
            >
              Address
            </Button>

            <SheetFooter>
              <Button
                variant="outline"
                className="w-full border-orange-500 text-orange-600 hover:bg-orange-50 hover:border-orange-600 transition-colors duration-200"
                onClick={handleLogout}
                disabled={loading}
              >
                {loading ? "Logging out..." : "Logout"}
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
