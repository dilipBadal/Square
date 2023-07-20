/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './popUP.css'

const Popup = ({ closePopup, message, buttonName }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      closePopup();
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [closePopup]);

  return (
    <div className="popup">
      <div className="popup-content card">
        <p className="m-auto text-center">{message}</p>
        <button className="btn btn-primary mx-2" onClick={closePopup}>
          {buttonName}
        </button>
      </div>
    </div>
  );
};

export default Popup;
