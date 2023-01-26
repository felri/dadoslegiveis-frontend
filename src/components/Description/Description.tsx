import React from "react";
import "./styles.scss";
interface DescriptionProps {
  children: React.ReactNode;
}

const Description: React.FC<DescriptionProps> = ({ children }): JSX.Element => {
  return (
    <div className="description-container">
      <span className="description">
        {children}
      </span>
    </div>
  );
};

export default Description;
