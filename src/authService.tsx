import axios from "axios";

export type User = { accessToken: string; id: string; username: string };

const API_URL = "http://localhost:8001/api/user/";

const register = (username: string, password: string) => {
  return axios.post(API_URL + "register", {
    username,
    password,
  });
};

const login = (username: string, password: string) => {
  return axios
    .post(API_URL + "login", {
      username,
      password,
    })
    .then((response) => {
      if (response.data.username) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user")!);
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default AuthService;
