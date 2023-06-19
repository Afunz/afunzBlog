<template>
  <div>
    <div class="top">
      <div class="top-nav">
        <router-link to="/" class="logo">AfunzBlog</router-link>
        <router-link v-for="item in menus" :to="item.path" :class="['nav-item',item.path == activePath?'active':'']">{{ item.name }}</router-link>
      </div>
    </div>
    <div class="body-container">
      <router-view />
    </div>
    <div class="footer">
      <div>©2023-{{new Date().getFullYear()}} {{sysInfo.icpDomain}} rights reserved. {{ sysInfo.policeProvince }}ICP备{{sysInfo.icpNo}}</div>
      <div>{{ sysInfo.policeProvince }}公网安备 {{sysInfo.policeNo}}</div>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance,reactive,ref,nextTick,watch } from "vue";
import { useRouter} from 'vue-router';
const { proxy } = getCurrentInstance();
const router = useRouter()

const api = {
  'getSysInfo':'/view/getSysInfo'
}

//路由菜单
const menus = [
  {
    name:'博客',
    path:'/'
  },
  {
    name:'分类专栏',
    path:'/category'
  },
  {
    name:'专题',
    path:'/special'
  },
  {
    name:'成员',
    path:'/user'
  },
  {
    name:'留言板',
    path:'/message'
  },
]


//底部信息
const sysInfo =ref([])
const loadSysInfo = async () => {
  let result =await proxy.request({
    url: api.getSysInfo
  })
  if(!result){
    return
  }
  console.log(result);
  sysInfo.value = result.data
}
loadSysInfo()

const activePath = ref(null)
watch(()=> router,(newVal,oldVal)=>{
  activePath.value = newVal.currentRoute.value.meta.activePath
},{immediate:true,deep:true})
</script>

<style lang="scss" scoped>
</style>
