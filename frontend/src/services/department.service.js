import axios from "axios";
const API_URL = "http://localhost:7000/api/departments";

export const departmentService = {
  getAll: () => axios.get(API_URL).then(res => res.data),
};