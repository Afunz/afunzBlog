<template>
  <div>
    <div class="layout">
    <el-container class="container">
      <el-header class="header">
        <div class="logo">
            <img src="../assets/blog.png" alt="" class="header-img">
          <span class="header-content"><em>AfunzBlog</em></span>
        </div>
        <div class="user-info">
          <span>欢迎回来,</span>
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              {{userInfo.nickName}}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="goUserInfo">
                 个人信息
                </el-dropdown-item>
                <el-dropdown-item @click="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <div class="avatar"><img :src="userInfo.avatar"></div>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px"
                  class="left-aside">
                <div>
                  <el-button class="post-btn" @click="createHtml">发布</el-button>
                </div>
                <div class="menu-panel">
                  <ul>
                    <li v-for="(menu,index) in menuList">
                    <span class="menu-title-p" @click="openClose(index)">
                      <span :class="['iconfont',menu.icon]"></span>
                      <span class="menu-title">{{ menu.title }}</span>
                      <span :class="['iconfont','open-close',menu.open?'icon-open':'icon-close']"></span>
                    </span>
                    <ul class="sub-menu" v-show="menu.open">
                      <li v-for="subMenu in menu.children">
                        <router-link :to="subMenu.path" 
                        :class="['sub-menu-item',activePath==subMenu.path?'active':'']" v-if="subMenu.roleType == null || subMenu.roleType==userInfo.roleType">{{ subMenu.title }}</router-link>
                      </li>
                    </ul>
                    </li>
                  </ul>
                </div>
                </el-aside>
        <el-main class="right-main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>

    <Dialog :show="progressDialog.show"
            :title="progressDialog.title"
            :buttons="progressDialog.buttons"
            :show-close="false"
            :showCancel="false"
            width="400px"
            @close="progressDialog.show=false">
            <div class="progress-container">
              <div class="progress-panel">
                <el-progress type="circle" :percentage="progressInfo.progress" :status="progressInfo.status" :color="colors"></el-progress>
              </div>
              <div class="error" v-if="progressInfo.result == 0">
                <div>生成页面出错了：{{ progressInfo.errorMsg }}</div>
                <div class="info">具体错误，请查看服务器日志</div>
              </div>
              <div class="success" v-if="progressInfo.progress == 100 && progressInfo.result == 1">
                发布成功
                
              </div>
              <div class="btn-panel" v-if="progressInfo.progress == 100 || progressInfo.result == 0">
                <el-button class="btn" type="primary" @click="progressDialog.show =false">关闭</el-button>
              </div>
            </div>
    </Dialog>
  </div>
  </div>
</template>

<script setup>
import { useStore } from "vuex"
import { ref,getCurrentInstance,watch,reactive } from 'vue'
const { proxy } = getCurrentInstance();
import  VueCookies  from 'vue-cookies';
import { ArrowDown } from '@element-plus/icons-vue'
import { useRouter,useRoute } from 'vue-router';
const router = useRouter()
const route  = useRoute()
const store = useStore()
const menuList = ref([
  {
    title:"博客",
    icon:"icon-blog",
    open:true,
    children:[
      {
        title:"博客管理",
        path:"/blog/list",
      },
      {
        title:"分类管理",
        path:"/blog/category",
      },
    ],
  },
  {
    title:"专题",
    icon:"icon-zhuanti",
    open:true,
    children:[
      {
        title:"专题管理",
        path:"/special/list",
      },
    ]
  },
  {
    title:"设置",
    icon:"icon-settings",
    open:true,
    children:[
      {
        title:"个人信息设置",
        path:"/setting/my",
      },
      {
        title:"博客成员",
        path:"/setting/user"
      },
      {
        title:"系统设置",
        path:"/setting/sysSetting",
        roleType:1
      },
    ]
  },
  {
    title:"回收站",
    icon:"icon-delete",
    open:true,
    children:[
      {
        title:"回收站",
        path:"/recovery/list",
      },
    ]
  },
])

const openClose = (index)=>{
  const open = menuList.value[index].open;
  menuList.value[index].open=!open
}

const api = {
  'getUserInfo':'/getUserInfo',
  'logout':'/logout',
  'createHtml':'/createHtml',
  'checkProgress':'/checkProgress'
}

const userInfo = ref({})

const init = async ()=>{
  let result = await proxy.request({
    url: api.getUserInfo
  })
  if(!result){
    return
  }
  userInfo.value = result.data
  userInfo.value.avatar = proxy.globalInfo.imageUrl + result.data.avatar
  // userInfo.value = VueCookies.get('userInfo')
  // userInfo.value.avatar=proxy.globalInfo.imageUrl + userInfo.value.avatar
}
init()

const activePath = ref(null)

watch(
  route,(newVal,oldVal)=>{
  console.log(newVal.path);
  activePath.value=newVal.path
},{immediate:true,deep:true}
)

