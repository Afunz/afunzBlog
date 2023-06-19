<template>
  <div>
    <el-form class="login-form" 
                        :model="formData"
                        :rules="rules"
                        :style="{widh:'50%'}"
                        :label-width="'200px'"
                        ref="editFormRef">
                  
                      <el-form-item label="是否开启评论/留言板" prop="openCommentType" >
                      <div>
                        <el-radio-group v-model="formData.openCommentType">
                            <el-radio :label="0">是
                            </el-radio>
                            <el-radio :label="1">否
                            </el-radio>
                          </el-radio-group>
                      </div>
                    </el-form-item>
                <template v-if="formData.openCommentType==1">
                  <el-form-item label="畅言appId" prop="changyanAppId">
                        <el-input :maxlength="50" v-model="formData.changyanAppId"></el-input>
                  </el-form-item>
                
                      <el-form-item label="畅言appKey" prop="changyanAppKey">
                        <el-input :maxlength="50" v-model="formData.changyanAppKey"></el-input>
                      </el-form-item>
                    </template>
                    
                        <el-form-item label="是否开启Git Pages" prop="gitPagesType">
                        <div>
                          <el-radio-group v-model="formData.gitPagesType">
                            <el-radio :label="1">是
                            </el-radio>
                            <el-radio :label="0">否
                            </el-radio>
                          </el-radio-group>
                        </div>
                        </el-form-item>
                      
                      <el-form-item label="开启公安备案和ICP备案信息" prop="showIcp">
                        <el-radio-group v-model="formData.showIcp">
                            <el-radio :label="1">是
                            </el-radio>
                            <el-radio :label="0">否
                            </el-radio>
                          </el-radio-group>
                      </el-form-item>
                 
                <template v-if="formData.showIcp==1">
                  <el-form-item label="ICP备案域名" prop="icpDomain">
                    <el-input :maxlength="200" v-model="formData.icpDomain"></el-input>
                  </el-form-item>
                  <el-form-item label="ICP备案号" prop="icpNo">
                    <el-input :maxlength="100" v-model="formData.icpNo"></el-input>
                  </el-form-item>
                  <el-form-item label="公安备案省份" prop="policeProvince">
                    <el-select  v-model="formData.policeProvince" clearable showSearch>
                      <el-option v-for="(item,index) in provinceList" :label="item" :value="item" :key="index">

                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="公安备案号" prop="policeNo">
                    <el-input :maxlength="100" v-model="formData.policeNo"></el-input>
                  </el-form-item>
                </template>
                      <el-form-item label="下载静态页面">
                        <div>
                          <a class="a-link" 
                          href="javascript:void(0)"
                          @click="createZip()"
                          >点击下载</a>
                        </div>
                      </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="submitForm">保存</el-button>
                  </el-form-item>
          </el-form>
  </div>
</template>

<script setup>
import { getCurrentInstance,reactive,ref,nextTick } from "vue";
const { proxy } = getCurrentInstance();
const api = {
  getSysSetting: "/sysSetting/getSysSetting",
  saveSysSetting:"/sysSetting/saveSysSetting",
  createZip:"/sysSetting/createZip"
}
const formData =reactive({})

const provinceList = ["京","津","黑","吉","辽","蒙","冀","鲁","晋","豫","苏","皖","鄂","湘","赣","浙","沪","闽","台","粤","渝","沪"]

const rules = {
  openCommentType:[{required:true, message:"是否开启评论不能为空"}],
  changyanAppId:[{required:true, message:"畅言appId不能为空"}],
  changyanAppKey:[{required:true, message:"畅言appKey不能为空"}],
  gitPagesType:[{required:true, message:"是否开启Git Pages不能为空"}],
  showIcp:[{required:true, message:"是否公安备案和ICP备案信息不能为空"}],
  icpDomain:[{required:true, message:"ICP备案域名不能为空"}],
  icpNo:[{required:true, message:"ICP备案号不能为空"}],
  policeProvince:[{required:true, message:"公安备案省份不能为空"}],
  policeNo:[{required:true, message:"公安备案号不能为空"}],
}

const getSysSetting = async ()=>{
  let result = await proxy.request({
    url: api.getSysSetting
  })
  if(result != null){
    Object.assign(formData, result.data)
  }
}
getSysSetting()

const editFormRef = ref()
const submitForm = ()=>{
  editFormRef.value.validate(async (valid)=>{
    if(!valid){
      return false
    }
    let params = {}
    Object.assign(params, formData)
    let result =await proxy.request({
      url: api.saveSysSetting,
      params
    })
    if(!result){
      return
    }
    proxy.message.success('保存成功')
  })
}


const createZip = async ()=>{
  let result = await proxy.request({
    url: api.createZip
  })
  if(!result){
    return
  }
  document.location.href = "/api/file/download/" + result.data + "/" + encodeURI("静态页面.zip")
}
</script>

<style lang="scss" scoped>
</style>
