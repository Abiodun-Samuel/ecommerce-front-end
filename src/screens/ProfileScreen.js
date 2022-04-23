import React, { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails, updateUserProfile } from "../actions/userActions";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_RESET,
} from "../constant/userConstants";
import { myOrdersList } from "../actions/orderActions";
import SectionHeader from "../components/SectionHeader";
import { toastMessage } from "../utils/utils";
import { FaSignInAlt } from "react-icons/fa";

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.userDetails);
  const { userInfo } = useSelector((state) => state.userLogin);
  const { success } = useSelector((state) => state.userUpdateProfile);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      if (!user.name || !user || success) {
        dispatch({ type: USER_UPDATE_PROFILE_RESET });
        dispatch(getUserDetails("profile"));
      } else {
        setName(user.name);
        setEmail(user.email);
      }
    }
  }, [dispatch, userInfo, navigate, user, success]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Password does not match");
    } else {
      dispatch(updateUserProfile({ id: user._id, name, email, password }));
    }
  };

  return (
    <>
      <div className="row mb-3 mt-5">
        <div className="col-lg-12">
          <SectionHeader header="User Profile" />
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb p-0 m-0 bg-transparent my-2 small">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Profile
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div id="login" className="my-1 p-5">
        {loading && <Loader fullPage={true} />}
        {error && <Message type="danger">{error}</Message>}

        <div className="row">
          <div className="col-lg-6 col-md-7 col-sm-10">
            <div className="login-box bg-white rounded shadow p-4">
              <SectionHeader header="User" />
              {message && <Message type="danger">{message}</Message>}

              <form onSubmit={submitHandler}>
                <input
                  type="text"
                  value={name}
                  placeholder="Enter your name"
                  className="form-control"
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  type="email"
                  value={email}
                  placeholder="Enter your email"
                  className="form-control"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  className="form-control"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="confirm Password"
                  value={confirmPassword}
                  className="form-control"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {success &&
                  toastMessage(
                    "success",
                    "Your profile has been updated successfully"
                  )}

                <button type="submit" className="btn_one mt-4 py-2 w-100">
                  Update
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileScreen;
