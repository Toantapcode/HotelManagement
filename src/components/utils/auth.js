// export const login = (username, password) => {
//     // Giả sử bạn kiểm tra thông tin đăng nhập với máy chủ ở đây
//     // Ví dụ: gọi API đăng nhập và lấy token

//     // Thay thế bằng API thực tế của bạn
//     if (username === 'admin' && password === 'admin123') {
//         localStorage.setItem('userToken', 'someAdminToken'); // Lưu token cho admin
//         return 'admin';
//     } else if (username === 'user' && password === 'user123') {
//         localStorage.setItem('userToken', 'someUserToken'); // Lưu token cho user
//         return 'user';
//     } else {
//         throw new Error('Tên đăng nhập hoặc mật khẩu không chính xác!');
//     }
// };

// export const logout = () => {
//     localStorage.removeItem('userToken');
//     window.location.href = '/login'; // Điều hướng đến trang đăng nhập
// };
