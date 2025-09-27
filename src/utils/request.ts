import axios from "axios";
import { ElMessage } from 'element-plus'

const request= axios.create({
  baseURL:"http://127.0.0.1:4523/m1/7178788-6903177-default" 
})


export default request