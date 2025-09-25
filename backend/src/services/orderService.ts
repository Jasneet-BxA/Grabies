import { supabase } from "../config/supabaseClient.js";

export const getOrderByIdService = async (orderId: string) => {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      total_price,
      status,
      address_id,
      order_items (
        quantity,
        total_price,
        products (
          id,
          name,
          price,
          image_url
        )
      )
    `)
    .eq("id", orderId)
    .single(); 

  if (error) {
    console.error("Error fetching order by ID:", error);
    throw new Error("Failed to fetch order details.");
  }
console.log(data);
  return data;
};


export const getUserOrdersService = async (userId: string) => {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      total_price,
      status,
      order_items (
        quantity,
        total_price,
        products (
          name,
          price
        )
      )
    `)
    .eq("user_id", userId)

  if (error) throw new Error(error.message);
  return data;
};

export const createOrderFromCartService = async (
  userId: string,
  addressId: string
) => {
  const { data: cartItems, error: cartError } = await supabase
    .from("cart")
    .select("product_id, quantity")
    .eq("user_id", userId);

  if (cartError) throw new Error(cartError.message);
  if (!cartItems || cartItems.length === 0) throw new Error("Cart is empty");

  const productIds = cartItems.map((item) => item.product_id);

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, price")
    .in("id", productIds);

  if (productsError) throw new Error(productsError.message);

  const priceMap = new Map(
    products.map((product) => [product.id, product.price])
  );

  const totalPrice = cartItems.reduce((sum, item) => {
    const price = priceMap.get(item.product_id) || 0;
    return sum + item.quantity * price;
  }, 0);

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      address_id: addressId,
      total_price: totalPrice,
      status: "pending",
    })
    .select()
    .single();

  if (orderError) throw new Error(orderError.message);

  const orderItems = cartItems.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    total_price: item.quantity * (priceMap.get(item.product_id) || 0),
  }));


  const { error: orderItemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (orderItemsError) throw new Error(orderItemsError.message);

  const { error: clearCartError } = await supabase
    .from("cart")
    .delete()
    .eq("user_id", userId);

  if (clearCartError) throw new Error(clearCartError.message);

  return { orderId: order.id, totalPrice };
};


export const getOrderAmount = async (orderId: string) => {
  const { data, error } = await supabase
    .from("orders")
    .select("total_price")
    .eq("id", orderId)
    .single();


  if (error) throw new Error("Order not found");
  return data.total_price;
};

export const confirmOrderPayment = async (orderId: string) => {
  const { error } = await supabase
    .from("orders")
    .update({ status: "paid" })
    .eq("id", orderId);

  if (error) throw new Error(error.message);
};