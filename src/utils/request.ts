import axios from "axios";
import { ElMessage } from 'element-plus'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

const request= axios.create({
  baseURL:"https://m1.apifoxmock.com/m1/7178788-6903177-default" 
})

export default request;
//http://172.20.10.2:8080
//https://m1.apifoxmock.com/m1/7178788-6903177-default
