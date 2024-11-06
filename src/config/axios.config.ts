import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const token = process.env.TOKEN_SECRET;



const axiosInstance = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export default axiosInstance;