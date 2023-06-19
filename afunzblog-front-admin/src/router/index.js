import { createRouter, createWebHistory } from 'vue-router'
import  VueCookies  from 'vue-cookies';
const routes = [
    {
        name: '登录',
        path: '/login',
        component: () => import('../views/Login.vue'),
    },
    {
        name: '首页',
        path: '/',
        component: () => import('../views/Framework.vue'),
        redirect: '/blog/list',
        children:[
            {
                name:'测试',
                path:'/blog/test',
                component: () => import('../views/blog/Test.vue'),
            },
            {
                name:'博客管理',
                path:'/blog/list',
                component: () => import('../views/blog/Blog.vue'),
            },
            {
                name:'分类管理',
                path:'/blog/category',
                component: () => import('../views/blog/Category.vue'),
            },
            {
                name:'专题管理',
                path:'/special/list',
                component: () => import('../views/special/SpecialList.vue'),
            },
            {
                name:'个人信息',
                path:'/setting/my',
                component: () => import('../views/setting/MyInfo.vue'),
            },
            {
                name:'博客成员',
                path:'/setting/user',
                component: () => import('../views/setting/Teamuser.vue'),
            },
            {
                name:'系统设置',
                path:'/setting/sysSetting',
                component: () => import('../views/setting/SysSetting.vue'),
            },
            {
                name:'回收站',
                path:'/recovery/list',
                component: () => import('../views/recovery/RecoveryList.vue'),
            }
        ]
    }
];

//这里不是通过new来创建，通过createRouter 方法创建，使用的模式不是通过mode来定义
const router = createRouter({
    routes,
    history: createWebHistory(),
})


router.beforeEach((to,from,next)=>{
    const userInfo = VueCookies.get('userInfo')
    if(!userInfo && to.path != '/login'){
        router.push('/login')
    }else{
        next()
    }
})
export default router