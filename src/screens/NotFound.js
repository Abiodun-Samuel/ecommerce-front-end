import React from "react";
import error from "../images/bg/error.jpg";

const NotFound = () => {
  return (
    <div className="row d-flex justify-content-center mt-5">
      <div className="col-lg-6 col-sm-8 text-center mt-2">
        <img className="img-fluid" src={error} alt="page not found" />
        <h5 className="text-danger my-2">Oops, Page Not Found</h5>
      </div>
    </div>
  );
};

export default NotFound;
