import axios from "axios";
import { ElMessage } from 'element-plus'

const request= axios.create({
  baseURL:"https://m1.apifoxmock.com/m1/7152065-6876014-default" 
})


export default request