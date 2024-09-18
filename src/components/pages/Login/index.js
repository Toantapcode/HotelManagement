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

  // Hàm xử lý đăng nhập với API
  const handleLogin = async () => {
    try {
      // Gửi yêu cầu POST đến API và nhận về token và role
      const response = await axiosInstance.post('http://localhost:8080/auth/login', {
        email: emailInput,
        password: passwordInput
      });
      console.log(response)
      // Giả sử API trả về token và role
      if (response) {
        const { token, role, id } = response  ;

        
        // In ra console những gì nhận được từ API
        console.log("Token:", token);
        console.log("Role:", role);
        console.log("UserID:", id);
        
        // Nếu token và role trả về, đăng nhập thành công
        if (token && role) {
          // Lưu token vào localStorage
          localStorage.setItem("token", token);
          // localStorage.setItem("token", token);
          
          // Gọi hàm onLogin để xử lý logic cho role
          onLogin(role);

          // Điều hướng dựa trên vai trò của người dùng
          navigate(role === 'ADMIN' ? '/' : '/my__account');
        } else {
          // Nếu không có token hoặc role, thông báo lỗi
          toast.error("Đăng nhập không thành công, vui lòng thử lại!");
        }
      }

    } catch (error) {
      // Hiển thị lỗi nếu có lỗi từ API
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
