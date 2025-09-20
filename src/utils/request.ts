import axios from "axios";
import { ElMessage } from 'element-plus'

const request= axios.create({
  baseURL:"https://m1.apifoxmock.com/m1/7137920-6861064-default" 
})


export default request