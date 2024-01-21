// /src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import UserManagement from '@/views/UserManagement.vue';
import LessonManagement from '@/views/LessonManagement.vue';
import AttendanceManagement from '@/views/AttendanceManagement.vue';
import LessonsDetails from '@/views/LessonsDetails.vue';
const routes = [
{ path: '/', redirect: '/users'}, //Pour l'instat
  { path: '/users', component: UserManagement },
  { path: '/courses', component: LessonManagement },
  { path: '/attendance', component: AttendanceManagement },
  { path: '/lessons/:id', name: 'lesson-details', component: LessonsDetails }, // Add this route

  // Ajoute d'autres routes au besoin
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
