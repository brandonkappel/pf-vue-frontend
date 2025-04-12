import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import HomeView from '../views/Home.vue';
import Login from '../views/Login.vue';
import { useAppStateStore } from '@/stores/appStateStore';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'login', component: Login },
    { path: '', redirect: '/home' },
    {
      path: '/dashboard',
      name: 'dashboard',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Dashboard.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '/home',
          name: 'home',
          component: () => import('../views/Home.vue'),
          meta: { title: 'Home' }
        }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else {
    if (to.meta.title) {
      const appStateStore = useAppStateStore();
      const title = to.meta.title as string;
      appStateStore.setHeaderTitle(title);
    }
    next();
  }
});

export default router;
