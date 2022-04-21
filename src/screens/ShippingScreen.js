import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { saveShippingAddress } from "../actions/cartActions";
import CheckoutSteps from "../components/CheckoutSteps";
import SectionHeader from "../components/SectionHeader";
import { AiOutlineArrowRight } from "react-icons/ai";

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  // let redirect;
  // searchParams.has("redirect")
  //   ? (redirect = "/" + searchParams.get("redirect"))
  //   : (redirect = "/");
  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [userInfo, navigate]);

  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const [country, setCountry] = useState(shippingAddress.country);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate("/payment");
  };

  return (
    <>
      <div className="row mb-3 mt-5">
        <div className="col-lg-12">
          <SectionHeader header="Shipping" />
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb p-0 m-0 bg-transparent my-2 small">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Shipping
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="shipping mb-3">
        <div className="row">
          <div className="col-lg-6 col-md-10 col-sm-12">
            <div className="shipping-box bg-white p-4 shadow rounded">
              <h5>Shipping Details</h5>
              <form onSubmit={submitHandler}>
                <input
                  type="text"
                  value={address}
                  placeholder="Enter your address"
                  className=""
                  required
                  onChange={(e) => setAddress(e.target.value)}
                />
                <input
                  type="text"
                  value={city}
                  placeholder="Enter your city"
                  className=""
                  onChange={(e) => setCity(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Postal Code"
                  value={postalCode}
                  className=""
                  onChange={(e) => setPostalCode(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Enter Country"
                  value={country}
                  className=""
                  onChange={(e) => setCountry(e.target.value)}
                />
                <button
                  type="submit"
                  className="btn_one mt-3 w-100 d-flex align-items-center"
                >
                  <AiOutlineArrowRight className="mr-2" /> Continue
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShippingScreen;
