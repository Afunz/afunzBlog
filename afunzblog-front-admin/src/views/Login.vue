<template>
  <div class="login-body">
    <div class="login-panel">
      <div class="login-title">用户登录</div>
    <el-form class="login-form" 
             :model="formData"
             :rules="rules"
             ref="formDataRef"
    >
      <el-form-item prop="account">
        <el-input v-model="formData.account" placeholder="请输入账号" >
          <template #prefix>
            <span class="iconfont icon-zhanghu"></span>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="formData.password" placeholder="请输入密码" show-password>
          <template #prefix>
            <span class="iconfont icon-mima"></span>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="checkCode">
        <div class="check-code-panel">
          <el-input v-model="formData.checkCode" placeholder="请输入验证码" class="input-panel" @keyup.enter.native="login">
            <template #prefix>
              <span class="iconfont icon-yanzhengma"></span>
            </template>
          </el-input>
          <img :src="checkCodeUrl" class="check-code" @click="changeCheckCode">
        </div>
      </el-form-item>
      <el-form-item label="">
        <el-checkbox v-model="formData.rememberMe" :true-label="1" >记住我</el-checkbox>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" :style="{width:'100%'}" @click="login">登录</el-button>
      </el-form-item>
    </el-form>
    </div>
  </div>
</template>

<script setup>
import  VueCookies  from 'vue-cookies';
import md5 from 'js-md5'
import { getCurrentInstance,ref,reactive } from 'vue'
import { useRouter } from 'vue-router';
const { proxy } = getCurrentInstance();



const router = useRouter()
const api = {
  checkCode : "/api/checkCode",
  login:"/login"
}


const checkCodeUrl=ref(api.checkCode)

const changeCheckCode = ()=>{
  checkCodeUrl.value = api.checkCode+'?'+ new Date().getTime()
}



const formDataRef=ref(null)
const formData = reactive({})

//表单验证
const rules={
  account:[{
    required:true,
    message:"请输入用户名"
  }],
  password:[{
    required:true,
    message:"请输入密码"
  }],
  checkCode:[{
    required:true,
    message:"请输入验证码"
  }]
}

const init = ()=>{
  const loginInfo = VueCookies.get("loginInfo")
  if(!loginInfo){
    return;
  }
  Object.assign(formData,loginInfo);
}
init()


const login = ()=>{
  formDataRef.value.validate(async (valid)=>{
    if(!valid){
      return
    }


    let cookieLoginInfo = VueCookies.get("loginInfo")
    let cookiePassword = cookieLoginInfo == null ? null : cookieLoginInfo.password;

    if(formData.password !== cookiePassword){
       formData.password = md5(formData.password)
    }




    let params = {
        account: formData.account,
        password: formData.password,
        checkCode: formData.checkCode
      }
   
   
    
    let result = await proxy.request({
      url:api.login,
      params: params,
      errorCallback:()=>{
        changeCheckCode()
      }
    })
    if(!result){
        return
      }
      
    proxy.message.success('登录成功')
    router.push("/")
    const loginInfo={
      account: params.account,
      password: params.password,
      rememberMe: formData.rememberMe
    }
    VueCookies.set('userInfo',result.data,0)
    if(formData.rememberMe == 1){
      VueCookies.set('loginInfo',loginInfo,'7d')
    }
  })
}





</script>

<style lang="scss" scoped>
.login-body{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: calc(100vh);
  background-size: cover;
  background-position: center;
  background-image: url(../assets/login-bg.jpg);
  .login-panel{
    width: 500px;
    height: 350px;
    padding: 20px;
    background: #fff;
    border-radius: 5px;
    box-shadow: 2px 2px 10px #ddd;
    .login-title{
      color: rgb(114, 169, 241);
      font-size: 25px;
      text-align: center;
    }
    .login-form{
      margin-top: 20px;
    }
    .check-code-panel{
      width: 100%;
      display: flex;
      align-items: center;
      .input-panel{
        flex: 1;
        margin-right: 5px;
      }
      .check-code{
        height: 30px;
        cursor: pointer;
      }
    }
  }
}
</style>
