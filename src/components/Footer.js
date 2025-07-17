import React from 'react';
import packageJson from '../../package.json';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const version = packageJson.version;

  return (
    <footer
      style={{
        background: '#1976d2',
        color: '#fff',
        textAlign: 'center',
        padding: '16px 0',
        fontSize: '1rem',
        letterSpacing: '0.5px',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.04)',
        marginTop: 'auto',
      }}
    >
      Centre médical Dr Ghemning · {currentYear} · v{version}
    </footer>
  );
};

export default Footer; 