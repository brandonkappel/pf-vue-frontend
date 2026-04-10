import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import Login from '../views/Login.vue';

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
          meta: { title: '' }
        },
        {
          path: '/my-workouts',
          name: 'myWorkouts',
          component: () => import('../views/myWorkouts.vue'),
          meta: { title: 'My Workouts' }
        },
        {
          path: '/workout/:id',
          name: 'workout',
          component: () => import('../views/workout.vue'),
          props: true
        },
        {
          path: '/programs',
          name: 'programs',
          // component: Programs,
          component: () => import('../views/programs.vue'),
          meta: { title: 'Programs' }
        },
        {
          path: '/programs/:id',
          name: 'program',
          // component: Programs,
          component: () => import('../views/program.vue'),
          props: true
        },
        {
          path: '/skill-builder',
          name: 'skillBuilder',
          component: () => import('../views/skillBuilder.vue'),
          meta: { title: 'Skill Lab' }
        },
        {
          path: '/skill-programs/:id',
          name: 'skillProgram',
          component: () => import('../views/skillProgram.vue'),
          props: true
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
    }
  ]
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Ensure the authentication status is up to date
  await authStore.autoAuthUser();

  // If the user is already authenticated and tries to access the login page, redirect to home
  if (to.name === 'login' && authStore.isAuthenticated) {
    return next({ name: 'home' });
  }

  // Redirect to login if the route requires authentication and the user isn't authenticated
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next('/login');
  }


  next(); // Proceed to the route
});

export default router;
