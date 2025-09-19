import request from "@/utilities/request";

//用户登录-参数类型
type LoginInfo = {
    username: string
    password: string
}
//用户登录-返回数据类型
type LoginResult = {
    success: boolean
    state: number
    message: string
    content: string
}
//yonghu请求登录
export const login =(loginInfo:LoginInfo) => {
    return request<LoginResult>({
        method: "POST",
        url:"/api/user/login",
        data: loginInfo,
    })
}
//要求请求类型 application/x-www.form-urlencoded，
//  需求把数据拼接为 data:`属性值1=值1&属性值2=值2` 
// 要求请求类型 application/json
//  只需要直接传对象 data:loginInfo
//这是我自己写的注解，防止被问
