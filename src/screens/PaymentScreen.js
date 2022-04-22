import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { savePaymentMethod } from "../actions/cartActions";
import CheckoutSteps from "../components/CheckoutSteps";
import SectionHeader from "../components/SectionHeader";
import { AiOutlineArrowRight } from "react-icons/ai";

const PaymentScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  let redirect;
  searchParams.has("redirect")
    ? (redirect = "/" + searchParams.get("redirect"))
    : (redirect = "/");
  useEffect(() => {
    if (!userInfo) {
      navigate(redirect, { replace: true });
    }
    if (!shippingAddress) {
      navigate("/shipping");
    }
  }, [userInfo, navigate, redirect, shippingAddress]);

  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/place-order");
  };

  return (
    <>
      <div className="row mb-3 mt-5">
        <div className="col-lg-12">
          <SectionHeader header="Payment" />
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb p-0 m-0 bg-transparent my-2 small">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/shipping">Shipping</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Payment
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="shipping mb-3">
        <div className="row">
          <div className="col-lg-6 col-md-10 col-sm-12">
            <div className="shipping-box bg-white p-4 shadow rounded">
              <h5>Payment Methods</h5>
              <form onSubmit={submitHandler}>
                <select
                  className="my-3"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="Paystack"> Paystack </option>
                  <option value="PayPal"> PayPal </option>
                </select>

                <button type="submit" className="btn_one mt-3 w-100">
                  <AiOutlineArrowRight className="mr-2" />
                  Continue
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* <div>
        <CheckoutSteps step1 step2 step3 />
        <h1>Payment Method</h1>
      </div> */}
    </>
  );
};

export default PaymentScreen;
