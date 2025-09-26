import type { Address, AddressInput } from "../types/index.js";
import { supabase } from "../config/supabaseClient.js";
// import { addressSchema, updateAddressSchema } from "../validators/addressValidator.js";

export const addAddressService = async (userId: string, data: AddressInput) => {
  const { data: address, error } = await supabase
    .from("addresses")
    .insert([{ ...data, user_id: userId }])
    .select()
    .single();

  if (error) throw error;
  return address;
};

export const getAddressesService = async (userId: string) => {
  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;
  return data;
};

export const deleteAddressService = async (userId: string, addressId: string) => {
  const { error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", addressId)
    .eq("user_id", userId);

  if (error) throw error;
  return { message: "Address deleted successfully" };
};
