import axios, { AxiosResponse } from "axios";

class AxiosConfig {
  instance;

  constructor() {
    this.instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_URL,
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

  async getCategorys(){
    return await this.instance.get("/category/all")
  }

  async deleteCategory(id: number){
    return await this.instance.delete(`/category/${id}`)
  }

  async createCategory(name: string, type: string){
    return await this.instance.post("/category", {name, type})
  }

  async editCategory(id: number, name: string){
    return await this.instance.put(`/category/${id}`, {name})
  }

}

const config = new AxiosConfig();

export default config;