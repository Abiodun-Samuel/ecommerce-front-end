import React from "react";

const SectionHeader = ({ header, desc = false }) => {
  return (
    <div className="section py-3">
      <h3 className="section_header">{header}</h3>
      {desc && <p className="section_desc">{desc}</p>}
    </div>
  );
};

export default SectionHeader;
