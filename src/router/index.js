import { createRouter, createWebHistory } from 'vue-router'   
//import UserHomeView from '@/views/UserHomeView.vue'   
import ChatView from '@/views/ChatView.vue'
import ArticleDetailView from '@/views/ArticleDetailView.vue'
import NotFound from '@/views/NotFound.vue'
import HomeView from '../views/HomeView.vue'
import ConsultationView from '../views/ConsultationView.vue'
import ConsultantDetailView from '../views/ConsultantDetailView.vue'
import ConsultantConsultationView from '../views/ConsultantConsultationView.vue'
import ForumDetailView from '../views/ForumDetailView.vue'
const routes = [  
  {   
    path: '/',   
    name: 'home',   
    component: HomeView
  },  
  {   
    path: '/articles',   
    name: 'articles',   
    component: () => import('@/views/ArticlesView.vue'),    
    meta: { requiresAuth: true }  
  },  
  {
    path: '/consultant/articles',
    name: 'consultant-articles',
    component: () => import('@/views/ConsultantArticlesView.vue'),
    meta: { requiresAuth: true }
  },
  {   
    path: '/forum',   
    name: 'forum',   
    component: () => import('@/views/ForumView.vue'),    
    meta: { requiresAuth: true }  
  }, 
  {
    path: '/forum/myposts',
    name: 'my-posts',
    component: () => import('@/views/MyPostsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/forum/joined',
    name: 'joined-forums',
    component: () => import('@/views/JoinedForumsView.vue'),
    meta: { requiresAuth: true }
  },
  {   
    path: '/consultation',   
    name: 'consultation',   
    component: ConsultationView,  
    meta: { requiresAuth: true }  
  },  
  {
    path: '/consultation/book/:id',
    name: 'consultant-detail',
    component: ConsultantDetailView
  },    
  {   
    path: '/login',   
    name: 'login',   
    component: () => import('@/components/Auth/LoginForm.vue')   
  },  
  {   
    path: '/register',   
    name: 'register',   
    component: () => import('@/components/Auth/RegisterForm.vue')   
  },  
  {   
    path: '/profile',   
    name: 'profile',   
    component: () => import('@/views/ProfileView.vue'),    
    meta: { requiresAuth: true }  
  },  
  {   
    path: '/contact',   
    name: 'contact',   
    component: () => import('@/views/ContactView.vue'),    
    meta: { requiresAuth: true }  
  },
  {   
    path: '/my/appointments',   
    name: 'my-appointments',   
    component: () => import('@/views/MyAppointmentsView.vue'),    
    meta: { requiresAuth: true }  
  },
  {
    path: '/article/:id',
    name: 'ArticleDetail',
    component: ArticleDetailView,
    props: true
  },
  {
    path: '/forum/:id',
    name: 'ForumDetail',
    component: ForumDetailView,
    props: true
  },
  {
    path: '/chat/:id',
    name: 'Chat',
    component: ChatView,
    meta: { requiresAuth: true }
  },
  {
    path: '/404',
    name: 'NotFound',
    component: NotFound
  },
  {
    path: '/consultant/consultation',
    name: 'consultant-consultation',
    component: ConsultantConsultationView,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]  

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {  
  const isAuthenticated = localStorage.getItem('token')  
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {  
    next('/login')  
  } else {  
    next()  
  }  
}) 

export default router 