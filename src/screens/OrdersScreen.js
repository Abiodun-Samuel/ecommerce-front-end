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
import { AiFillEye } from "react-icons/ai";
import Time from "../components/Time";

const OrdersScreen = () => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders } = orderList;

  const myOrders = orders.filter((order) => {
    return order.user._id === userInfo._id;
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      dispatch(listOrders());
    } else {
      navigate("/login");
    }
    return () => {
      // dispatch({ type: ORDER_PAY_RESET });
      // dispatch({ type: ORDER_DELIVER_RESET });
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
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          {myOrders.length !== 0 ? (
            <div className="table-responsive ">
              <table className="table table-hover shadow-sm">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">S/N</th>
                    <th scope="col">Date Ordered</th>
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
                      {/* <td>{order._id.substring(0, 2) + "..."}</td> */}
                      <td>{order.createdAt.substring(0, 10)}</td>
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
                            Delivered on: ({<Time time={order.deliveredAt} />})
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
            <Message
              type="danger"
              message="You have  not placed any order yet"
            />
          )}
        </>
      )}
    </>
  );
};

export default OrdersScreen;
