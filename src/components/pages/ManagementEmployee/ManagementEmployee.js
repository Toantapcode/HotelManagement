import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message } from 'antd';
import axiosInstance from '../../../request';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

const { Option } = Select;

const AdminManagement = () => {
    const [users, setUsers] = useState([]);
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
        // Fetch users from API using axios
        fetch()
    }, []);

    const handleEdit = (user) => {
        setEditingUser(user);
        form.setFieldsValue({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            password: user.password,  // Load the existing password into the form
        });
        setIsModalVisible(true);
    };

    const handleDelete = (id) => {
        axiosInstance.delete(`http://localhost:8080/admin/delete/${id}`)
            .then(() => {
                message.success('User deleted successfully.');
                fetch();
            })
            .catch(error => {
                console.error('Error deleting user:', error);
                message.error('Error deleting user.');
            });
    };

    const handleModalOk = () => {
        form
            .validateFields()
            .then(values => {
                if (editingUser) {
                    // Update user
                    axiosInstance.put(`http://localhost:8080/admin/update/${values.id}`, values)
                        .then(() => {
                            message.success('User updated successfully.');
                            setIsModalVisible(false);
                            fetch(); // Fetch lại dữ liệu sau khi cập nhật thành công
                        })
                        .catch(error => {
                            console.error('Error updating user:', error); // Log error if any
                            message.error('Error updating user.');
                        });
                } else {
                    // Create new user
                    axiosInstance.post('http://localhost:8080/auth/register', values)
                        .then(response => {
                            console.log('Created User:', response.data); // Log the newly created user
                            message.success('User created successfully.');
                            setIsModalVisible(false);
                            fetch(); // Fetch lại dữ liệu sau khi thêm thành công
                        })
                        .catch(error => {
                            console.error('Error creating user:', error); // Log error if any
                            message.error('Error creating user.');
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
            title: 'Name',
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
                    <Button onClick={() => handleEdit(record)} type="link">Edit</Button>
                    <Button onClick={() => handleDelete(record.id)} type="link" danger>
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="p-6 max-w-4xl mx-auto bg-gray-100 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Manage Users</h2>
            <Button
                type="primary"
                onClick={() => {
                    setEditingUser(null);
                    form.resetFields();
                    setIsModalVisible(true);
                }}
                className="mb-4"
            >
                Add User
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
                        rules={[{ required: true, message: 'Cần nhập nhân viên' }]}  // Thông báo khi bỏ trống
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Tên đăng nhập"
                        rules={[{ required: true, message: 'Cần nhập tên đăng nhập' }]}  // Thông báo khi bỏ trống
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Mật khẩu"
                        rules={[
                            { required: true, message: 'Cần nhập mật khẩu' },  // Thông báo khi bỏ trống
                            {
                                pattern: /^(?=.*[A-Z]).{8,}$/,  // Kiểm tra mật khẩu hợp lệ (dài hơn 8 kí tự và có kí tự in hoa)
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
