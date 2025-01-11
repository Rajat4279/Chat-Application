import axios from "axios";

const axiosInstance = axios.create({
    baseURL: `http://localhost:5001/api`,
    withCredentials: true //send cookies in every single request
});

export { axiosInstance };