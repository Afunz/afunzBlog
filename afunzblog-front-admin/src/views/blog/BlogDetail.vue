<template>
  <div>
    <Window :show="windowConfig.show" :showCancel="false" :buttons="windowConfig.buttons" @close="windowConfig.show = false">
      <div class="my-title">{{ blog.title }}</div>
      <div v-html="blog.content" class="blog-detail"></div>
    </Window>
  </div>
</template>

<script setup>
import hljs from 'highlight.js';
import "highlight.js/styles/atom-one-light.css"
import { getCurrentInstance,reactive,ref,nextTick } from "vue";
const { proxy } = getCurrentInstance();
const api = {
  'getBlogDetail':'/blog/getBlogById',
}

const windowConfig =ref({
  show:false,
  buttons: [{
    type:"primary",
    text:"确定",
    click:(e)=>{
      windowConfig.value.show = false
    }
  }]
})
const blog = ref({})

const showDetail = async (blogId)=>{
  windowConfig.value.show = true
  let result =await proxy.request({
    url:api.getBlogDetail,
    params:{
      blogId:blogId
    }
  })
  if(!result){
    return
  }
  blog.value = result.data
  nextTick(()=>{
    let blocks = document.querySelectorAll("pre code")
    blocks.forEach((block)=>{
      hljs.highlightBlock(block)
    })
  })
}

defineExpose({ showDetail })
</script>

<style lang="scss" scoped>
.my-title{
  font-size: 18px;
}
.blog-detail{
  blockquote{
  padding: 0 1em;
  color: #6a737d;
  border-left: 0.25em solid #dfe2e5;
  }
  img{
    max-width: 80%;
  }
}

</style>
