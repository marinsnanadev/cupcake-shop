import React from 'react';
import './SplashPage.css';
import { STORE_NAME } from './storeConfig';

function SplashPage({ image, onEnter }) {
  return (
    <div className="splash-page">
      <img className="splash-image" src={image} alt="Cupcakes gourmet da loja" />
      <div className="splash-overlay" />
      <div className="splash-content">
        <p className="splash-tag">Cupcakes feitos com carinho</p>
        <h1 className="splash-title">{STORE_NAME}</h1>
        <button type="button" className="splash-button" onClick={onEnter}>
          Conheça a loja
        </button>
      </div>
    </div>
  );
}

export default SplashPage;
