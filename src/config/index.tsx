import axios, { AxiosError, AxiosResponse } from "axios";

class AxiosConfig {
  instance;

  constructor() {
    this.instance = axios.create({
      baseURL: "http://localhost:5000",
    })

    this.instance.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async login(username: string, password: string): Promise<AxiosResponse> {
    return await this.instance.post("/login", { username, password })
  }

  async register(username: string, password: string, confirmPassword: string){
    return await this.instance.post("/register", {username, password, confirmPassword})
  }

}

const config = new AxiosConfig();

export default config;