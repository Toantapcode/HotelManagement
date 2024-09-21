import React from 'react';
import { Outlet } from 'react-router-dom';
import MenuPage from '../MenuPage';

const Layout = ({ onLogout, userRole }) => {
  return (
    <div style={{ display: 'flex' }}>
      <MenuPage userRole={userRole} onLogout={onLogout} />
      <div style={{ marginLeft: '256px', padding: '20px', width: '100%' }}>
        <Outlet /> 
      </div>
    </div>
  );
};

export default Layout;
