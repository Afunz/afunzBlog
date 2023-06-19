import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import request from '@/utils/request'
import message from '@/utils/message'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/base.scss'
import BlogItem from '@/components/BlogItem.vue'
import CategoryItem from '@/components/CategoryItem.vue'
import UserItem from '@/components/UserItem.vue'
import CategoryItemList from '@/components/CategoryItemList.vue'
import UserItemList from '@/components/UserItemList.vue'
const app = createApp(App)

app.use(router)
app.use(ElementPlus)
app.config.globalProperties.message=message;
app.config.globalProperties.globalInfo={
  imageUrl:"/api/file/getImage/"
}

app.component('BlogItem',BlogItem)
app.component('CategoryItem',CategoryItem)
app.component('UserItem',UserItem)
app.component('UserItemList',UserItemList)
app.component('CategoryItemList',CategoryItemList)
app.config.globalProperties.request=request;
app.mount('#app')
