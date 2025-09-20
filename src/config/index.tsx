import { Form as TransactionForm } from "@/components/transaction-form/types"; 
import { Transaction } from "@/components/transaction-manager/types";
import axios, { AxiosError, AxiosResponse } from "axios";

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

      this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if(error.response?.status === 401){
          localStorage.removeItem("token");
          window.location.href = "/login";
        }else if(error?.code === "ERR_NETWORK"){
          alert("Sem conexão com a internet")
        }
        return Promise.reject(error)
      }
    )
  }

  // =========== Auth =================
  async login(username: string, password: string): Promise<AxiosResponse> {
    return await this.instance.post("/login", { username, password })
  }

  async register(username: string, password: string, confirmPassword: string){
    return await this.instance.post("/register", {username, password, confirmPassword})
  }

  // ========== Category ==============
  async getCategories(){
    return await this.instance.get("/category");
  }

async getCategoryNames(type: "INCOME" | "EXPENSE"){
    return await this.instance.get(`/category/names?type=${type}`);
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

  // ============ Accounts ============ 
  async getAccounts(){
    return await this.instance.get("/account");
  }

  async getAccountNames(){
    return await this.instance.get("/account/names");
  }

  async deleteAccount(id: number){
    return await this.instance.delete(`/account/${id}`)
  }

  async createAccount(name: string, openingBalance: number){
    return await this.instance.post("/account", {name, openingBalance})
  }

  async editAccount(id: number, name: string, openingBalance: number){
    return await this.instance.put(`/account/${id}`, {name, openingBalance})
  }

  // ================== transaction ==================
  async createTransaction(data: TransactionForm){
    return await this.instance.post("/transaction", data)
  }

  async getTransaction(query?: string){
    if(query){
      return await this.instance.get(`/transaction?${query}`)
    }else{
      return await this.instance.get(`/transaction`)
    }
  }

  async updateTransaction(data: Omit<Transaction, "userId"|"id"|"category"|"account">, transactionId: number){
    return await this.instance.put(`/transaction/${transactionId}`, data)
  }
}

const config = new AxiosConfig();

export default config;