import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../actions/productActions";
import Product from "../components/Product";
import { Row, Col } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { Link, useParams } from "react-router-dom";
import ProductCarousel from "../components/ProductCarousel";
import Paginate from "../components/Paginate";
import SearchBox from "../components/SearchBox";
import Category from "../components/Category";
import { Carousel } from "bootstrap";
import { getCategories } from "../actions/categoryActions";
import hero1 from "../images/bg/hero1.jpg";
import hero2 from "../images/bg/hero2.jpg";
import hero3 from "../images/bg/hero3.jpg";
import SectionHeader from "../components/SectionHeader";

const SearchScreen = () => {
  const images = [hero1, hero2, hero3];
  const { keyword } = useParams();
  let { pageNumber } = useParams();
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;
  const {
    loading: loadingCategory,
    error: errorCategory,
    categories,
  } = useSelector((state) => state.categoryList);

  React.useEffect(() => {
    dispatch(listProducts(keyword, pageNumber));
    dispatch(getCategories());
  }, [dispatch, keyword, pageNumber]);

  return (
    <>
      <div className="row mt-5 mb-2">
        <div className="col-lg-4 my-2">
          <SearchBox />
          <div className="category-box shadow p-3">
            <h5>Categories</h5>
            <Category
              loadingCategory={loadingCategory}
              errorCategory={errorCategory}
              categories={categories}
            />
          </div>
        </div>
        <div className="col-lg-8 my-2">
          <div className="hero-img">
            <img className="img-fluid" src={hero1} alt="search result" />
          </div>
        </div>
      </div>

      <div className="row mt-2">
        <div className="col-lg-12">
          <SectionHeader header="Search Result" />
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb p-0 m-0 bg-transparent my-2 small">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Search Results
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {loading ? (
        <Loader fullPage={true} />
      ) : error ? (
        <Message danger="danger">{error}</Message>
      ) : (
        <>
          <div className="row">
            {products.length > 0 ? (
              products.map((product) => {
                return (
                  <div
                    className="col-lg-2 col-md-4 col-sm-6 col-6 my-2"
                    key={product._id}
                  >
                    <Product product={product} />
                  </div>
                );
              })
            ) : (
              <div className="col-lg-12 my-2">
                <Message
                  type="danger"
                  message="Oops, No products found. You can search for another product"
                />
              </div>
            )}
          </div>

          <div className="row my-2">
            <div className="col-lg-12">
              <Paginate
                page={page}
                pages={pages}
                keyword={keyword ? keyword : ""}
              />
            </div>
          </div>
          {/* <Row>
            {products.map((product) => {
              return (
                <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
                  <Product product={product} />
                </Col>
              );
            })}
          </Row>
          <Paginate
            page={page}
            pages={pages}
            keyword={keyword ? keyword : ""}
          /> */}
        </>
      )}
    </>
  );
};

export default SearchScreen;
