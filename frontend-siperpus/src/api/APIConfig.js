import axios from "axios";
import authHeader from "../services/auth-header";

const APIConfig= axios.create({
    // Uncomment this while deploy
    baseURL: "https://si-perpus-smp131jakarta.herokuapp.com/api",
    headers: authHeader()

    // Uncomment this if you want to use your own database
    // baseURL: "http://localhost:8080/api/",
    // headers: authHeader()
});

export default APIConfig;