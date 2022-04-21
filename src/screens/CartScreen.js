import React, { useEffect, useState } from "react";
import {
  Link,
  useParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Message from "../components/Message";
import { addToCart, removeFromCart } from "../actions/cartActions";
import SectionHeader from "../components/SectionHeader";
import { AiFillDelete, AiFillEye } from "react-icons/ai";
import { BsFillBagCheckFill } from "react-icons/bs";
import { Image } from "cloudinary-react";

const CartScreen = () => {
  const { id } = useParams();
  const productId = id;
  const [searchParams] = useSearchParams();
  const quantity = searchParams.get("quantity")
    ? Number(searchParams.get("quantity"))
    : 1;
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, quantity));
    }
  }, [dispatch, productId, quantity]);
  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };
  const navigate = useNavigate();
  const checkOutHandler = () => {
    navigate("/login?redirect=shipping");
  };
  return (
    <>
      <div className="row mb-3 mt-5">
        <div className="col-lg-12">
          <SectionHeader header="Shopping Cart" />
        </div>
      </div>

      <div className="row">
        <div className="col-lg-9 my-2">
          {cartItems.length === 0 ? (
            <Message type="danger">
              Your cart is empty. <Link to="/">Home</Link>
            </Message>
          ) : (
            <div className="table-responsive ">
              <table className="table table-hover shadow-sm">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">S/N</th>
                    <th scope="col">Image</th>
                    <th scope="col">Product</th>
                    <th scope="col">Price</th>
                    <th scope="col">In Stock</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((product, index) => (
                    <tr key={product._id + index}>
                      <th scope="row">{index + 1}</th>
                      <td>
                        <Image
                          cloudName="psalmzie"
                          publicId={product.image}
                          width="auto"
                          height="50"
                          crop="scale"
                          alt={product.name}
                          className="img-fluid"
                        />
                      </td>
                      <td>{product.name}</td>
                      <td> &#8358; {product.price}</td>
                      <td> {product.countInStock}</td>
                      <td>
                        <select
                          value={product.quantity}
                          onChange={(e) =>
                            dispatch(addToCart(product.product, e.target.value))
                          }
                        >
                          {[...Array(product.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="d-flex align-items-center">
                        <Link
                          to={`/product/${product.product}`}
                          className="table_edit_btn"
                        >
                          <AiFillEye />
                        </Link>
                        <button
                          onClick={() => removeFromCartHandler(product.product)}
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
          )}
        </div>

        <div className="col-lg-3 my-2">
          <div className="table-responsive">
            <table className="table table-hover shadow bg-white">
              <thead className="thead-dark text-center">
                <tr>
                  <th scope="col" className="h5">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="h6">
                <tr>
                  <td>
                    <b>Quantity:</b>{" "}
                    <span className="text-primary">
                      {cartItems.reduce(
                        (acc, item) => Number(acc) + Number(item.quantity),
                        0
                      )}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <b> Price:</b>
                    <span className="text-primary">
                      {" "}
                      &#8358;
                      {cartItems
                        .reduce(
                          (acc, item) => acc + item.quantity * item.price,
                          0
                        )
                        .toFixed(2)}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <button
                      onClick={checkOutHandler}
                      className="btn_one w-100"
                      type="button"
                      disabled={cartItems.length === 0}
                    >
                      <BsFillBagCheckFill className="mx-2" /> Check Out
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* <h2>
              

      {/* <div>
      <Row>
        <Col md={8}>
          <h1>Shopping Cart</h1>
          {cartItems.length === 0 ? (
            <Message>
              Your cart is empty. <Link to="/">Go Back</Link>
            </Message>
          ) : (
            <ListGroup variant="flush">
              {cartItems.map((item) => (
                <ListGroup.Item key={item.product}>
                
                  
                    <Col md={2}>{item.price}</Col>
                    <Col md={2}>
                     
                    </Col>
                    <Col md={2}>
                      <Button
                        type="button"
                        variant="light"
                        onClick={() => removeFromCartHandler(item.product)}
                      >
                        Remove
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        
        </Col>
      </Row>
    </div> */}
    </>
  );
};

export default CartScreen;
