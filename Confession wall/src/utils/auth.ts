// 存储token到localStorage
export const setToken = (token: string) => {
  localStorage.setItem('token', token);
};

// 从localStorage获取token
export const getToken = () => {
  return localStorage.getItem('token');
};

// 清除localStorage中的token
export const removeToken = () => {
  localStorage.removeItem('token');
};

// 存储用户信息
export const setUserInfo = (userInfo: any) => {
  localStorage.setItem('userInfo', JSON.stringify(userInfo));
};

// 获取用户信息
export const getUserInfo = () => {
  const userInfo = localStorage.getItem('userInfo');
  return userInfo ? JSON.parse(userInfo) : null;
};