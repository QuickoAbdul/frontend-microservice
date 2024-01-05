// /src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import UserManagement from '@/views/UserManagement.vue';
import LessonManagement from '@/views/LessonManagement.vue';
import AttendanceManagement from '@/views/AttendanceManagement.vue';

const routes = [
{ path: '/', redirect: '/users'}, //Pour l'instat
  { path: '/users', component: UserManagement },
  { path: '/courses', component: LessonManagement },
  { path: '/attendance', component: AttendanceManagement },
  // Ajoute d'autres routes au besoin
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
