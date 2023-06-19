import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'framework',
      component: () => import('@/views/Framework.vue'),
      children:[
        {
          path: '/',
          name: 'blog',
          meta:{ title:"博客",activePath:'/' },
          component: () => import('@/views/Blog.vue'),
        },
        {
          path: '/blog/:blogId',
          name: 'blogDetail',
          meta:{ title:"博客详情",activePath:'/' },
          component: () => import('@/views/BlogDetail.vue'),
        },
        {
          path: '/category',
          name: 'category',
          meta:{ title:"分类专栏",activePath:'/category' },
          component: () => import('@/views/Category.vue'),
        },
        {
          path: '/category/:categoryId',
          name: 'categoryDetail',
          meta:{ title:"分类专栏详情",activePath:'/category' },
          component: () => import('@/views/CategoryDetail.vue'),
        },
        {
          path: '/special',
          name: 'special',
          meta:{ title:"专题",activePath:'/special' },
          component: () => import('@/views/Special.vue'),
        },
        {
          path: '/special/:specialId',
          name: 'specialDetail',
          meta:{ title:"专题详情",activePath:'/special' },
          component: () => import('@/views/SpecialDetail.vue'),
        },
        {
          path: '/user',
          name: 'user',
          meta:{ title:"成员",activePath:'/user' },
          component: () => import('@/views/User.vue'),
        },
        {
          path: '/message',
          name: 'message',
          meta:{ title:"留言板",activePath:'/message'},
          component: () => import('@/views/Message.vue'),
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next)=> {
  document.title = to.meta.title;
  next();
})

export default router
