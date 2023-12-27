import { data } from "autoprefixer";
import axios from "axios";

const API_URL = "https://si-perpus-smp131jakarta.herokuapp.com/api/auth/";
// const API_URL = "http://localhost:8080/api/auth/";

class AuthService {
  login(username, password) {
    return axios
      .post(API_URL + "signin", {
        username,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(name, nisn, username, email, role,password) {
    data = {
      "name": name,
      "nisn": nisn,
      "username": username,
      "email": email,
      "role": role,
      "password": password
    }
    return axios.post(API_URL +  "signup", data);
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));;
  }
}

export default new AuthService();
