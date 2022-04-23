import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listOrders } from "../actions/orderActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Link, useNavigate } from "react-router-dom";
import {
  MY_ORDER_LIST_RESET,
  ORDER_DELIVER_RESET,
  ORDER_DETAILS_RESET,
  ORDER_PAY_RESET,
} from "../constant/orderConstants";
import SectionHeader from "../components/SectionHeader";
import Time from "../components/Time";
import { AiFillEye } from "react-icons/ai";

const OrderListScreen = () => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders } = orderList;

  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrders());
    } else {
      navigate("/login");
    }
    return () => {
      dispatch({ type: MY_ORDER_LIST_RESET });
      dispatch({ type: ORDER_DETAILS_RESET });
    };
  }, [dispatch, userInfo, navigate]);

  return (
    <>
      <div className="row mb-3 mt-5">
        <div className="col-lg-12">
          <SectionHeader header="Orders" />
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb p-0 m-0 bg-transparent my-2 small">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Orders
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
          {/* <span>ID, User, Date, Total Price, Paid, Delivered</span> */}

          {orders.length !== 0 ? (
            <div className="table-responsive ">
              <table className="table table-hover shadow-sm">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">S/N</th>
                    <th scope="col">ID</th>
                    <th scope="col">User</th>
                    <th scope="col">Date</th>
                    <th scope="col">Total Price</th>
                    <th scope="col">Paid</th>
                    <th scope="col">Delivered</th>
                    <th scope="col">Order Details</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={order._id + index}>
                      <th scope="row">{index + 1}</th>
                      <td>{order._id.substring(0, 5) + "..."}</td>
                      <td>
                        <span>{order.user && order.user.name}</span>
                      </td>
                      <td>
                        <Message type="success">
                          <Time time={order.createdAt} />
                        </Message>
                      </td>
                      <td> &#8358;{order.totalPrice}</td>
                      <td>
                        {order.isPaid ? (
                          <>
                            <Message type="success">
                              Paid on: {<Time time={order.paidAt} />}
                            </Message>
                          </>
                        ) : (
                          <Message type="danger" message="Not Paid" />
                        )}
                      </td>
                      <td>
                        {order.isDelivered ? (
                          <Message type="success">
                            Delivered on: {<Time time={order.deliveredAt} />}
                          </Message>
                        ) : (
                          <Message type="danger" message="Not Delivered" />
                        )}
                      </td>
                      <td>
                        <Link className="btn_one" to={`/order/${order._id}`}>
                          <AiFillEye className="mx-2" /> Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Message type="danger" message="No Order Placed Yet" />
          )}
        </>
      )}
    </>
  );
};

export default OrderListScreen;
