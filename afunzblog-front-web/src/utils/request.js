import axios from 'axios'
import { ElLoading } from 'element-plus'
import router from '@/router'
// import { useRouter } from 'vue-router';
import message from '@/utils/Message';
import  VueCookies  from 'vue-cookies';
// const router = useRouter()
const contentTypeForm = "application/x-www-form-urlencoded;charset=UTF-8";
const contentTypeJson = "application/json"
const contentTypeFile = "multipart/form-data"

const request = (config)=>{
  let { url,params,dataType='form',showLoading='true' } = config
  // dataType = dataType ? "form" : dataType;
  // showLoading = showLoading ? true : showLoading;

  let contentType = contentTypeForm;
  if(dataType === "json"){
    contentType = contentTypeJson
  }else if(dataType === 'file'){
    contentType = contentTypeFile
    let param = new FormData()
    for (let key in params) {
      param.append(key,params[key])
    }
    params =  param;
  }

  const instance = axios.create({
    baseURL:'/api',
    timeout:10*1000,
    headers:{
      'Content-Type': contentType,
      'X-Requested-With':'XMLHttpRequest'
    }
  })

  let loading = null
  instance.interceptors.request.use((config)=>{
    if(showLoading){
      loading = ElLoading.service({
        lock: true,
        text: '加载中...',
        background: 'rgba(0, 0, 0, 0.7)',
      })
    }
    return config
  },
  (error)=>{
    if (showLoading && loading) {
      loading.close();
    }
    message.error('发送请求失败')
    return Promise.reject('发送请求失败')
    }
  )
  instance.interceptors.response.use(
    (response)=>{
    if (showLoading && loading) {
      loading.close();
    }
    const responseData = response.data
    if(responseData.status == 'error'){
      if(responseData.code == 901){
        VueCookies.remove('loginInfo')
        VueCookies.remove('userInfo')
        router.push("/login")
        return Promise.reject("登录超时")
      }
      if(config.errorCallback){
        config.errorCallback();
        
      }
      return Promise.reject(responseData.info)
    }else if(responseData.code == 200){
      return responseData
    }
   
   },
   (error)=>{
    if (showLoading && loading) {
      loading.close();
    }
    return Promise.reject('网络异常')
   }
  )
   return instance.post(url, params).catch(error =>{
    message.error(error)
    return null;
   })

  //  let result = new Promise((resolve,reject)=>{
  //   instance.post(url,params).then(res=>{
  //     resolve(res);
  //   }).catch(error =>{
  //     message.error(error)
  //   })
  //  })
  //  return result

}

export default request