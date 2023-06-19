<template>
  <div class="user-body">
    <UserItemList v-for="item in userList" :data="item"></UserItemList>
  </div>
</template>

<script setup>
import { getCurrentInstance,reactive,ref,nextTick } from "vue";
const { proxy } = getCurrentInstance();
const api = {
  'loadTeamUser':'/view/loadTeamUser',
}

const userList = ref([])
const loadUserList = async () => {
  let result =await proxy.request({
    url: api.loadTeamUser,
  })
  if(!result){
    return
  }
  userList.value = result.data
  nextTick(() => {
    let url = document.location.href;
    if(url.indexOf("#")==-1){
      return
    }
    let hashId =url.substring(url.indexOf("#")+1)
    document.getElementById(hashId).scrollIntoView()
  })
}
loadUserList()
</script>

<style lang="scss" scoped>
.user-body{
  background: #fff;
  padding: 15px;
}
</style>

