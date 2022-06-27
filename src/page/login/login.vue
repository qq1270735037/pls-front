<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">欢迎登录</h3>
      </div>
	  <div>
		 <el-form-item prop="userAccount">
		   <el-input 
				style="width: 400px;"
				prefix-icon="el-icon-user-solid"
				ref="userAccount"
				v-model="loginForm.userAccount"
				placeholder="请输入用户名"
				name="userAccount"
				type="text"
				tabindex="1"
				auto-complete="on"
		   />
		 </el-form-item>
		 
		 <el-form-item prop="userPassword">
		   <el-input
				style="width: 400px;"
				prefix-icon="el-icon-lock"
				ref="userPassword"
				v-model="loginForm.userPassword"
				type="password"
				placeholder="请输入输入密码"
				name="userPassword"
				tabindex="2"
				auto-complete="on"
				@keyup.enter.native="handleLogin"
		   />
		 </el-form-item>
		 
		 <el-button :loading="loading" type="primary" style="width:400px;margin-top:30px;" @click.native.prevent="handleLogin">登录</el-button> 	  
	  </div>
    </el-form>
  </div>
</template>

<script>
import { userLogin } from "@/api/getData.js";
import { setStorage } from "@/utils/localStorage.js"
export default {
  data() {
    const validateUserAccount = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validateUserPassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        userAccount: '',
        userPassword: ''
      },
      loginRules: {
        userAccount: [{ required: true, trigger: 'blur', validator: validateUserAccount }],
        userPassword: [{ required: true, trigger: 'blur', validator: validateUserPassword }]
      },
      loading: false,
      redirect: undefined
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          //1.发送登录请求后台方法,请求js
		  userLogin(this.loginForm).then(res => {
			  if(res != -1){
				  //正确的逻辑代码
				  //2.把后台返回的用户数据存入到缓存
				  setStorage("userInfo", JSON.stringify(res.datas));
				  //3.跳转到首页
				  this.$router.push({name: "home"});
				  //4.给用户提示
				  this.$message.success("登录成功");
			  }else{
				  setTimeout(() => {
					  this.loading = false;
				  }, 3000)
			  }
		  })
        } else {
			this.$message.error('请输入正确的用户名和密码');
			return false;
        }
      })
    }
  },
  mounted() {
  	//获取route查询是否有消息返回
	let message = this.$route.query.message;
	if(message){
		this.$message.error(message);
	}
  }
}
</script>

	
	
<style>
body{
	
}
.title{
	font-size: 40px;
	color: white; 
}
.login-container{
	text-align: center;
	width: 100%;
	background-color: rgb(45,58,75);
	height: 100vh;
}	
.login-form{
	text-align: center;
	position: relative;
	top: 200px;
}
.el-form-item__error{
	width: 100%;
	text-align: center;
	font-size: 15px;
}
</style>
