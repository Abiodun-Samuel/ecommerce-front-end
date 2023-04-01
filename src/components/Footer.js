import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <p>
              Copyright &copy; {year}
              <a
                className="mx-1 text-light"
                href="https://www.abiodunsamuel.com/"
                target="_blanck"
              >
                Abiodun Digital Hub
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
