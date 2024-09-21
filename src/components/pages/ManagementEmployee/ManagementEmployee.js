import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message } from 'antd';
import axiosInstance from '../../../request';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

const { Option } = Select;

const AdminManagement = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [form] = Form.useForm();
    const [data, setData] = useState([])
    const [visiblePassword, setVisiblePassword] = useState(false);
    const fetch = async () => {
        try {
            const data = await axiosInstance.get('http://localhost:8080/admin/getAllUsers')
            console.log(data)
            const updateData = data.usersList.map(item => ({ ...item, key: item.id }))
            setData(updateData)
            
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        fetch()
    }, []);

    const handleEdit = (user) => {
        setEditingUser(user);
        form.setFieldsValue({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            password: user.password, 
        });
        setIsModalVisible(true);
    };

    const handleDelete = (id) => {
        axiosInstance.delete(`http://localhost:8080/admin/delete/${id}`)
            .then(() => {
                message.success('Xoá thành công.');
                fetch();
            })
            .catch(error => {
                console.error(error);
                message.error('Lỗi khi xóa người dùng.');
            });
    };

    const handleModalOk = () => {
        form
            .validateFields()
            .then(values => {
                if (editingUser) {
                    axiosInstance.put(`http://localhost:8080/admin/update/${values.id}`, values)
                        .then(() => {
                            message.success('Cập nhật người dùng thành công.');
                            setIsModalVisible(false);
                            fetch();
                        })
                        .catch(error => {
                            console.error(error);
                            message.error('Lỗi khi cập nhật.');
                        });
                } else {
                    axiosInstance.post('http://localhost:8080/auth/register', values)
                        .then(response => {
                            console.log(response.data);
                            message.success('Thêm người dùng mới thành công.');
                            setIsModalVisible(false);
                            fetch();
                        })
                        .catch(error => {
                            console.error( error); 
                            message.error('Lỗi khi thêm người mới.');
                        });
                }
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    const handlePasswordVisibility = () => {
        setVisiblePassword(!visiblePassword);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role) => <span>{role === 'ADMIN' ? 'Admin' : 'User'}</span>,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <div>
                    <Button onClick={() => handleEdit(record)} type="link">Sửa</Button>
                    <Button onClick={() => handleDelete(record.id)} type="link" danger>
                        Xóa
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="p-6 max-w-4xl mx-auto bg-gray-100 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Quản lý Nhân viên</h2>
            <Button
                type="primary"
                onClick={() => {
                    setEditingUser(null);
                    form.resetFields();
                    setIsModalVisible(true);
                }}
                className="mb-4"
            >
                Thêm nhân viên
            </Button>
            <Table
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                dataSource={data}
            />

            <Modal
                title={editingUser ? 'Edit User' : 'Add User'}
                visible={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText={editingUser ? 'Update' : 'Create'}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={editingUser ? { ...editingUser } : {}}
                >
                    <Form.Item name="id" label="ID" hidden>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="name"
                        label="Tên nhân viên"
                        rules={[{ required: true, message: 'Cần nhập nhân viên' }]} 
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Tên đăng nhập"
                        rules={[{ required: true, message: 'Cần nhập tên đăng nhập' }]}  
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Mật khẩu"
                        rules={[
                            { required: true, message: 'Cần nhập mật khẩu' }, 
                            {
                                pattern: /^(?=.*[A-Z]).{8,}$/,
                                message: 'Mật khẩu phải dài hơn 8 kí tự và có kí tự in hoa',
                            }
                        ]}
                    >
                        <Input.Password
                            placeholder="Nhập mật khẩu"
                            iconRender={visiblePassword ? (visible) => <EyeOutlined /> : (visible) => <EyeInvisibleOutlined />}
                            onClick={handlePasswordVisibility}
                        />
                    </Form.Item>
                    <Form.Item
                        name="role"
                        label="Vai trò"
                        rules={[{ required: true, message: 'Cần chọn vai trò' }]}
                    >
                        <Select>
                            <Option value="ADMIN">Admin</Option>
                            <Option value="USER">User</Option>
                        </Select>
                    </Form.Item>
                </Form>

            </Modal>
        </div>
    );
};

export default AdminManagement;
