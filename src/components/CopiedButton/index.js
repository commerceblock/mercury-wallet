import React, { cloneElement, useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./copiedButton.css";

let timeout;

function CopiedButton ({ children, handleCopy, style = {} }) {
  const [copied, setCopied] = useState(false);
  const handleClick = () => {
    handleCopy()
    setCopied(true)
  };
  useEffect(() => {
    clearTimeout(timeout);
    if(copied) {
      timeout = setTimeout(() => setCopied(false), 1000);
    }
    return () => clearTimeout(timeout);
  }, [copied]);
  return (
    <div className="copy-btn-wrap">
      {copied && <span className="copied" style={style}>Copied!</span>}
      {cloneElement(children, { onClick: handleClick })}
    </div>
  );
};

CopiedButton.propTypes = {
  children: PropTypes.element,
  handleCopy: PropTypes.func,
  style: PropTypes.object,
};

export default CopiedButton;
