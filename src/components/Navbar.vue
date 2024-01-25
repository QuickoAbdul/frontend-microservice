<template>
  <!-- Sidebar -->
  <ul
				class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
				<!-- Sidebar - Brand -->
				<a class="sidebar-brand d-flex align-items-center justify-content-center" href="{{ path('module_list') }}">
					<div class="sidebar-brand-icon rotate-n-15">
						<i class="fas fa-laugh-wink"></i>
					</div>
          <router-link to="/" class="navbar-brand">Ecole</router-link>
				</a>
				<!-- Divider -->
				<hr
				class="sidebar-divider">
				<!-- Nav Item - Dashboard -->
				<li class="nav-item active">
          <div>
        <span v-if="isLoggedIn" class="nav-link">{{ firstname }}</span>
        <router-link v-if="isLoggedIn" @click.prevent="logout" class="nav-link" to="#">Déconnexion</router-link>
        <router-link v-else to="/" class="nav-link">Connexion</router-link>
      </div>
					<a class="nav-link"  v-if="role === 1">
						<i class="fas fa-fw fa-tachometer-alt"></i>
						<span><router-link to="/users" class="nav-link">Gestion Utilisateur</router-link></span>
					</a>
          <a class="nav-link"  v-if="role === 1">
						<i class="fas fa-fw fa-tachometer-alt"></i>
						<span><router-link to="/lessons" class="nav-link">Cours & Planning</router-link></span>
					</a>
          <a class="nav-link"  v-if="role === 1">
						<i class="fas fa-fw fa-tachometer-alt"></i>
						<span><router-link to="/attendance" class="nav-link">Présence</router-link></span>
					</a>
          <a  v-if="role === 3" class="nav-link">
						<i class="fas fa-fw fa-tachometer-alt"></i>
						<span><router-link to="/meslessons" class="nav-link">Mes lessons</router-link></span>
					</a>
				</li>
				<!-- Divider -->
				<hr class="sidebar-divider">
				<div class="sidebar-heading">
					Autres
				</div>
				<!-- Divider -->
				<hr
				class="sidebar-divider d-none d-md-block">

				<!-- Sidebar Toggler (Sidebar) -->
				<div class="text-center d-none d-md-inline">
					<button class="rounded-circle border-0" id="sidebarToggle"></button>
				</div>
			</ul>
      <!-- End of Sidebar -->

</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      isLoggedIn: false,
      role: null, // Ajoutez le rôle de l'utilisateur
    };
  },
  methods: {
    // ... autres méthodes du composant ...

    logout() {
      // Effacez le token du localStorage
      localStorage.removeItem('token');
      
      // Mettez à jour la propriété isLoggedIn dans le composant
      this.isLoggedIn = false;
      this.firstname = null;


      // Redirigez l'utilisateur vers la page de déconnexion (ou une autre page selon vos besoins)
      this.$router.push('/'); // Assurez-vous que vous avez configuré le routeur Vue.js
    },
  },
  created() {
    // Vérifiez si l'utilisateur est connecté lors de la création du composant
    const storedToken = localStorage.getItem('token');

    if (storedToken) {
      // Décoder le token pour obtenir les informations de l'utilisateur
      const decodedToken = JSON.parse(atob(storedToken.split('.')[1]));
      
      // Mettre à jour les propriétés dans le composant
      this.isLoggedIn = true;
      this.firstname = decodedToken.firstname; 
      this.role = decodedToken.user.idRole; // Assurez-vous que le rôle de l'utilisateur est présent dans le token
// Assurez-vous que le nom d'utilisateur est présent dans le token
    }
  },
};
</script>

<style scoped>
/* Styles spécifiques au composant, si nécessaire */
</style>
