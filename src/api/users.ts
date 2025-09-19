import request from "@/utilities/request";

//yonghu请求登录
export const login =(loginInfo) => {
    return request({
        method: "POST",
        url:"/api/user/login",
    })
}