watch(()=>store.state.userInfo,(newVal,oldVal)=>{
  const avatar =proxy.globalInfo.imageUrl + newVal.avatar
  const nickName = newVal.nickName
  userInfo.value = { avatar,nickName },
  {immediate:true,deep:true}
})
const goUserInfo = ()=>{
  router.push('../setting/my')
}



//发布
const colors = [
  {color:"#f56c6c",percentage: 20},
  {color:"#e6a23c",percentage: 40},
  {color:"#6f7ad3",percentage: 60},
  {color:"#1989fa",percentage: 80},
  {color:"#5cb87a",percentage: 100},
  ]

const progressDialog = reactive({
  title: "发布",
  buttons:[],
  show:false
})

const progressInfo = reactive({
  progress:0
})

let checkTimer = null 
const createHtml = async ()=>{
  progressDialog.show= true
  progressInfo.progress = 0
  progressInfo.status = undefined
  let result = await proxy.request({
    url: api.createHtml,
  })
  if(!result){
    return
  }
  checkProgress()
  checkTimer =setInterval(()=>{
    checkProgress()
  },1000)
}

const checkProgress = async ()=>{
  let result = await proxy.request({
    url: api.checkProgress,
    showLoading:false,
  })
  if(!result){
    return
  }
  if(result.data.result == 0){
    progressInfo.status = "exception"
    progressInfo.errorMsg = result.data.errorMsg
  }else{
    progressInfo.progress = result.data.progress
  }
  progressInfo.result = result.data.result
  if(
    (result.data.progress == 100 || result.data.result == 0) && checkTimer !=null
  ){
    clearInterval(checkTimer)
  }
}




//退出
const logout = ()=>{
  proxy.Confirm(`你确定要退出吗`,async ()=>{
    let result = await proxy.request({
      url: api.logout,
    })
    if(!result){
      return
    }
    VueCookies.remove('loginInfo')
    VueCookies.remove('userInfo')
    router.push('/login')
  })
}
</script>


<style lang="scss" scoped>
.layout{
  .header{
    border-bottom: 1px solid #ddd;
  }
  .container{
    background: #f5f6f7;
    height: calc(100vh - 60px);
    .header{
      border-bottom: 1px solid #ddd;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #fff;
      .logo{
        display: flex;
        .header-img{
        margin-top: 7px;
        width: 45px;
        height: 45px;
        }
        .header-content{
      font-weight: 700;
      margin-top: 15px;
      margin-left: 15px;
      font-size: 30px;
      font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif
    }
      }
      .user-info{
        display: flex;
        align-items: center;
        .el-dropdown-link{
          font-size: 16px;
          color: rgb(60, 177, 236);
        }
        .el-dropdown-link:focus {
          outline: none;
        }
        .example-showcase .el-dropdown-link {
            cursor: pointer;
            color: var(--el-color-primary);
            display: flex;
            align-items: center;
          }
        .avatar{
          margin-left: 10px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          border-radius: 50%;
          background: #ddd;
          img{
            border-radius: 50%;
            width: 40px;
            height: 40px;
          }
        }
      }
     
    
    }
    
    .left-aside{
      // padding: 0px 15px;
      padding-top: 10px;
      width: 280px;
      .post-btn{
        background: #409eff;
        color: #fff;
        height: 40px;
        width: 100%;
        border-radius: 5px;
      }
      .menu-panel{
        ul,li{
          padding: 0;
          margin: 0;
          list-style: none;
        }
        .menu-title-p{
          padding: 5px 5px;
          line-height: 40px;
          cursor: pointer;
          display: flex;
          .menu-title{
            flex:1;
            color: #3f4042;
            margin-left: 7px;
          }
          .open-close{
            width: 20px;
            font-size: 14px;
          }
          .iconfont{
            font-size: 19px;
          }
        }
        .menu-title-p:hover{
          background-color: #ddd;
        }
        .sub-menu{
          font-size: 15px;
          .sub-menu-item{
            padding: 6px 7px 0px 30px;
            display: block;
            cursor: pointer;
            line-height: 35px;
            text-decoration: none;
            color: #3f4042;
          }
          .active{
            background: #ddd;
            color: orangered;
          }
          .sub-menu-item:hover{
            background: #ddd;
            color: orangered;
          }
        }
        
      }
    }
    .right-main{
      position: relative;
      background: #fff;
    }
  }
}

.progress-container{
  .progress-panel{
    display: flex;
    justify-content: center
  }
  .error{
    color: red;
    margin-top: 20px;
    .info{
    font-size: 13px;
    }
  }
  .success{
    margin-top: 20px;
    text-align: center;
    font-size: 16px;
    color: green;
  }
  .btn-panel{
    text-align: center;
    margin-top: 20px;
    .btn{
      margin: 0px auto;
    }
  }
}
</style>
