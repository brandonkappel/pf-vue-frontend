import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import HomeView from '../views/Home.vue'
import Login from '../views/Login.vue'
import myWorkouts from '../views/myWorkouts.vue'
import Workout from '../views/workout.vue'
import Programs from '../views/programs.vue'
import { useAppStateStore } from '@/stores/appStateStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'login', component: Login },
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
          component: HomeView,
          meta: {title: 'Home'}
        },
        {
          path: '/my-workouts',
          name: 'myWorkouts',
          component: myWorkouts,
          meta: {title: 'My Workouts'}
        },
        {
          path: '/workout/:id',
          name: 'workout',
          component: Workout,
          props: true,
        },
        {
          path: '/programs',
          name: 'programs',
          // component: Programs,
          component: () => import('../views/programs.vue'),
          meta: {title: 'Programs'}
        },
        {
          path: '/programs/:id',
          name: 'program',
          // component: Programs,
          component: () => import('../views/program.vue'),
          props:true
        },
        {
          path: '/about',
          name: 'about',
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import('../views/AboutView.vue')
        }
      ]
    },

  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    if (to.meta.title) {
      const appStateStore = useAppStateStore()
      const title = to.meta.title as string      
      appStateStore.setHeaderTitle(title);
    }
    next()
  }
})

export default router
