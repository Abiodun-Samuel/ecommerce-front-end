import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <p>Copyright &copy; {year} MyShop</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
