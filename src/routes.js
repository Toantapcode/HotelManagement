import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import MenuPage from './components/MenuPage';
import MyAccount from './components/pages/ManagementAccount/MyAccount';
import ChangePassword from './components/pages/ManagementAccount/ChangePassword';
import ManagementRoom from './components/pages/ManagementRoom';
import ManagementEmployee from './components/pages/ManagementEmployee/ManagementEmployee';
import Layout from './components/Layout';

const ProtectedRoute = ({ children, userRole, requiredRole }) => {
    if (userRole !== requiredRole) {
        return <Navigate to="/login" />;
    }
    return children;
};

const AppRoutes = ({ userRole, onLogout }) => (
    <Router>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route
                path="/"
                element={
                    userRole ? (
                        <Layout onLogout={onLogout} userRole={userRole} />
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            >
                <Route
                    path="menu"
                    element={
                        <ProtectedRoute userRole={userRole} requiredRole="ADMIN">
                            <MenuPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="my__account"
                    element={
                        <ProtectedRoute userRole={userRole} requiredRole="ADMIN">
                            <MyAccount />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="change__password"
                    element={
                        <ProtectedRoute userRole={userRole} requiredRole="ADMIN">
                            <ChangePassword />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="room__management"
                    element={
                        <ProtectedRoute userRole={userRole} requiredRole="ADMIN">
                            <ManagementRoom />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="employee__management"
                    element={
                        <ProtectedRoute userRole={userRole} requiredRole="ADMIN">
                            <ManagementEmployee />
                        </ProtectedRoute>
                    }
                />
            </Route>
        </Routes>
    </Router>
);

export default AppRoutes;
