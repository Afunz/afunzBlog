<template>
    <el-upload
    name="file"
    :show-file-list="false"
    accept=".png,.PNG,.jpg,.JPG,.jepg,.JEPG,.gif,.GIF,.bmp,.BMP"
    :multiple="false"
    :http-request="uploadImage"
  >
    <div class="cover-upload-btn">
      <template v-if="modelValue">
        <img :src="proxy.globalInfo.imageUrl+modelValue">
      </template>
      <!-- <el-button type="primary" plain="true" v-else>上传封面</el-button> -->
      <span class="iconfont icon-jia" v-else></span>
    </div>
  </el-upload>
</template>

<script setup>
import { getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance();

const props = defineProps({
 
    modelValue:{
    type:String,
    default:null
    }

  })

const api = {
  uploadUrl: "file/uploadImage"
}
const emit =defineEmits()
const uploadImage = async (file)=>{
  console.log(file);
  let result = await proxy.request({
    url: api.uploadUrl,
    dataType: "file",
    params:{
      file: file.file,
      type: 0,
    }
  })
  
  console.log(result);
  const fileName = result.data.fileName
  emit('update:modelValue',fileName)
  emit('callback',fileName)
}
</script>

<style lang="scss" scoped>
.cover-upload-btn{
  // background: url(../assets/cover_bg.png) no-repeat;
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  .iconfont{
    font-size: 30px;
    color: rgb(164,164,164);
  }
  img{
  width: 100%;
  }
}

</style>
