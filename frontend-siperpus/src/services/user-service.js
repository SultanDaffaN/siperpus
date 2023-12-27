import APIConfig from '../api/APIConfig';
import authHeader from './auth-header';

class UserService {
  getPublicContent() {
    return APIConfig.get("/test/all")
  }

  getStaffData() {
    return APIConfig.get("/users/staff")
  }

  getPenggunaBoard() {
    return APIConfig.get("/test/pengguna", { headers: authHeader() })
  }

  getPengunjungBoard() {
    return APIConfig.get("/test/pengunjung", { headers: authHeader() })
  }

  getStaffBoard() {
    return APIConfig.get("/test/staff", { headers: authHeader() })
  }

  getKepalaBoard() {
    return APIConfig.get("/test/kepala", { headers: authHeader() })
  }
}

export default new UserService();
