import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { listProductDetails, updateProduct } from "../actions/productActions";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  PRODUCT_CREATE_RESET,
  PRODUCT_UPDATE_RESET,
} from "../constant/productConstants";
import axios from "axios";
import SectionHeader from "../components/SectionHeader";
import { BASE_URL } from "../config";
import { getCategories } from "../actions/categoryActions";
import { slugify } from "../utils/utils";

const ProductEditScreen = () => {
  const { slug } = useParams();
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [inflatedPrice, setInflatedPrice] = useState(0);
  const [image, setImage] = useState("");
  const [images, setImages] = useState([]);

  // const [images, setImages] = useState([]);
  const [category, setCategory] = useState("");
  const [category_slug, setCategorySlug] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [uploading, setUpLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate;

  const {
    loading: loadingCategory,
    error: errorCategory,
    categories,
  } = useSelector((state) => state.categoryList);

  useEffect(() => {
    dispatch(getCategories());
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      navigate("/admin/products");
    } else {
      if (!product || product.slug !== slug) {
        dispatch(listProductDetails(slug));
      } else {
        setName(product.name);
        setPrice(product.price);
        setInflatedPrice(product.inflatedPrice);
        setImage(product.image);
        setImages(product.images);
        setBrand(product.brand);
        setCategory(product.category);
        setCategorySlug(product.category_slug);
        setCountInStock(product.countInStock);
        setDescription(product.description);
      }
    }

    return () => {
      dispatch({ type: PRODUCT_CREATE_RESET });
    };
  }, [product, dispatch, slug, navigate, successUpdate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateProduct({
        slug,
        name,
        price,
        inflatedPrice,
        image,
        images,
        brand,
        category,
        category_slug: slugify(category),
        countInStock,
        description,
      })
    );
  };

  const uploadImage = async (base64EncodedImage) => {
    setUpLoading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${BASE_URL()}/api/upload/upload-cloudinary`,
        JSON.stringify({ data: base64EncodedImage }),
        config
      );
      console.log(data);
      setImage(data.public_id);
      setImages(data.public_id);
      setUpLoading(false);
    } catch (error) {
      console.error(error);
      setUpLoading(false);
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onloadend = () => {
      uploadImage(reader.result);
    };

    reader.onerror = () => {
      console.error("AHHHHHHHH!!");
    };
  };

  return (
    <>
      <div className="row mb-3 mt-5">
        <div className="col-lg-12">
          <SectionHeader header="Edit Product" />
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb p-0 m-0 bg-transparent my-2 small">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/admin/products">Products</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Edit Product
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {loadingUpdate && <Loader fullPage={true} />}
      {errorUpdate && <Message type="danger">{errorUpdate}</Message>}
      {loading ? (
        <Loader fullPage={true} />
      ) : error ? (
        <Message type="danger">{error}</Message>
      ) : (
        <div className="update_product">
          <div className="row mt-5">
            <div className="col-lg-10">
              <div className="shadow p-4 bg-white">
                <form onSubmit={submitHandler}>
                  <label htmlFor="">Product Title</label>
                  <input
                    type="text"
                    value={name}
                    placeholder="Enter your name"
                    className=""
                    onChange={(e) => setName(e.target.value)}
                  />
                  <label htmlFor="">Product Discount Price</label>
                  <input
                    type="number"
                    value={price}
                    placeholder="Enter your price"
                    className=""
                    onChange={(e) => setPrice(e.target.value)}
                  />
                  <label htmlFor="">Product Price(2)</label>
                  <input
                    type="number"
                    value={inflatedPrice}
                    placeholder="Enter your price(market price)"
                    className=""
                    onChange={(e) => setInflatedPrice(e.target.value)}
                  />
                  {/* <label htmlFor="">Product Price(2)</label>
                  <input
                    type="text"
                    value={image}
                    placeholder="Enter your email"
                    className=""
                    onChange={(e) => setImage(e.target.value)}
                  /> */}

                  <label htmlFor="">Product Brand</label>
                  <input
                    type="text"
                    value={brand}
                    placeholder="Enter your brand"
                    className=""
                    onChange={(e) => setBrand(e.target.value)}
                  />
                  <label htmlFor="">Product stock</label>
                  <input
                    type="number"
                    value={countInStock}
                    placeholder="Enter your count in stock"
                    className=""
                    onChange={(e) => setCountInStock(e.target.value)}
                  />
                  <label htmlFor="">Product Category</label>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                    }}
                  >
                    {categories?.map((category, index) => (
                      <option
                        key={category + index}
                        value={category.category_name}
                      >
                        {category.category_name}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="">Product Description</label>
                  <input
                    type="text"
                    value={description}
                    placeholder="Enter your description"
                    className=""
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <label htmlFor="">Product Image</label>
                  <label>
                    <input type="file" onChange={uploadFileHandler} />
                  </label>

                  {uploading && <Loader smallPage={true} />}
                  <button
                    type="submit"
                    value="Update"
                    className="btn_one mt-3 py-2 w-100"
                  >
                    Update
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductEditScreen;
