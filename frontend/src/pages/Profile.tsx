import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getCurrentUser, logout } from "@/lib/api";
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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { getUserAddress, addUserNewAddress } from "@/lib/api";
import toast from "react-hot-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const addressSchema = z.object({
  address_line: z.string().min(5, "Address must be at least 5 characters"),
  city: z
    .string()
    .min(2, "City is required")
    .regex(/^[A-Za-z\s]+$/, "City must only contain alphabets"),
  state: z
    .string()
    .min(2, "State is required")
    .regex(/^[A-Za-z\s]+$/, "State must only contain alphabets"),
  pincode: z
    .string()
    .min(4, "Pincode must be at least 4 digits")
    .max(10, "Pincode too long")
    .regex(/^[0-9]/, "Please enter 6-digit Indian pincode"),
});

type AddressFormValues = z.infer<typeof addressSchema>;

export default function Profile() {
  const { setUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  const [savedAddresses, setSavedAddresses] = useState<
    { address_line: string; city: string; state: string; pincode: string }[]
  >([]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (sheetOpen && isAuthenticated) {
        try {
          const data = await getCurrentUser();
          setProfile(data);
          setUser(data);

          const addressData = await getUserAddress();
          setSavedAddresses(addressData);
        } catch (err: unknown) {
          console.error("Failed to fetch profile or address:", err);

          const message =
            err instanceof Error
              ? err.message
              : "Something went wrong fetching profile.";

          toast.error(message);
        }
      }
    };

    fetchProfile();
  }, [sheetOpen, isAuthenticated, setUser]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
      setSheetOpen(false);
      navigate("/");
    } catch (err: unknown) {
      console.error("Logout failed:", err);

      const message =
        err instanceof Error ? err.message : "Logout failed. Please try again.";

      toast.error(message);
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
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Current Address
                  </label>
                  <textarea
                    value={
                      profile?.address?.address_line
                        ? `${profile.address.address_line}, ${profile.address.city}, ${profile.address.state}, ${profile.address.pincode}`
                        : ""
                    }
                    readOnly
                    rows={3}
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {savedAddresses.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Saved Addresses
                    </label>

                    {savedAddresses.map((addr, index) => (
                      <div
                        key={index}
                        className="p-4 border border-gray-200 rounded-md bg-white text-sm text-gray-700"
                      >
                        <div className="font-medium mb-1">
                          Address {index + 1}
                        </div>
                        <div>
                          {addr.address_line}, {addr.city}, {addr.state} -{" "}
                          {addr.pincode}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full mt-4 bg-orange-500 text-white hover:bg-orange-600">
                      Add New Address
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-md bg-white">
                    <DialogHeader>
                      <DialogTitle>Add New Address</DialogTitle>
                      <DialogDescription>
                        Enter your new shipping address below.
                      </DialogDescription>
                    </DialogHeader>

                    <AddressForm
                      onSuccess={(newAddress) => {
                        setSavedAddresses((prev) => [...prev, newAddress]);
                        toast.success("Address saved!");
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <SheetFooter>
              <Button
                variant="outline"
                className="w-full border-orange-500 text-orange-600 hover:bg-orange-50 hover:border-orange-600 transition-colors duration-200"
                onClick={() => setShowAddress(false)}
              >
                Back
              </Button>
            </SheetFooter>
          </>
        ) : (
          <>
            <SheetHeader>
              <SheetTitle className="text-2xl font-bold text-orange-600">
                👋 Welcome, {profile?.name || "User"}
              </SheetTitle>
            </SheetHeader>

            <Button
              onClick={() => setShowDetails(true)}
              className="w-full mb-6 text-sm bg-gray-100 text-gray-800 hover:bg-orange-100 hover:text-orange-700 transition-colors duration-200"
              variant="ghost"
            >
              👤 My Account
            </Button>

            <Button
              onClick={() => setShowAddress(true)}
              className="w-full mb-6 text-sm bg-gray-100 text-gray-800 hover:bg-orange-100 hover:text-orange-700 transition-colors duration-200"
              variant="ghost"
            >
              🏠 Address
            </Button>

            <Button
              onClick={() => {
                setSheetOpen(false); 
                navigate("/wishlist"); 
              }}
              className="w-full mb-6 text-sm bg-gray-100 text-gray-800 hover:bg-orange-100 hover:text-orange-700 transition-colors duration-200"
              variant="ghost"
            >
              ❤️ Favourites
            </Button>

            <Button
              onClick={() => {
                setSheetOpen(false); 
                navigate("/order"); 
              }}
              className="w-full mb-6 text-sm bg-gray-100 text-gray-800 hover:bg-orange-100 hover:text-orange-700 transition-colors duration-200"
              variant="ghost"
            >
              📦 Past Orders
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

function AddressForm({ onSuccess }: { onSuccess: (newAddress: any) => void }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
  });

  const onSubmit = async (data: AddressFormValues) => {
    try {
      const res = await addUserNewAddress(data);
      onSuccess(res.address);
      reset();
    } catch (err) {
      console.error("Error saving address:", err);
      toast.error("Failed to save address. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input
          type="text"
          {...register("address_line")}
          placeholder="Address Line"
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md"
        />
        {errors.address_line && (
          <p className="text-sm text-red-500 mt-1">
            {errors.address_line.message}
          </p>
        )}
      </div>

      <div>
        <input
          type="text"
          {...register("city")}
          placeholder="City"
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md"
        />
        {errors.city && (
          <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>
        )}
      </div>

      <div>
        <input
          type="text"
          {...register("state")}
          placeholder="State"
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md"
        />
        {errors.state && (
          <p className="text-sm text-red-500 mt-1">{errors.state.message}</p>
        )}
      </div>

      <div>
        <input
          type="text"
          {...register("pincode")}
          placeholder="Pincode"
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md"
        />
        {errors.pincode && (
          <p className="text-sm text-red-500 mt-1">{errors.pincode.message}</p>
        )}
      </div>

      <DialogFooter className="mt-4 flex justify-end gap-2">
        <DialogClose asChild>
          <Button
            type="button"
            variant="outline"
            className="border-gray-300 text-gray-600"
          >
            Cancel
          </Button>
        </DialogClose>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-orange-500 text-white hover:bg-orange-600"
        >
          {isSubmitting ? "Saving..." : "Save Address"}
        </Button>
      </DialogFooter>
    </form>
  );
}
