import { createRouter, createWebHistory } from 'vue-router';
import UserManagement from '@/views/UserManagement.vue';
import LessonManagement from '@/views/LessonManagement.vue';
import AttendanceManagement from '@/views/AttendanceManagement.vue';
import LessonsDetails from '@/views/LessonsDetails.vue';
import Login from '../components/Login.vue';

const routes = [
  { path: '/', component: Login },
  { path: '/users', component: UserManagement, meta: { requiresAuth: true } },
  { path: '/courses', component: LessonManagement, meta: { requiresAuth: true } },
  { path: '/attendance', component: AttendanceManagement, meta: { requiresAuth: true } },
  { path: '/lessons/:id', name: 'lesson-details', component: LessonsDetails, meta: { requiresAuth: true } },
  // Ajoute d'autres routes au besoin
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token');

  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    // Si la route nécessite une authentification et l'utilisateur n'est pas connecté, redirigez-le vers la page de connexion
    next('/');
  } else {
    // Sinon, autorisez l'accès à la route
    next();
  }
});

export default router;
