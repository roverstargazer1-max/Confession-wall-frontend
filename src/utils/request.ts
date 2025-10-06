import axios from "axios";
import { ElMessage } from 'element-plus'

const request= axios.create({
  baseURL:"http://172.20.10.2:8080" 
})
export default request
//http://172.26.183.59:8080
//https://m1.apifoxmock.com/m1/7178788-6903177-default
//http://172.20.10.2:8080