import React from 'react';
import { Menu } from 'antd';
import {
  CalendarOutlined,
  MailOutlined,
  SettingOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const MenuPage = ({ userRole, onLogout }) => {
  const navigate = useNavigate();

  const userItems = [
    {
      key: 'account',
      icon: <MailOutlined />,
      label: 'Quản lý tài khoản',
      children: [
        {
          key: 'my__account',
          label: 'Tài khoản của tôi',
          icon: <MailOutlined />,
        },
        {
          key: 'change__password',
          label: 'Đổi mật khẩu',
        },
      ],
    },
    {
      key: 'room__management',
      icon: <CalendarOutlined />,
      label: 'Quản lý phòng',
    },
  ];

  const adminItems = [
    ...userItems,
    {
      key: 'employee__management',
      icon: <SettingOutlined />,
      label: 'Quản lý nhân viên',
    },
  ];

  const logoutItem = {
    key: 'log__out',
    icon: <LinkOutlined />,
    label: 'Đăng xuất',
  };

  const handleMenuClick = (e) => {
    if (e.key === 'log__out') {
      onLogout();
      navigate('/login');
    } else {
      navigate(`/${e.key}`);
    }
  };

  const menuItems = userRole === 'ADMIN' ? [...adminItems, logoutItem] : [...userItems, logoutItem];

  return (
    <Menu
      style={{ width: 256 }}
      mode="inline"
      theme="light"
      items={menuItems}
      onClick={handleMenuClick}
    />
  );
};

export default MenuPage;
