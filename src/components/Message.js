import React from "react";

const Message = ({ type = "", message = "", children }) => {
  return (
    <>
      <div className={`alert alert-${type} fade show`} role="alert">
        {message && <p className="py-0 my-0 font-weight-bold">{message}</p>}
        {children && <p className="py-0 my-0 font-weight-bold">{children}</p>}
      </div>
    </>
  );
};

export default Message;
