import React, { useState } from 'react';
import './index.css';
import { FaUser, FaLock } from "react-icons/fa";
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../request'

const Login = ({ onLogin }) => {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post('http://localhost:8080/auth/login', {
        email: emailInput,
        password: passwordInput
      });
      console.log(response)
      if (response) {
        const { token, role, id } = response  ;
        // console.log("Token:", token);
        // console.log("Role:", role);
        // console.log("UserID:", id);

        if (token && role) {
          localStorage.setItem("token", token);
          onLogin(role);
          navigate('/');
        } else {
          toast.error("Đăng nhập không thành công, vui lòng thử lại!");
        }
      }
    } catch (error) {
      console.log(error)
      toast.error("Có lỗi xảy ra khi kết nối đến server, vui lòng thử lại!");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!emailInput || !passwordInput) {
      toast.error("Email và mật khẩu không được để trống!");
    } else {
      handleLogin();
    }
  };

  return (
    <div className="wrapper">
      <ToastContainer transition={Bounce} />
      <form onSubmit={handleSubmit}>
        <h1>Đăng nhập</h1>
        <div className="input__box">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            required
          />
          <FaUser className="icon" />
        </div>
        <div className="input__box">
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            required
          />
          <FaLock className="icon" />
        </div>
        <div className="remember__forgot">
          <input type="checkbox" name="save__password" />
          <p>Lưu mật khẩu</p>
        </div>
        <button type="submit" className="btn__login">Đăng nhập</button>
      </form>
    </div>
  );
};

export default Login;
