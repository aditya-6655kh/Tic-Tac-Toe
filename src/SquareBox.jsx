import React from "react";
import './SquareBox.css'

const SquareBox = ({ value, onClick }) => {
  return <button className="Square" onClick={onClick}>{value}</button>;
};

export default SquareBox;
