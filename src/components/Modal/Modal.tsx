import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.scss";

type Props = {
  titles: JSX.Element[];
  previousRoute: string;
  subtitles: string[];
  footer?: string;
  children: JSX.Element;
  styles?: React.CSSProperties;
  overrideCloseFunction?: (e: any) => void;
};

const Modal = ({
  titles = [],
  previousRoute,
  subtitles = [],
  footer = "",
  children,
  styles = {},
  overrideCloseFunction,
}: Props): JSX.Element => {
  const navigate = useNavigate();

  const closeFunction = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (overrideCloseFunction) {
      overrideCloseFunction(e);
    } else {
      navigate(previousRoute);
    }
  };
  
  return (
    <div className={`modal`} onClick={closeFunction}>
      <div 
        style={styles}
        className={`modal-content dark`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          {titles.map((title) => (
            <h2 
              key={title.toString()}
              className="modal-title">{title}</h2>
          ))}
          <button className="close-button" onClick={closeFunction}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          {subtitles.map((subtitle) => (
            <p className="modal-subtitle">{subtitle}</p>
          ))}
          {children}
        </div>
        <div className="modal-footer">
          <p className="modal-subtitle">{footer}</p>
        </div>
      </div>
    </div>
  );
};

export default Modal;
