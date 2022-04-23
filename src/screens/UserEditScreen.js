import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails, updateUser } from "../actions/userActions";
import { USER_UPDATE_RESET } from "../constant/userConstants";
import Message from "../components/Message";
import Loader from "../components/Loader";
import SectionHeader from "../components/SectionHeader";

const UserEditScreen = () => {
  const { id } = useParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userUpdate = useSelector((state) => state.userUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = userUpdate;
  console.log(user);

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET });
      navigate("/admin/users");
    } else {
      if (!user.name || user._id !== id) {
        dispatch(getUserDetails(id));
      } else {
        setName(user.name);
        setEmail(user.email);
        setIsAdmin(user.isAdmin);
      }
    }
  }, [
    successUpdate,
    dispatch,
    id,
    user.name,
    user.email,
    user.isAdmin,
    user._id,
    navigate,
  ]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUser({ _id: id, name, email, isAdmin }));
  };

  return (
    <>
      <div className="row mb-3 mt-5">
        <div className="col-lg-12">
          <SectionHeader header="Edit User" />
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb p-0 m-0 bg-transparent my-2 small">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/admin/users">Users</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                List of Users
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {loading ? (
        <Loader fullPage={true} />
      ) : error ? (
        <Message type="danger">{error}</Message>
      ) : (
        <>
          <div id="login" className="my-2 p-5">
            <div className="row">
              <div className="col-lg-6 col-md-7 col-sm-10">
                <div className="login-box bg-white rounded shadow p-4">
                  <SectionHeader header="Edit" />
                  {errorUpdate && (
                    <Message type="danger" message={errorUpdate} />
                  )}
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
                    <label htmlFor="isAdmin" className="my-3 p">
                      Admin
                      <input
                        id="isAdmin"
                        type="checkbox"
                        label="Is Admin"
                        checked={isAdmin}
                        className="form-control w- my-0 py-0 small"
                        onChange={(e) => setIsAdmin(e.target.checked)}
                      />
                    </label>

                    {loadingUpdate && <Loader smallPage={true} />}
                    <button
                      type="submit"
                      value="Update"
                      className="btn_one mt-2 py-2 w-100"
                    >
                      Update
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default UserEditScreen;
