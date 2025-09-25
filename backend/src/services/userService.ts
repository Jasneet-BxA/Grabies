import { supabase } from "../config/supabaseClient.js";
import type { UpdateProfileInput, AddressInput } from "../types/index.js";

export const getProfileService = async (userId: string) => {
  const { data, error } = await supabase
  .from('users')
  .select(`
    id,
    name,
    email,
    contact,
    dob,
    address:users_address_id_fkey (
      address_line,
      city,
      state,
      pincode
    )
  `)
  .eq('id', userId)
  .single();


  if (error) throw new Error(error.message);

  return data;
};

export const updateProfileService = async (
  userId: string,
  fields: UpdateProfileInput
) => {
  const { data, error } = await supabase
    .from('users')
    .update(fields)
    .eq('id', userId)
    .single();

  if (error) throw new Error(error.message);

  return data;
};

export const updateAddressService = async (
  userId: string,
  addressFields: AddressInput
) => {
  const { data: existingAddress, error: addressFetchError } = await supabase
    .from('addresses')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (addressFetchError && addressFetchError.code !== 'PGRST116') {
    throw new Error(addressFetchError.message);
  }

  let addressResult;

  if (existingAddress) {
    const { data, error } = await supabase
      .from('addresses')
      .update(addressFields)
      .eq('id', existingAddress.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    addressResult = data;
  } else {
    const { data, error } = await supabase
      .from('addresses')
      .insert({ ...addressFields, user_id: userId })
      .select()
      .single();

    if (error) throw new Error(error.message);
    addressResult = data;

    const { error: userUpdateError } = await supabase
      .from('users')
      .update({ address_id: addressResult.id })
      .eq('id', userId);

    if (userUpdateError) throw new Error(userUpdateError.message);
  }

  return addressResult;
};
