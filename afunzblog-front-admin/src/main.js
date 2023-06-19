import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/icon/iconfont.css'
import request from '@/utils/request'
import store from '@/store'
import message from '@/utils/message'
import Verify from '@/utils/Verify'
import Confirm from '@/utils/Confirm'
import router from '@/router'
import VueCookies  from 'vue-cookies';
import Table from '@/components/Table.vue'
import Cover from '@/components/Cover.vue'
import Dialog from '@/components/Dialog.vue'
import CoverUpload from '@/components/CoverUpload.vue'
import Window from '@/components/Window.vue'
import EditorMarkdown from '@/components/EditorMarkdown.vue'
import EditorHtml from '@/components/EditorHtml.vue'
import VueMarkdownEditor from '@kangc/v-md-editor';


const app=createApp(App)
app.use(ElementPlus)
app.use(router)
app.use(store)
app.use(VueMarkdownEditor);
app.config.globalProperties.Confirm=Confirm;
app.config.globalProperties.request=request;
app.config.globalProperties.message=message;
app.config.globalProperties.Verify=Verify;
app.config.globalProperties.VueCookies=VueCookies
app.config.globalProperties.globalInfo={
    imageUrl:"/api/file/getImage/"
}
app.component('Table',Table)
app.component('Cover',Cover)
app.component('Dialog',Dialog)
app.component('CoverUpload',CoverUpload)
app.component('Window',Window)
app.component('EditorMarkdown',EditorMarkdown)
app.component('EditorHtml',EditorHtml)
app.mount('#app')