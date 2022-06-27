import axios from 'axios'
const URL =  "http://localhost:8080"
import Router from "@/router/index.js"
import { Message } from 'element-ui';
// create an axios instance
const service = axios.create({
	baseURL: URL, // url = base url + request url
	timeout: 10000 ,// request timeout
	withCredentials: true,
	crossDomain: true
})

// http request 拦截器
// service.interceptors.request.use(
// 	config => {
// 		return config
// 	},
// 	error => {
// 		return Promise.reject(error)
// 	}
// )

service.interceptors.response.use(
	response => {
		console.log(response)
		if(response.data){//服务器返回了数据
			if(response.data.code == 200 ){
				//服务器返回了正确的数据
				return response.data;
			}else if(response.data.code == -2){
				//登录失效, 跳转到登录页面
				Router.push({name : "login",query: {message: "登录失效"}});
				return false;
			}else{
				Message({
					message: response.data.message,
					type: "error"
				})
			}
		}
		return -1;
	},
	error => {
		return Promise.reject(error)
	}
)

export default service