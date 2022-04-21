import React, { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../actions/userActions";
import Message from "../components/Message";
import Loader from "../components/Loader";
import SectionHeader from "../components/SectionHeader";
import { toastMessage } from "../utils/utils";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);

  const [searchParams] = useSearchParams();
  let redirect;
  searchParams.has("redirect")
    ? (redirect = "/" + searchParams.get("redirect"))
    : (redirect = "/");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error, userInfo } = userRegister;

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [userInfo, navigate, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toastMessage("error", "Password does not match");
    } else {
      dispatch(register(name, email, password));
    }
  };

  return (
    <>
      <div id="login" className="mt-5 mb-3 p-5">
        {loading && <Loader fullPage={true} />}
        {error && <Message variant="danger">{error}</Message>}

        <div className="row">
          <div className="col-lg-6 col-md-7 col-sm-10">
            <div className="register-box bg-white rounded shadow p-4">
              <SectionHeader header="Sign Up" />
              <form onSubmit={submitHandler}>
                <input
                  type="text"
                  value={name}
                  placeholder="Enter your name"
                  className=""
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  type="email"
                  value={email}
                  placeholder="Enter your email"
                  className=""
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  className=""
                  onChange={(e) => setPassword(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  className=""
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span className="text-danger small">
                  Already registered?
                  <Link to="/login"> Login</Link>
                </span>

                <button type="submit" className="btn_one w-100 mt-3">
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterScreen;
