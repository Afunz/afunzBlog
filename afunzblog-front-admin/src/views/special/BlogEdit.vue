<template>
  <div>
    <Window :show="windowConfig.show" :buttons="windowConfig.buttons" @close="closeWindow">
      <el-form class="login-form" 
                        :model="blogFormData"
                        :rules="rules"
                        ref="blogFormRef">
                  <el-form-item  prop="title">
                    <div class="title-input">
                      <el-input v-model="blogFormData.title"  placeholder="请输入博客标题" class="borderNone">
                      </el-input>
                    </div>
                  </el-form-item>
                  <el-form-item  prop="content">
                    <div :style="{'width':'100%'}">
                      <EditorHtml :height="editorHtmlHeight" v-model="blogFormData.content" @htmlContent="setHtmlContent" v-if="blogFormData.editorType==0"></EditorHtml>
                      <EditorMarkdown :height="editorMarkdownHeight" v-model="blogFormData.markdownContent" @htmlContent="setHtmlContent" v-else></EditorMarkdown>
                    </div>                    
                  </el-form-item>
      </el-form>
    </Window>
  </div>
</template>

<script setup>
import { ref,reactive,getCurrentInstance, onMounted,nextTick,onUnmounted }  from 'vue'
const { proxy } = getCurrentInstance();

const api = {
  "saveSpecialBlog":'/blog/saveBlog4Special',
  'getUserInfo':'/getUserInfo',
  'getBlogDetail':'/blog/getBlogById',
  'autoSave':'/blog/autoSaveBlog4Special',
  
}

const init = (type,data) =>{
  console.log(data);
  startTimer()
  windowConfig.value.show = true
  nextTick(()=>{
    blogFormRef.value.resetFields()
    blogFormData.value = { categoryId: data.categoryId,pBlogId:data.blogId}
    if(type === 'add'){
      getUserInfo();
    }else{
      getBlogDetail(data.blogId)
    }
  })
}

defineExpose({ init })

const getUserInfo = async ()=>{
  let result = await proxy.request({
    url:api.getUserInfo,
  })
  if(!result){
    return
  }
  blogFormData.value.editorType = result.data.editorType
}

//获取博客详情
const getBlogDetail = async (blogId) =>{
  let result = await proxy.request({
    url: api.getBlogDetail,
    params:{
      blogId
    }
  })
  if(!result){
    return
  }
  blogFormData.value = result.data
  if(result.data.tag){
    blogFormData.value.tag = result.data.tag.split("|")
  }else{
    blogFormData.value.tag = []
  }
}

//自动保存
let timmer = ref(null)
const startTimer = ()=>{
  timmer.value = setInterval(() => {
  autoSave()
  }, 10000);
}


const cleanTimer = ()=>{
  if(timmer.value !== null){
    clearInterval(timmer.value)
    timmer.value = null
  }
}
const autoSave = async ()=>{
  if(blogFormData.value.title == undefined || blogFormData.value.content == undefined || timmer.value == null){
    return
  }
  const params = {}
  Object.assign(params,blogFormData.value)
  let result = await proxy.request({
    url: api.autoSave,
    showLoading:false,
    params:params
  })
  if(!result){
    return
  }
  blogFormData.value.blogId = result.data
}


onUnmounted(()=>{
  cleanTimer()
})
const editorMarkdownHeight = window.innerHeight - 60 - 20 - 30 - 50 - 100
const editorHtmlHeight = window.innerHeight - 60 - 20 - 30 - 50 - 150
//新增，修改
const windowConfig =ref({
  show:false,
  buttons: [{
    type:"primary",
    text:"确定",
    click:()=>{
      submitBlog()
    }
  }]
})
const emit = defineEmits()
const closeWindow = ()=>{
  windowConfig.value.show = false
  emit('callback')
  if(timmer.value !== null){
    cleanTimer()
  }
  
}
const showEdit = (type,data)=>{
  windowConfig.value.show = true
}

//博客正文
const blogFormRef=ref(null)
const blogFormData=ref({ tag:[] })
const setHtmlContent = (htmlContent)=>{
  blogFormData.value.content = htmlContent
}
//展示配置弹窗
const submitBlog = ()=>{
  blogFormRef.value.validate(async (valid)=>{
    if(!valid){
      return
    }
    let params = Object.assign({},blogFormData.value)
    let result =await proxy.request({
      url:api.saveSpecialBlog,
      params
    })
    if(!result){
      return
    }
    proxy.message.success('保存博客成功')
    closeWindow()
  })
}

const rules = {
  title:[{required:true, message:"请输入标题"}],
  content:[{required:true, message:"请输入正文"}],
  categoryId:[{required:true, message:"请选择博客分类"}],
  type:[{required:true, message:"请选择博客类型"}],
  allowComment:[{required:true, message:"请选择是否允许评论"}],
  reprintUrl:[{required:true, message:"请输入原文地址"}]
}



</script>

<style lang="scss" scoped>
.title-input {
  width: 100%;
  border-bottom: 1px solid #ddd;
  ::v-deep .el-input__wrapper{
    box-shadow: none;
    border: none;
  }
  ::v-deep input{
    font-size: 18px;
  }
}


</style>
