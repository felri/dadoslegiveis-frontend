import React from "react";

interface ExternalLinkProps {
  children: React.ReactNode;
  url: string;
}

const ExternalLink: React.FC<ExternalLinkProps> = ({ children, url }) => {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.open(url, "_blank");
  };
  return (
    <a href={url} onClick={handleClick}>
      {children}
    </a>
  );
};

export default ExternalLink;
