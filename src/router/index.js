import { createRouter, createWebHistory } from 'vue-router';
import UserManagement from '@/views/UserManagement.vue';
import LessonManagement from '@/views/LessonManagement.vue';
import AttendanceManagement from '@/views/AttendanceManagement.vue';
import LessonsDetails from '@/views/LessonsDetails.vue';
import UserDetails from '@/views/UserDetails.vue';
import Login from '../components/Login.vue';
import Meslessons from '@/views/MesLessons.vue';

const routes = [
  { path: '/', component: Login },
  { path: '/users', component: UserManagement, meta: { requiresAuth: true, role: 1 } },
  { path: '/lessons', component: LessonManagement, meta: { requiresAuth: true, role: 1 } },
  { path: '/attendance', component: AttendanceManagement, meta: { requiresAuth: true } },
  { path: '/lessons/:id', name: 'lesson-details', component: LessonsDetails, meta: { requiresAuth: true, role: 1 } },
  { path: '/user/:id', name: 'user-details', component: UserDetails, meta: { requiresAuth: true, role: 1 } },
  { path: '/meslessons/:id', name: 'meslessons', component: Meslessons, meta: { requiresAuth: true, role: 3 } },
  // Ajoute d'autres routes au besoin
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token');
  const token = localStorage.getItem('token');

  // Vérifier si la route nécessite une authentification et l'utilisateur n'est pas connecté
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    // Vérifier si la route actuelle n'est pas déjà la page de connexion
    if (to.path !== '/') {
      // Rediriger vers la page de connexion
      next('/');
    } else {
      // La route actuelle est déjà la page de connexion, autoriser l'accès
      next();
    }
  } else {
    // Si l'utilisateur est authentifié, vérifier son rôle
    if (isAuthenticated) {
      const decodedToken = decodeToken(token);
      const userRole = decodedToken.user.idRole;

      // Si l'utilisateur a le rôle 1, donner-lui l'accès à toutes les routes
      if (userRole === 1) {
        next();
      } else {
        // Sinon, vérifier la propriété meta.role pour autoriser l'accès à la route
        if (to.matched.some(record => record.meta.role && record.meta.role === userRole)) {
          next();
        } else {
          // Rediriger vers une page d'erreur ou une autre page appropriée
          next('/');
        }
      }
    } else {
      // Si l'utilisateur n'est pas authentifié, autoriser l'accès à la route
      next();
    }
  }
});

// Méthode pour décoder le token
function decodeToken(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(atob(base64));
}

export default router;
