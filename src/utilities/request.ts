import axios from "axios";

const request= axios.create({
    baseURL: "https://m1.apifoxmock.com/m1/7137920-6861064-default",
    timeout: 5000
})

export default request