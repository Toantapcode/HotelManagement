import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, Button, Form, Card, Checkbox } from 'antd';
import axiosInstance from '../../request';
import 'antd/dist/reset.css';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { toast, ToastContainer } from 'react-toastify';

const { Option } = Select;

const RoomManagement = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [selectedRoomIds, setSelectedRoomIds] = useState([]);
  const [form] = Form.useForm();

  const fetch = async () => {
    try {
      const response = await axiosInstance.get('http://localhost:8080/getAllRooms');
      const updateData = response.map((item) => ({ ...item, key: item.idRoom }));
      setData(updateData);
    } catch (err) {
      console.log('ERROR', err);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const showAddModal = () => {
    form.resetFields();
    setCurrentRoom(null);
    setIsModalOpen(true);
  };

  const showEditModal = (room) => {
    setCurrentRoom(room);
    form.setFieldsValue(room);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        try {
          if (currentRoom) {
            await axiosInstance.put(`http://localhost:8080/Room/Update/${currentRoom.idRoom}`, values);
            toast.success('Cập nhật phòng thành công!');
          } else {
            await axiosInstance.post('http://localhost:8080/Room/insert', values);
            toast.success('Thêm phòng mới thành công!');
          }
          setIsModalOpen(false);
          fetch();
        } catch (error) {
          console.error('Lỗi khi gửi yêu cầu:', error);
        }
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
        toast.error('Vui lòng kiểm tra các trường và thử lại!');
      });
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`http://localhost:8080/Room/Delete/${id}`);
      toast.success('Xóa phòng thành công!');
      setIsModalOpen(false);
      fetch();
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu xóa:', error);
      toast.error('Lỗi khi xóa phòng!');
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selectedRoomIds.map(id => axiosInstance.delete(`http://localhost:8080/Room/Delete/${id}`)));
      toast.success('Xóa các phòng đã chọn thành công!');
      setSelectedRoomIds([]);
      fetch();
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu xóa:', error);
      toast.error('Lỗi khi xóa phòng!');
    }
  };

  const handleCheckboxChange = (e, id) => {
    e.stopPropagation(); 
    setSelectedRoomIds(prevIds =>
      prevIds.includes(id) ? prevIds.filter(roomId => roomId !== id) : [...prevIds, id]
    );
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex translate-x-[-10%]">
      <ToastContainer />    
      <div className="w-3/4 p-4">
        <Button type="primary" onClick={showAddModal}>
          Thêm phòng mới
        </Button>
        <Button
          type="danger"
          onClick={handleDeleteSelected}
          disabled={selectedRoomIds.length === 0}
          className="ml-4 px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition duration-300"
        >
          Xóa các phòng đã chọn
        </Button>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {data.map((room) => (
            <Card
              key={room.idRoom}
              className="shadow-lg rounded-lg relative"
              onClick={() => showEditModal(room)}
              hoverable
              title={`Phòng: ${room.roomName}`}
              bordered={true}
              extra={room.status === 1 ? <span className="text-green-500">Đang sử dụng</span> : <span className="text-blue-500">Trống</span>}
            >
              <Checkbox
                checked={selectedRoomIds.includes(room.idRoom)}
                onChange={(e) => handleCheckboxChange(e, room.idRoom)}
                className="absolute top-2 left-2 mr-5"
                
              />
              <p><strong>Loại phòng:</strong> {room.roomType}</p>
              <p><strong>Giá:</strong> {room.price} USD</p>
              <p><strong>Mô tả:</strong> {room.description}</p>
              <p><strong>Đã dọn dẹp:</strong> {room.cleaned ? <CheckOutlined className="text-green-500" /> : <CloseOutlined className="text-red-500" />}</p>
            </Card>
          ))}
        </div>
      </div>

      <Modal
        title={currentRoom ? 'Chỉnh sửa phòng' : 'Thêm phòng mới'}
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          currentRoom && (
            <Button key="delete" danger onClick={() => handleDelete(currentRoom.idRoom)}>
              Xóa
            </Button>
          ),
          <Button key="back" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            {currentRoom ? 'Cập nhật' : 'Thêm'}
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          name="roomForm"
          initialValues={{
            idRoom: '',
            roomName: '',
            roomType: '',
            price: '',
            description: '',
            status: '',
            cleaned: ''
          }}
        >
          <Form.Item
            label="ID Phòng"
            name="idRoom"
            rules={[{ required: true, message: 'Vui lòng nhập ID phòng!' }]}
          >
            <Input type="number" placeholder="Nhập ID phòng" />
          </Form.Item>

          <Form.Item
            label="Tên Phòng"
            name="roomName"
            rules={[{ required: true, message: 'Vui lòng nhập tên phòng!' }]}
          >
            <Input placeholder="Nhập tên phòng" />
          </Form.Item>

          <Form.Item
            label="Loại Phòng"
            name="roomType"
            rules={[{ required: true, message: 'Vui lòng chọn loại phòng!' }]}
          >
            <Select placeholder="Chọn loại phòng">
              <Option value="VIP">VIP</Option>
              <Option value="Normal">Normal</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Giá"
            name="price"
            rules={[{ required: true, message: 'Vui lòng nhập giá phòng!' }]}
          >
            <Input type="number" placeholder="Nhập giá phòng" />
          </Form.Item>

          <Form.Item
            label="Mô Tả"
            name="description"
          >
            <Input.TextArea rows={3} placeholder="Nhập mô tả" />
          </Form.Item>

          <Form.Item
            label="Trạng Thái"
            name="status"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Option value="1">Đang sử dụng</Option>
              <Option value="0">Trống</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Đã dọn dẹp"
            name="cleaned"
            valuePropName="checked"
          >
            <Checkbox>Đã dọn dẹp</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoomManagement;
