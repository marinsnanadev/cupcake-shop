import React from 'react';
import './Footer.css';
import { STORE_NAME } from './storeConfig';

function Footer() {
  return (
    <footer className="site-footer">
      <span className="footer-mark">{STORE_NAME}</span>
      <p>Feito com carinho para adoçar o seu dia.</p>
    </footer>
  );
}

export default Footer;
