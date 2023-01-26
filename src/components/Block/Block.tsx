import React from "react";
import { Link } from "react-router-dom";
import "./styles.scss";
interface BlockProps {
  icon: React.ReactNode;
  title: string;
  url: string;
}

const Block: React.FC<BlockProps> = ({ icon, title, url }): JSX.Element => {
  return (
    <Link to={url} className="block-container" >
      <div >{title}</div>
      <span className="block">
        {icon}
      </span>
    </Link>
  );
};

export default Block;
