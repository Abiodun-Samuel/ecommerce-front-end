import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { resetCart, saveShippingAddress } from "../actions/cartActions";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Time from "../components/Time";
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from "../actions/orderActions";
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
  ORDER_DETAILS_RESET,
} from "../constant/orderConstants";
import axios from "axios";
import { PaystackButton } from "react-paystack";
import SectionHeader from "../components/SectionHeader";
import { Image } from "cloudinary-react";
import { customSweetAlert, toastMessage } from "../utils/utils";

const OrderScreen = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [publickey, setPublickey] = useState("");
  const { order, loading, error } = useSelector((state) => state.orderDetails);
  const { userInfo } = useSelector((state) => state.userLogin);
  const {
    loading: loadingDeliver,
    error: errorDeliver,
    success: successDeliver,
  } = useSelector((state) => state.orderDeliver);
  const { loading: loadingPay, success: successPay } = useSelector(
    (state) => state.orderPay
  );

  // calculate price
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };
  if (!loading) {
    order.itemsPrice = addDecimals(
      order.orderItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      )
    );
  }

  (async function addPaypalScript() {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data: clientId } = await axios.get(
      `${process.env.REACT_APP_PRODUCTION_URL}/api/payment/paystack_public_key`,
      config
    );
    setPublickey(clientId);
  })();

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
    if (!order) {
      dispatch({ type: ORDER_DETAILS_RESET });
      dispatch(getOrderDetails(orderId));
    }
    if (successPay) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch(getOrderDetails(orderId));
    }
    if (successDeliver) {
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderId));
    }
  }, [
    dispatch,
    order,
    orderId,
    navigate,
    userInfo,
    successPay,
    successDeliver,
  ]);

  const componentProps = {
    email: userInfo.email,
    amount: addDecimals(order?.totalPrice * 100),
    name: userInfo.name,
    phone: userInfo.name,
    publicKey: publickey,
    text: "Pay Now",
    onSuccess: (reference) => {
      dispatch(payOrder(orderId, reference));
      toastMessage("success", "Order has been placed successfully");
      dispatch(resetCart());
    },
    onClose: () => {
      customSweetAlert(
        "Caution",
        "Do you want to cancel this transaction?",
        "error"
      );
    },
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  return loading ? (
    <Loader fullPage={true} />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <div className="row mb-3 mt-5">
        <div className="col-lg-12">
          <SectionHeader header="Order" />
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb p-0 m-0 bg-transparent my-2 small">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/orders">Orders</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Order Id: {order._id}
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
                <strong>Name: </strong>
                {order?.user?.name}
                {order?.user?.email}
              </p>
              <p className="my-0 py-0">
                <strong>Email: </strong>
                {order?.user?.email}
              </p>
              <p className="my-0 py-0">
                <strong>Address:</strong>
                {order?.shippingAddress?.address},{order?.shippingAddress?.city}
                {order?.shippingAddress?.postalCode},
                {order?.shippingAddress?.country}
              </p>
              <p className="my-0 py-0">
                <strong>Payment Method: </strong>
                {order.paymentMethod}
              </p>
              <hr />
              {error && <Message variant="danger">{error}</Message>}
              <h6 className="text-primary">Order Status</h6>
              <div className="row">
                <div className="col-6 my-2">
                  {order.isPaid ? (
                    <Message type="success">
                      Paid on: {<Time time={order.paidAt} />}
                    </Message>
                  ) : (
                    <Message type="danger">Not Paid</Message>
                  )}
                  {!order.isPaid && (
                    <PaystackButton
                      className="paystack-button btn_one py-1 mt-2"
                      {...componentProps}
                    />
                  )}
                </div>
                <div className="col-6 my-2">
                  {order.isDelivered ? (
                    <Message type="success">
                      Delivered on: {<Time time={order.deliveredAt} />}
                    </Message>
                  ) : (
                    <Message type="danger">Not Delivered</Message>
                  )}
                  {loadingDeliver && <Loader smallPage={true} />}
                  {userInfo &&
                    userInfo.isAdmin &&
                    order.isPaid &&
                    !order.isDelivered && (
                      <button
                        className="btn_one py-1 mt-2"
                        onClick={deliverHandler}
                      >
                        Mark As Delivered
                      </button>
                    )}
                </div>
              </div>
              <hr />
              <h6 className="text-primary">Order Items</h6>
              {order.orderItems.length === 0 ? (
                <Message type="danger" message="Your order is empty" />
              ) : (
                <ul>
                  {order.orderItems.map((item, index) => (
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
                      <td> &#8358;{order.itemsPrice}</td>
                      <td> &#8358;{order.shippingPrice}</td>
                      <td> &#8358;{order.taxPrice}</td>
                      <td> &#8358;{order.totalPrice}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {userInfo.isAdmin ? (
                <Link to="/admin/orders" className="w-100 mt-3 btn_one py-2">
                  My Orders
                </Link>
              ) : (
                <Link to="/orders" className="w-100 mt-3 btn_one py-2">
                  My Orders
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderScreen;
