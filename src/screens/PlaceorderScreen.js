import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Message from "../components/Message";
import SectionHeader from "../components/SectionHeader";
import { createOrder, createOrderAndPay } from "../actions/orderActions";
import { Image } from "cloudinary-react";
import { BsCartCheck } from "react-icons/bs";
import { customSweetAlert, toastMessage } from "../utils/utils";
import Loader from "../components/Loader";
import axios from "axios";
import { BASE_URL } from "../config";
import { PaystackButton } from "react-paystack";
import { resetCart } from "../actions/cartActions";

const PlaceorderSreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [publickey, setPublickey] = useState("");
  const cart = useSelector((state) => state.cart);
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };
  const { loading: loadingPay, success: successPay } = useSelector(
    (state) => state.orderPay
  );
  const { userInfo } = useSelector((state) => state.userLogin);
  // calculate price
  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  );
  cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 10);
  cart.taxPrice = 0;
  // cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)));
  cart.totalPrice = addDecimals(
    Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)
  );
  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, error } = orderCreate;

  useEffect(() => {
    if (!userInfo) {
      navigate("/");
    }
    (async function addPaypalScript() {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data: clientId } = await axios.get(
        `${BASE_URL()}/api/payment/paystack_public_key`,
        config
      );
      setPublickey(clientId);
    })();
  }, [userInfo, navigate]);

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        totalPrice: cart.totalPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
      })
    );
    toastMessage("success", "Order has been placed successfully");
    dispatch(resetCart());
  };
  const componentProps = {
    email: userInfo.email,
    amount: addDecimals(cart.totalPrice * 100),
    name: userInfo.name,
    phone: userInfo.name,
    publicKey: publickey,
    text: "Place order with payment",
    onSuccess: (reference) => {
      dispatch(
        createOrderAndPay(
          {
            orderItems: cart.cartItems,
            shippingAddress: cart.shippingAddress,
            paymentMethod: cart.paymentMethod,
            itemsPrice: cart.itemsPrice,
            totalPrice: cart.totalPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
          },
          reference
        )
      );
      toastMessage("success", "Order has been placed successfully");
      dispatch(resetCart());
    },
    onClose: () =>
      customSweetAlert(
        "Caution",
        "Do you want to cancel this transaction?",
        "error"
      ),
  };

  return (
    <>
      {loadingPay && <Loader fullPage={true} />}
      <div className="row mb-3 mt-5">
        <div className="col-lg-12">
          <SectionHeader header="Order" />
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb p-0 m-0 bg-transparent my-2 small">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/shipping">Shipping</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/payment">Payment</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Order
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="shipping mb-3">
        <div className="row">
          <div className="col-lg-8 col-md-12 col-sm-12">
            <div className="shipping-box bg-white p-4 shadow rounded">
              <h6 className="text-primary">Order Details</h6>
              <hr />
              <p className="my-0 py-0">
                <strong>Address: </strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city},
                {cart.shippingAddress.country}
                {/* {cart.shippingAddress.postalCode}, */}
              </p>
              <p className="my-0 py-0">
                <strong>Payment Method: </strong>
                {!cart.paymentMethod
                  ? (cart.paymentMethod = "Paystack")
                  : cart.paymentMethod}
              </p>
              <hr />
              <h6 className="text-primary">Order Items</h6>
              {cart.cartItems.length === 0 ? (
                <Message type="danger" message="Your cart is empty" />
              ) : (
                <ul>
                  {cart.cartItems.map((item, index) => (
                    <li key={index} className="my-1">
                      <Image
                        cloudName="psalmzie"
                        publicId={item.image}
                        width="auto"
                        height="50"
                        crop="scale"
                        alt={item.name}
                        className="img-fluid mr-2"
                      />
                      <span className="mx-1">{item.name}</span>
                      <span>
                        ({item.quantity} x &#8358;{item.price} = &#8358;
                        {item.quantity * item.price})
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <hr />
              <h6 className="text-primary">Order Summary</h6>
              <div className="table-responsive ">
                <table className="table table-hover shadow-sm">
                  <thead className="thead-dark">
                    <tr>
                      <th scope="col">Items</th>
                      <th scope="col">Shipping</th>
                      <th scope="col">Tax</th>
                      <th scope="col">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td> &#8358;{cart.itemsPrice}</td>
                      <td> &#8358;{cart.shippingPrice}</td>
                      <td> &#8358;{cart.taxPrice}</td>
                      <td> &#8358;{cart.totalPrice}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {error && <Message variant="danger">{error}</Message>}
              {cart.cartItems.length !== 0 && (
                <div className="row ">
                  <div className="col-6  my-2">
                    {cart.cartItems.length !== 0 && (
                      <PaystackButton
                        className="paystack-button btn_two py-1 mt-2"
                        {...componentProps}
                      />
                    )}
                  </div>
                  <div className="col-6 my-2">
                    <button
                      type="button"
                      className="btn_two mt-2 py-2 h5"
                      disabled={cart.cartItems === 0}
                      onClick={placeOrderHandler}
                    >
                      <BsCartCheck className="mx-2" /> Place order without
                      payment
                    </button>
                  </div>
                </div>
              )}
              <Link to="/orders" className="w-100 mt-3 btn_one">
                My Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaceorderSreen;
