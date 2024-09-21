import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import MyAccount from './components/pages/ManagementAccount/MyAccount';
import ChangePassword from './components/pages/ManagementAccount/ChangePassword';
import ManagementRoom from './components/pages/ManagementRoom';
import ManagementEmployee from './components/pages/ManagementEmployee/ManagementEmployee';
import Login from './components/pages/Login';

function App() {
  const [userRole, setUserRole] = useState(null);

  const handleLogin = (role) => {
    setUserRole(role);
  };

  const handleLogout = () => {
    setUserRole(null);
  };

  const PrivateRoute = ({ element }) => {
    return userRole ? element : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/" element={<PrivateRoute element={<Layout onLogout={handleLogout} userRole={userRole} />} />}>
          <Route path="my__account" element={<MyAccount />} />
          <Route path="change__password" element={<ChangePassword />} />
          <Route path="room__management" element={<ManagementRoom />} />
          <Route path="employee__management" element={<ManagementEmployee />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
