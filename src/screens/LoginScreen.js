import React, { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../actions/userActions";
import Message from "../components/Message";
import Loader from "../components/Loader";
import SectionHeader from "../components/SectionHeader";
import { FaSignInAlt } from "react-icons/fa";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [searchParams] = useSearchParams();
  let redirect;
  searchParams.has("redirect")
    ? (redirect = "/" + searchParams.get("redirect"))
    : (redirect = "/");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [userInfo, navigate, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  return (
    <div id="login" className="mt-5 p-5">
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader fullPage={true} />}

      <div className="row">
        <div className="col-lg-6 col-md-7 col-sm-10">
          <div className="login-box bg-white rounded shadow p-4">
            <SectionHeader header="Sign In" />
            <form onSubmit={submitHandler}>
              <input
                type="email"
                value={email}
                placeholder="Enter your email"
                className="bg-white"
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                className=""
                onChange={(e) => setPassword(e.target.value)}
              />

              <span className="text-danger small">
                New Customer?
                <Link to="/register"> Register</Link>
              </span>

              <button type="submit" className="btn_one w-100 mt-3">
                <FaSignInAlt className="mx-3" /> Login
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* <div>
        <Link to={redirect ? `/register?redirect=${redirect}` : "/register"}>
          Register
        </Link>
      </div> */}
    </div>
  );
};

export default LoginScreen;
