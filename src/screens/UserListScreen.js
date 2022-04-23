import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listUsers, deleteUser } from "../actions/userActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Link, useNavigate } from "react-router-dom";
import SectionHeader from "../components/SectionHeader";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";

const UserListScreen = () => {
  const dispatch = useDispatch();
  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDelete = useSelector((state) => state.userDelete);
  const { success: successDelete } = userDelete;

  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listUsers());
    } else {
      navigate("/login");
    }
  }, [dispatch, userInfo, navigate, successDelete]);

  const deleteHandler = (id) => {
    if (window.confirm("Delete?")) dispatch(deleteUser(id));
  };

  return (
    <>
      <div className="row mb-3 mt-5">
        <div className="col-lg-12">
          <SectionHeader header="Users" />
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb p-0 m-0 bg-transparent my-2 small">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
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
          <div className="table-responsive">
            <table className="table table-hover shadow-sm">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">S/N</th>
                  <th scope="col">ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id + index}>
                    <th scope="row">{index + 1}</th>
                    <td>{user._id.substring(0, 5) + "..."}</td>
                    <td>{user.name}</td>
                    <td>
                      <Link to={`mailto:${user.email}`}>{user.email}</Link>
                    </td>
                    <td>
                      <span>{user.isAdmin ? "Admin" : "User"}</span>
                    </td>
                    <td className="d-flex align-items-center">
                      <Link
                        to={`/admin/user/${user._id}/edit`}
                        className="table_edit_btn"
                      >
                        <AiFillEdit />
                      </Link>
                      <button
                        onClick={() => deleteHandler(user._id)}
                        className="table_del_btn"
                      >
                        <AiFillDelete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
};

export default UserListScreen;
