import axios from "axios";
import {
  ADD_CART_ITEM,
  REMOVE_CART_ITEM,
  RESET_CART_ITEM,
  SAVE_PAYMENT_METHOD_CART,
  SAVE_SHIPPING_ADDRESS_CART,
} from "../constant/cartConstants";
import { BASE_URL } from "../config";

export const addToCart = (slug, quantity) => async (dispatch, getState) => {
  const { data } = await axios.get(`${BASE_URL()}/api/products/${slug}`);
  dispatch({
    type: ADD_CART_ITEM,
    payload: {
      product: data.product._id,
      name: data.product.name,
      slug: data.product.slug,
      image: data.product.image,
      price: data.product.price,
      countInStock: data.product.countInStock,
      quantity,
    },
  });
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};
export const removeFromCart = (id) => async (dispatch, getState) => {
  dispatch({
    type: REMOVE_CART_ITEM,
    payload: id,
  });
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

export const saveShippingAddress = (data) => async (dispatch) => {
  dispatch({
    type: SAVE_SHIPPING_ADDRESS_CART,
    payload: data,
  });
  localStorage.setItem("shippingAddress", JSON.stringify(data));
};

export const savePaymentMethod = (data) => async (dispatch) => {
  dispatch({
    type: SAVE_PAYMENT_METHOD_CART,
    payload: data,
  });
  localStorage.setItem("paymentMethod", JSON.stringify(data));
};

export const resetCart = () => async (dispatch) => {
  dispatch({
    type: RESET_CART_ITEM,
  });
  localStorage.setItem("cartItems", JSON.stringify([]));
};
